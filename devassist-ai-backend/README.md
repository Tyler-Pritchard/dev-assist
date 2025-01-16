# AI Developer’s Assistant (MVP)

## Overview
The AI Developer’s Assistant is a cutting-edge application designed to empower software developers operating in data-secure environments. This solution eliminates the risks associated with transmitting sensitive data to third-party services by providing a **self-contained, GPU-accelerated AI development environment**. Developers can harness the power of artificial intelligence to analyze, build, and maintain applications—all while maintaining complete control over their data.

This project serves as a proof of concept for a highly secure, efficient, and scalable AI-driven solution leveraging NVIDIA’s GPU technology to accelerate AI workloads.

---

## Key Features

### 1. **Self-Contained AI Environment**
- AI processing is executed entirely within the application’s local environment, ensuring that sensitive data never leaves the secure infrastructure.
- No reliance on external APIs, maintaining full control over data privacy and compliance.

### 2. **GPU-Accelerated Performance**
- Leverages NVIDIA GPUs to accelerate AI inference tasks, enabling faster, more efficient processing.
- Optimized for both single-GPU and multi-GPU setups, with fallbacks for CPU-only environments.

### 3. **AI-Driven Analysis**
- Provides robust analysis for text and Python code, leveraging state-of-the-art AI models with enhanced precision:
  - Text summarization using facebook/bart-large-mnli with refined prompts for concise and focused outputs.
  - Code analysis using facebook/incoder-1B with stricter prompts to ensure clarity and actionable feedback.
- Incorporates advanced filtering mechanisms to exclude irrelevant examples or verbose outputs.
- Designed for modular expansion to support additional AI tasks in future iterations.

### 4. **Secure by Design**
- Dockerized backend with NVIDIA Container Toolkit ensures isolated, secure execution.
- Temporary data storage and cleanup mechanisms minimize exposure of sensitive information.

---

## Architecture

### High-Level Workflow
### High-Level Workflow
1. **Input**:
   - Users provide input via the React-based frontend:
     - **Text Summarization**: Enter text data directly into a designated input field.
     - **Code Analysis**: Paste Python code into the code analysis input field.

2. **Processing**:
   - The backend, built in Python and powered by FastAPI, processes the input using AI models:
     - **Text Summarization**: The `facebook/bart-large-mnli` model generates concise summaries with optimized prompts.
     - **Code Analysis**: The `facebook/incoder-1B` model provides actionable insights for Python code, including error detection, improvement suggestions, and adherence to best practices.

3. **Output**:
   - Results are formatted and sent back to the frontend:
     - **Text Summarization**: A clear, concise summary is displayed.
     - **Code Analysis**: A detailed analysis report with recommendations is shown in a user-friendly format.


### Technology Stack
- **Frontend**: React (interactive UI for input/output)
- **Backend**: Python (FastAPI for API endpoints)
- **AI Framework**: PyTorch, utilizing:
  - `facebook/bart-large-mnli` for text summarization.
  - `facebook/incoder-1B` for code analysis.
- **Containerization**: Docker with NVIDIA Container Toolkit
- **Hardware**: NVIDIA GPUs for acceleration

---

## Initial Functionality

### API Endpoints
- **`/summarize/summarize-text`**:
  - Provides clear and concise text summarization using enhanced AI prompts.
- **`/code-analysis/analyze-code`**:
  - Delivers actionable feedback for Python code, leveraging stricter prompts and advanced filtering.

### GPU Acceleration
- Utilizes CUDA for GPU acceleration where available.
- Logs comparative performance metrics for GPU and CPU modes.

### Security Features
- Local-only AI model inference with no external API calls, ensuring complete data privacy.

---

## Core API Development

### API Endpoints

#### `/summarize/summarize-text`
- **Functionality**:
  - Accepts JSON input containing text data.
  - Returns a concise summary of the provided text using the `facebook/bart-large-mnli` model with optimized prompts.
- **Validation**:
  - Text input must be non-empty.
  - Maximum character limit of 1,000 characters enforced.
- **Optimized Features**:
  - Stricter prompts focus responses on generating concise, clear summaries.
  - Enhanced processing ensures summaries are relevant and avoid verbose or repetitive content.

**Example Request**:
```bash
curl -X POST "http://127.0.0.1:8000/summarize/summarize-text" \
-H "Content-Type: application/json" \
-d '{"text": "This is a long text that needs to be summarized."}'
```

**Example Response**:
```json
{
  "summary": "This text needs to be summarized concisely and effectively."
}
```

---

#### `/code-analysis/analyze-code`
- **Functionality**:
  - Accepts JSON input containing Python code.
  - Provides detailed feedback on the provided code using the `facebook/incoder-1B` model, including:
    - Identification of errors or potential issues.
    - Suggestions for improvement (e.g., type annotations, input validation, naming conventions).
    - Assessment of adherence to Python best practices (readability, efficiency, clarity).
  - Stricter prompts focus responses solely on actionable insights.
  - Filtering mechanisms remove unrelated examples or verbose content for clarity.

- **Validation**:
  - Code input must be non-empty.

**Example Request**:
```bash
curl -X POST "http://127.0.0.1:8000/code-analysis/analyze-code" \
-H "Content-Type: application/json" \
-d '{"text": "def add(a, b):\n    return a + b"}'
```

**Example Response**:
```json
{
  "analysis": "The function 'add' is clear but could benefit from type annotations (e.g., `def add(a: int, b: int) -> int`). Adding input validation to ensure `a` and `b` are numeric can improve robustness."
}
```

---

#### Removed or Deprecated Endpoints

- **`/analyze-text`**:
  - Replaced by `/summarize/summarize-text`.
  - Now supports detailed summarization with a focus on clarity and brevity.

