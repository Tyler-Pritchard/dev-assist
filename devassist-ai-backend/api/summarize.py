from fastapi import APIRouter, HTTPException, Depends
from models.text_request import TextRequest
from services.summarize_service import SummarizeService
from utils.model_loader import ModelLoader

# Create the router
router = APIRouter()

# Initialize the model loader and summarization service
model_loader = ModelLoader(model_name="facebook/bart-large-cnn")
summarize_service = SummarizeService(model_loader=model_loader)

@router.post("/summarize-text")
async def summarize_text(request: TextRequest):
    """
    API endpoint to summarize text.
    """
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Input text cannot be empty.")

    try:
        # Use the summarization service to summarize the text
        summary = summarize_service.summarize_text(request.text)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
