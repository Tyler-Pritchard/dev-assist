import logging
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
        self.model_name = "CodeParrot/codeparrot-small"
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForCausalLM.from_pretrained(self.model_name).to(self.device)

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
        
        # Define a padding token if it's not already set
        if self.tokenizer.pad_token is None:
            self.tokenizer.add_special_tokens({'pad_token': self.tokenizer.eos_token})
        
        self.model = AutoModelForCausalLM.from_pretrained(self.model_name, token=huggingface_token)
        self.model.to(self.device)

    def summarize_text(self, text: str) -> str:
        """
        Summarizes the given input text using the loaded model.

        Args:
            text (str): The text to summarize.

        Returns:
            str: The summarized version of the input text.
        """
        # Truncate text if necessary
        max_input_tokens = 512
        tokens = self.tokenizer.tokenize(text)
        if len(tokens) > max_input_tokens:
            text = self.tokenizer.convert_tokens_to_string(tokens[:max_input_tokens])
            print("Input text was truncated to fit the model's maximum input size.")

        # Tokenize the input text with attention mask
        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            max_length=max_input_tokens,
            truncation=True,
            padding="max_length"
        ).to(self.device)

        # Generate the summary
        outputs = self.model.generate(
            inputs["input_ids"],
            attention_mask=inputs["attention_mask"],  # Explicit attention mask
            max_new_tokens=100,  # Specify tokens to generate
            min_length=30,
            length_penalty=2.0,
            num_beams=4,
            early_stopping=True,
            pad_token_id=self.tokenizer.pad_token_id  # Explicitly set pad token
        )

        # Decode and return the summarized text
        summary = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return summary

    def analyze_code(self, code: str) -> str:
        """
        Analyze the given code for insights.

        Args:
            code (str): The code snippet to analyze.

        Returns:
            str: Analysis results.
        """
        try:
            logging.info("Analyzing code input")
            prompt = f"""
            You are a professional Python code reviewer. Analyze the following function and provide:
            - Errors or potential bugs in the function.
            - Specific improvements (e.g., type annotations, input validation, naming conventions).
            - Assessment of adherence to Python best practices (readability, efficiency, clarity).
            Only analyze the given function. Avoid generating unrelated code or testing scenarios.
            Function:
            {code}
            """
            input_ids = self.tokenizer.encode(prompt, return_tensors="pt").to(self.device)
            output = self.model.generate(
                input_ids,
                max_new_tokens=100,
                pad_token_id=self.tokenizer.pad_token_id,
                length_penalty=1.5,
                num_beams=4,
                temperature=0.7,
                top_p=0.85,
                repetition_penalty=2.5,  # Higher penalty for repeated patterns
                early_stopping=True
            )
            analysis = self.tokenizer.decode(output[0], skip_special_tokens=True)
            processed_analysis = self._clean_analysis_output(analysis)
            logging.info(f"Cleaned analysis result: {processed_analysis}")
            return processed_analysis.strip()
        except Exception as e:
            logging.error(f"Error analyzing code: {e}")
            return "Error analyzing code."

    def _clean_analysis_output(self, output: str) -> str:
        lines = output.split("\n")
        clean_lines = []
        seen_lines = set()
        for line in lines:
            line = line.strip()
            if line and not line.startswith("self.") and line not in seen_lines:
                clean_lines.append(line)
                seen_lines.add(line)
        return "\n".join(clean_lines)

