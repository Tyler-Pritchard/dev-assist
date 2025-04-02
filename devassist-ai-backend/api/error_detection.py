from fastapi import APIRouter, HTTPException, Depends
from utils.model_loader import ModelLoader
from services.error_detection_service import ErrorDetectionService

# Create the router
router = APIRouter()

# Initialize the error detection service
error_detection_service = ErrorDetectionService()

@router.post("/detect-errors")
async def detect_errors(
    logs: str,
    model_loader: ModelLoader = Depends(lambda: ModelLoader(model_name="facebook/bart-large-mnli"))
):
    """
    API endpoint to detect errors in logs.

    Args:
        logs (str): The logs to analyze.
        model_loader (ModelLoader): The model loader instance provided via dependency injection.

    Returns:
        dict: The analysis result containing detected errors.
    """
    if not logs.strip():
        raise HTTPException(status_code=400, detail="Input logs cannot be empty.")

    try:
        result = error_detection_service.detect_errors(logs, model_loader)
        return {"errors": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
