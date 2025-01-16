import os
from dotenv import load_dotenv
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

# Load environment variables from .env file
load_dotenv()

class ModelLoader:
    """
    Handles loading and inference for AI models.
    """

    def __init__(self, model_name: str):
        self.model_name = model_name
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.tokenizer = None
        self.model = None
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

        # Ensure pad_token is set
        if self.tokenizer.pad_token is None:
            if self.tokenizer.eos_token is None:
                self.tokenizer.add_special_tokens({'pad_token': '[PAD]'})
            else:
                print("Setting pad_token to eos_token.")
                self.tokenizer.pad_token = self.tokenizer.eos_token

        self.model = AutoModelForCausalLM.from_pretrained(self.model_name, token=huggingface_token)
        self.model.to(self.device)


    def get_model(self):
        """
        Returns the model and tokenizer.
        """
        return self.model, self.tokenizer
