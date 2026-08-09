import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

from config import get_settings
from dependencies import get_current_user, require_rate_limit
from schemas.response import success_response, error_response
import models
import asyncio

settings = get_settings()

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
)

router = APIRouter(prefix="/api/upload", tags=["upload"])

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
MAX_FILES = 5

def get_magic_mime(file_bytes: bytes) -> str | None:
    if file_bytes.startswith(b'\xff\xd8\xff'):
        return 'image/jpeg'
    if file_bytes.startswith(b'\x89PNG\r\n\x1a\n'):
        return 'image/png'
    if file_bytes.startswith(b'GIF87a') or file_bytes.startswith(b'GIF89a'):
        return 'image/gif'
    if file_bytes.startswith(b'RIFF') and file_bytes[8:12] == b'WEBP':
        return 'image/webp'
    return None


@router.post("/", dependencies=[Depends(require_rate_limit(10, 60))])
async def upload_images(
    files: list[UploadFile] = File(...),
    current_user: models.User = Depends(get_current_user),
):
    if len(files) > MAX_FILES:
        return JSONResponse(
            status_code=400,
            content=error_response(f"Maximum {MAX_FILES} files allowed"),
        )

    if not settings.CLOUDINARY_CLOUD_NAME or settings.CLOUDINARY_CLOUD_NAME == "your_cloud_name_here":
        return JSONResponse(
            status_code=500,
            content=error_response("Image upload service is currently unavailable."),
        )

    # Validate and read all files
    upload_tasks = []
    for file in files:
        contents = await file.read()
        
        if len(contents) > MAX_FILE_SIZE:
            return JSONResponse(
                status_code=400,
                content=error_response(f"File '{file.filename}' exceeds 5MB limit"),
            )

        mime_type = get_magic_mime(contents)
        if mime_type not in ALLOWED_TYPES:
            return JSONResponse(
                status_code=400,
                content=error_response(f"File '{file.filename}' is not a valid image. Allowed: JPG, PNG, GIF, WebP"),
            )

        upload_tasks.append(
            asyncio.to_thread(
                cloudinary.uploader.upload,
                contents,
                folder="revive_uploads",
                resource_type="image",
            )
        )

    # Upload all files concurrently
    try:
        results = await asyncio.gather(*upload_tasks)
        urls = [res["secure_url"] for res in results]
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content=error_response("Failed to upload images. Please try again later."),
        )

    return success_response(data={"urls": urls})
