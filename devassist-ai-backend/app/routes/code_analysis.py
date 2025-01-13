import logging
from fastapi import APIRouter, HTTPException, Depends
from models.text_request import TextRequest
from services.code_analysis_service import CodeAnalysisService

# Initialize the router and the service
router = APIRouter()
code_analysis_service = CodeAnalysisService()

@router.post("/analyze-code")
async def analyze_code(request: TextRequest, service: CodeAnalysisService = Depends()):
    """
    Endpoint to analyze code.
    
    Args:
        request (TextRequest): The input containing the code to analyze.
    
    Returns:
        dict: The analysis result.
    """
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Input code cannot be empty.")

    try:
        logging.info(f"Analyzing code: {request.text}")
        # Use the service to perform code analysis
        result = service.analyze_code(request.text)
        return {"analysis": result}
    except Exception as e:
        logging.error(f"Error analyzing code: {e}")
        raise HTTPException(status_code=500, detail="Error analyzing code.")
