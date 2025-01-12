from fastapi import FastAPI # type: ignore

# Initialize the FastAPI app
app = FastAPI()

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Developer's Assistant Backend!"}
