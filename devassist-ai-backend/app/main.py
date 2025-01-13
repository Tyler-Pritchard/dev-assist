import logging
import os
from models.text_request import TextAnalysisRequest
from fastapi import FastAPI, File, UploadFile, HTTPException # type: ignore
from utils.file_handler import ensure_temp_dir, cleanup_files, validate_file_type, calculate_file_size
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from utils.model_loader import ModelLoader


# Initialize FastAPI app
app = FastAPI()

# Load CodeParrot model on startup
model_loader = ModelLoader()

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


@app.post("/summarize-text")
async def summarize_text(request: TextAnalysisRequest):
    """
    Endpoint to summarize input text.

    Args:
        request (TextAnalysisRequest): Input text wrapped in a Pydantic model.

    Returns:
        dict: Original and summarized text.
    """
    try:
        logging.info(f"Received text for summarization: {request.text}")
        response = model_loader.summarize_text(request.text)
        logging.info(f"Summarization response: {response}")
        return {"summary": response}
    except Exception as e:
        logging.error(f"Error during text summarization: {e}")
        raise HTTPException(status_code=500, detail="An error occurred during text summarization.")



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

@app.post("/analyze-code")
async def analyze_code(request: TextAnalysisRequest): # type: ignore
    """
    Endpoint to analyze code.
    """
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Input code cannot be empty.")

    try:
        result = model_loader.analyze_code(request.text)
        return {"analysis": result}
    except Exception as e:
        logging.error(f"Error analyzing code: {e}")
        raise HTTPException(status_code=500, detail="Error analyzing code.")