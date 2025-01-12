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
- Provides robust analysis for text and files, such as text summarization, code generation, or error detection.
- Designed for modular expansion to support additional AI tasks in future iterations.

### 4. **Secure by Design**
- Dockerized backend with NVIDIA Container Toolkit ensures isolated, secure execution.
- Temporary data storage and cleanup mechanisms minimize exposure of sensitive information.

---

## Architecture

### High-Level Workflow
1. **Input**: Users upload files or input text via the React-based frontend.
2. **Processing**: The backend, built in Python, processes the input using a GPU-accelerated AI model.
3. **Output**: Results are sent back to the frontend and displayed in a user-friendly format.

### Technology Stack
- **Frontend**: React (interactive UI for input/output)
- **Backend**: Python (FastAPI or Flask for API endpoints)
- **AI Framework**: PyTorch or TensorFlow (for GPU-accelerated AI tasks)
- **Containerization**: Docker with NVIDIA Container Toolkit
- **Hardware**: NVIDIA GPUs for acceleration

---

## Initial Functionality

### API Endpoints
- **`/analyze-text`**:
  - Accepts text input.
  - Returns a summary or analysis result using AI inference.
- **`/upload-file`**:
  - Accepts file input (e.g., code files).
  - Outputs results, such as error detection or suggestions.

### GPU Acceleration
- Utilizes CUDA for GPU acceleration.
- Logs comparative performance metrics (CPU vs. GPU).

### Security Features
- Fully containerized backend for secure deployment.
- Local-only model inference; no external API calls.

---

## Getting Started

### Prerequisites
1. **Hardware**:
   - NVIDIA GPU with CUDA support.
2. **Software**:
   - Docker with NVIDIA Container Toolkit installed.
   - Python 3.8+ and package manager (e.g., pip).

### Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/tyler-pritchard/devassist-ai-backend.git
   cd devassist-ai-backend
   ```
2. **Create and Activate a Virtual Environment**:
   ```
   python3 -m venv venv
   source venv/bin/activate
   ```
3. **Install Dependencies**:
   ```
   pip install -r requirements.txt
   ```
4. **Run the Application**:
   ```
   uvicorn app.main:app --reload
   ```
   
Visit http://localhost:8000 to confirm the application is running.


1. Build and run the Docker container:
   ```bash
   docker build -t ai-assistant .
   docker run --gpus all -p 8000:8000 ai-assistant
   ```
2. Access the application:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8000`

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
