import os
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends  # type: ignore
from utils.file_handler import ensure_temp_dir, validate_file_type, calculate_file_size
from fastapi.middleware.cors import CORSMiddleware  # type: ignore
from utils.model_loader import ModelLoader
from app.routes import summarize, code_analysis, error_detection

# Initialize FastAPI app
app = FastAPI()

# Initialize a single model loader instance with a default model
model_loader = ModelLoader(model_name="CodeParrot/codeparrot-small")

# Include routers
app.include_router(summarize.router, prefix="/summarize", tags=["Summarization"])
app.include_router(code_analysis.router, prefix="/code-analysis", tags=["Code Analysis"])
app.include_router(error_detection.router, prefix="/error-detection", tags=["Error Detection"])

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins. Adjust for security in production.
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods.
    allow_headers=["*"],  # Allows all headers.
)

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
    allowed_extensions = [".txt", ".log", ".py", ".js"]
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
