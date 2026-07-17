import uuid
from typing import Dict, List
from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_

from database import get_db
from dependencies import get_current_user
from schemas.chat import ChatMessageCreate, ChatMessageResponse, WebSocketMessage
from models.chat import DirectMessage
from models.auth import User
from middleware.rate_limit import rate_limiter

router = APIRouter(prefix="/api/messages", tags=["messages"])

from services.websocket import websocket_manager

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: uuid.UUID, db: Session = Depends(get_db)):
    # Note: In production, you would want to securely authenticate the WebSocket connection.
    # We rely on the client passing their user_id for this implementation.
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    await websocket_manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_json()
            ws_message = WebSocketMessage(**data)
            
            if ws_message.type == "message":
                # Rate limit: 30 messages per minute
                rate_limiter.check(f"{user_id}:ws", 30, 60)

                # Save to database
                new_msg = DirectMessage(
                    sender_id=user_id,
                    receiver_id=ws_message.receiver_id,
                    content=ws_message.content
                )
                db.add(new_msg)
                db.commit()
                db.refresh(new_msg)

                # Broadcast to receiver if online
                payload = {
                    "type": "message",
                    "message": {
                        "id": str(new_msg.id),
                        "sender_id": str(new_msg.sender_id),
                        "receiver_id": str(new_msg.receiver_id),
                        "content": new_msg.content,
                        "created_at": new_msg.created_at.isoformat(),
                    }
                }
                
                await websocket_manager.send_personal_message(payload, ws_message.receiver_id)
                
                # Also send back to sender for confirmation
                await websocket_manager.send_personal_message(payload, user_id)
                
    except WebSocketDisconnect:
        await websocket_manager.disconnect(websocket, user_id)


from schemas.response import success_response

@router.get("/{other_user_id}")
def get_chat_history(
    other_user_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    messages = (
        db.query(DirectMessage)
        .filter(
            or_(
                and_(DirectMessage.sender_id == current_user.id, DirectMessage.receiver_id == other_user_id),
                and_(DirectMessage.sender_id == other_user_id, DirectMessage.receiver_id == current_user.id)
            )
        )
        .order_by(DirectMessage.created_at.asc())
        .all()
    )
    
    # We must convert SQLAlchemy objects to dicts manually since success_response expects JSON-serializable data
    # OR we can just let FastAPI serialize it if we return a dict that matches success_response
    data = []
    for msg in messages:
        data.append({
            "id": str(msg.id),
            "sender_id": str(msg.sender_id),
            "receiver_id": str(msg.receiver_id),
            "content": msg.content,
            "created_at": msg.created_at.isoformat(),
            "read_at": msg.read_at.isoformat() if msg.read_at else None
        })

    return success_response(data=data)