- **`/upload-file`**:
  - This functionality has been deprecated and is no longer supported in the current architecture.
  - File analysis features will be reintroduced in future updates if needed, with enhanced security and processing capabilities.

---

## Input Validation
- **Text Validation**:
  - Implemented with Pydantic validators.
  - Ensures input strings are non-empty and free from invalid characters.
  - Enforces a maximum character limit of 1,000 characters.
  - Handles edge cases like excessively long or malformed input, returning detailed error messages.
- **Code Validation**:
  - Validates that Python code input is syntactically correct and non-empty.
  - Filters out incomplete or irrelevant examples to focus analysis strictly on the provided function.
  - Applies stricter prompts to ensure concise and actionable feedback.
- **Deprecated File Validation**:
  - The file upload endpoint has been deprecated. File analysis will be reintroduced in future updates with enhanced security and validation mechanisms.
  
---

## Getting Started

### Prerequisites
1. **Hardware**:
   - NVIDIA GPU with CUDA support.
2. **Software**:
   - Python 3.8+ and package manager (e.g., pip).

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/tyler-pritchard/devassist-ai-backend.git
   cd devassist-ai-backend
   ```

2. **Choose and Set Up an Environment**: Depending on your system and requirements, you can use either `venv` or `conda`.

   #### **Option A: Using `venv`** (Recommended for macOS or if CUDA is not required)
   - Create and activate the virtual environment:
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate  # On macOS/Linux
     .venv\Scripts\activate     # On Windows
     ```

   #### **Option B: Using `conda`** (Recommended for Linux or GPU-enabled systems)
   - Create and activate the Conda environment:
     ```bash
     conda create -n devassist-env python=3.12 -y
     conda activate devassist-env
     ```

3. **Install Dependencies**: Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

   > **Note**: If you encounter a missing package error, ensure `python-multipart` is installed:
   ```bash
   pip install python-multipart
   ```

4. **Run the Application**: Start the FastAPI backend:
   ```bash
   uvicorn app.main:app --reload
   ```

5. **Test the Application**:
   - Visit the FastAPI documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).
   - Test the `/upload-file` or `/analyze-text` endpoints directly from the interactive UI.

---

### Additional Notes

- **For GPU Acceleration**: If GPU acceleration is required, ensure you're using a Linux system with an NVIDIA GPU. Install PyTorch with CUDA support:
  ```bash
  conda install pytorch torchvision torchaudio pytorch-cuda=11.7 -c pytorch -c nvidia
  ```

- **For macOS Users**: If CUDA is not available, you can use MPS (Metal Performance Shaders) for GPU acceleration:
  ```bash
  pip install torch torchvision torchaudio

Visit `http://localhost:8000` to confirm the application is running.

### Known Warnings

#### 1. **`do_sample` and `top_p` Warnings**
- **Description**: The `transformers` library generates warnings if `do_sample` is set to `False` while parameters like `temperature` and `top_p` are configured. These parameters are only effective in sampling-based generation modes.
- **Mitigation**: The configuration ensures `do_sample=True` is set when required, or irrelevant parameters are unset to avoid conflicts.

#### 2. **Tokenizer Padding Warnings**
- **Description**: When the tokenizer lacks a dedicated padding token, warnings may appear, such as:
  ```
  Asking to pad but the tokenizer does not have a padding token.
  ```
- **Mitigation**: The `pad_token` is explicitly set to `eos_token` (`end-of-sequence token`) for models like `facebook/incoder-1B`. This ensures compatibility and suppresses warnings while maintaining functional correctness.

#### 3. **Attention Mask Warnings**
- **Description**: Warnings may arise when the attention mask is not explicitly set:
  ```
  The attention mask and the pad token id were not set. As a consequence, you may observe unexpected behavior.
  ```
- **Mitigation**: The implementation ensures the attention mask is passed during inference where required. If it cannot be inferred from the input, fallback behavior is used to maintain output reliability.

### Running the Application in a Dockerized Environment

To ensure secure and portable deployment, the backend can be containerized with Docker. Follow these steps to build and run the container:

1. **Build the Docker Image**:
   ```bash
   docker build -t ai-assistant .
   ```

2. **Run the Docker Container**:

   - Ensure you have an NVIDIA GPU available and the NVIDIA Container Toolkit installed.
   - Start the container with GPU support:
   ```bash
   docker run --gpus all -p 8000:8000 ai-assistant
   ```

3. **Access the Application**:

   - Frontend: `http://localhost:3000` (if the frontend is running separately)
   - Backend: `http://localhost:8000`
  
This containerized setup enables GPU acceleration for AI workloads while maintaining a secure, isolated execution environment.

---

## Example Use Case

### Problem
A healthcare provider needs an AI-powered tool to analyze sensitive patient records but cannot risk sending the data to external services due to privacy regulations.

### Solution
Using the AI Developer’s Assistant:
1. The provider uploads patient records to the application.
2. The backend processes the data using a local AI model accelerated by NVIDIA GPUs.
3. The AI model identifies patterns and provides insights, all while ensuring data never leaves the secure environment.
4. Results are displayed on the frontend in real time.

---

## Roadmap

1. **Initial MVP**:
   - Basic AI-driven text and file analysis.
   - GPU-accelerated inference with comparative performance metrics.
   - Secure containerized deployment.
2. **Future Enhancements**:
   - Multi-GPU and distributed workload support.
   - Telemetry and real-time GPU utilization monitoring.
   - Expanded AI capabilities (e.g., multi-language support, advanced analytics).

---

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your proposed changes. For major updates, open an issue to discuss the changes first.

---

## License
This project is licensed under the MIT License.

---

## Contact
For inquiries or support, please contact Tyler Pritchard at [pritchard.tyler@gmail.com](mailto:pritchard.tyler@gmail.com).
