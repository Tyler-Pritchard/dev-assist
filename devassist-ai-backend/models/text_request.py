from pydantic import BaseModel, Field, validator  # type: ignore

class TextRequest(BaseModel):
    text: str = Field(..., description="The text to be analyzed.")
    @validator("text")
    def validate_text(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Text cannot be empty.")
        max_length = 1000
        if len(value) > max_length:
            raise ValueError(f"Text exceeds maximum length of {max_length} characters.")
        return value

class TextAnalysisRequest(TextRequest):
    """
    Extends TextRequest for additional analysis needs.
    """
    pass

class DetectErrorsRequest(TextRequest):
    pass
