import os
from dotenv import load_dotenv
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

# Load environment variables from .env file
load_dotenv()

class ModelLoader:
    """
    Handles loading and inference for the AI model.
    """

    def __init__(self):
        self.model_name = "CodeParrot/codeparrot-small"  # Update with the correct model name
        self.tokenizer = None
        self.model = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

        self._load_model()

    def _load_model(self):
        """
        Load the tokenizer and model into memory and move the model to the appropriate device.
        """
        huggingface_token = os.getenv("HUGGINGFACE_TOKEN")
        if not huggingface_token:
            raise ValueError("Hugging Face token is missing. Ensure it is set in the .env file.")

        print(f"Loading model {self.model_name} on device: {self.device}")
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name, token=huggingface_token)
        self.model = AutoModelForCausalLM.from_pretrained(self.model_name, token=huggingface_token)
        self.model.to(self.device)

    def generate_response(self, prompt: str) -> str:
        """
        Generate a response for a given prompt.

        Args:
            prompt (str): The input prompt.

        Returns:
            str: The model's generated response.
        """
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.device)
        outputs = self.model.generate(**inputs, max_new_tokens=100, pad_token_id=self.tokenizer.eos_token_id)
        return self.tokenizer.decode(outputs[0], skip_special_tokens=True)
