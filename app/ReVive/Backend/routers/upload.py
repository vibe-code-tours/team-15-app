import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

from config import get_settings
from dependencies import get_current_user
from schemas.response import success_response, error_response
import models

settings = get_settings()

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
)

router = APIRouter(prefix="/api/upload", tags=["upload"])

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
MAX_FILES = 5


@router.post("/")
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
            content=error_response("Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env"),
        )

    urls = []
    for file in files:
        # Validate content type
        content_type = file.content_type or ""
        if content_type not in ALLOWED_TYPES:
            return JSONResponse(
                status_code=400,
                content=error_response(f"File '{file.filename}' is not a valid image. Allowed: JPG, PNG, GIF, WebP"),
            )

        # Read and validate size
        contents = await file.read()
        if len(contents) > MAX_FILE_SIZE:
            return JSONResponse(
                status_code=400,
                content=error_response(f"File '{file.filename}' exceeds 10MB limit"),
            )

        # Upload to Cloudinary
        try:
            result = cloudinary.uploader.upload(
                contents,
                folder="revive_uploads",
                resource_type="image",
            )
            urls.append(result["secure_url"])
        except Exception as e:
            return JSONResponse(
                status_code=500,
                content=error_response(f"Failed to upload '{file.filename}': {str(e)}"),
            )

    return success_response(data={"urls": urls})
