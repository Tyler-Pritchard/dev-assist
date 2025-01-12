import os
from fastapi import FastAPI, File, UploadFile, HTTPException # type: ignore
from models.text_request import TextAnalysisRequest
from utils.file_handler import ensure_temp_dir, cleanup_files, validate_file_type, calculate_file_size

# Initialize FastAPI app
app = FastAPI()

# Ensure temporary directory exists on application startup
ensure_temp_dir()


@app.get("/")
def read_root() -> dict:
    """
    Root endpoint for the API.

    Returns:
        dict: A welcome message.
    """
    return {"message": "Welcome to the AI Developer's Assistant Backend!"}


@app.post("/analyze-text")
async def analyze_text(request: TextAnalysisRequest) -> dict:
    """
    Endpoint to analyze text input.

    Args:
        request (TextAnalysisRequest): A validated text analysis request.

    Returns:
        dict: A placeholder response containing the original text and a message.
    """
    # Placeholder processing logic
    response = {
        "original_text": request.text,
        "message": "Text analysis placeholder response"
    }
    return response


@app.post("/upload-file")
async def upload_file(file: UploadFile = File(...)) -> dict:
    """
    Endpoint to upload and validate files.

    Args:
        file (UploadFile): The file to be uploaded.

    Returns:
        dict: A response indicating successful upload and validation.

    Raises:
        HTTPException: If the file type is invalid or exceeds the maximum allowed size.
    """
    allowed_extensions = [".txt", ".log", ".py"]
    max_file_size = 5 * 1024 * 1024  # 5MB

    # Validate file type
    validate_file_type(file.filename, allowed_extensions)

    # Calculate file size
    file_size = calculate_file_size(file.file)
    if file_size > max_file_size:
        raise HTTPException(status_code=400, detail=f"File too large: {file.filename}")

    # Save file to the temporary directory
    file_path = os.path.join("temp_files", file.filename)
    try:
        with open(file_path, "wb") as buffer:
            for chunk in file.file:
                buffer.write(chunk)
    except OSError as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {e}")

    return {
        "filename": file.filename,
        "message": "File uploaded and validated successfully."
    }
