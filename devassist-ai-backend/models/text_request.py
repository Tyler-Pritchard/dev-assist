from pydantic import BaseModel, Field, validator # type: ignore


class TextAnalysisRequest(BaseModel):
    """
    Pydantic model representing the input for text analysis requests.

    Attributes:
        text (str): The text to be analyzed. Must be a non-empty string and not exceed a specified maximum length.
    """
    text: str = Field(..., description="The text to be analyzed.")

    @validator("text")
    def validate_text(cls, value: str) -> str:
        """
        Validates the input text for the following conditions:
        - The text cannot be empty.
        - The text cannot exceed the maximum allowed length.

        Args:
            value (str): The input text to validate.

        Returns:
            str: The validated input text.

        Raises:
            ValueError: If the text is empty or exceeds the maximum allowed length.
        """
        if not value.strip():
            raise ValueError("Text cannot be empty.")
        max_length = 1000  # Example: Maximum length for input text
        if len(value) > max_length:
            raise ValueError(f"Text exceeds maximum length of {max_length} characters.")
        return value
