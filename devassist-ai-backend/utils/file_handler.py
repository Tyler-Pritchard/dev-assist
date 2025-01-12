import os
from fastapi import HTTPException # type: ignore
from typing import List

# Directory for storing uploaded files
TEMP_DIR = "temp_files"


def ensure_temp_dir() -> None:
    """
    Ensures the existence of the temporary directory for file uploads.
    If the directory does not exist, it is created.

    Raises:
        OSError: If the directory cannot be created due to a filesystem error.
    """
    if not os.path.exists(TEMP_DIR):
        try:
            os.makedirs(TEMP_DIR)
        except OSError as e:
            raise RuntimeError(f"Failed to create directory '{TEMP_DIR}': {e}")


def cleanup_files() -> None:
    """
    Removes all files in the temporary directory to free up storage space.

    Logs:
        A warning message is printed for each file that fails to delete.
    """
    for filename in os.listdir(TEMP_DIR):
        file_path = os.path.join(TEMP_DIR, filename)
        try:
            os.remove(file_path)
        except Exception as e:
            print(f"Error deleting file {file_path}: {e}")


def validate_file_type(filename: str, allowed_extensions: List[str]) -> None:
    """
    Validates that the uploaded file has an allowed extension.

    Args:
        filename (str): The name of the uploaded file.
        allowed_extensions (List[str]): A list of allowed file extensions (e.g., [".txt", ".log", ".py"]).

    Raises:
        HTTPException: If the file extension is not in the allowed list.
    """
    file_extension = filename.split(".")[-1]
    if f".{file_extension}" not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f"Invalid file type: {filename}")


def calculate_file_size(file) -> int:
    """
    Calculates the total size of an uploaded file in bytes.

    Args:
        file: The uploaded file object (typically a stream).

    Returns:
        int: The total size of the file in bytes.
    """
    size = 0
    try:
        for chunk in file:
            size += len(chunk)
    except Exception as e:
        raise RuntimeError(f"Error calculating file size: {e}")
    return size
