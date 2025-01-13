from utils.model_loader import ModelLoader
import logging
import re

class SummarizeService:
    def __init__(self, model_loader: ModelLoader):
        self.model_loader = model_loader
        self.model, self.tokenizer = self.model_loader.get_model()

    def summarize_text(self, text: str) -> str:
        """
        Summarizes the given input text using the loaded model.

        Args:
            text (str): The text to summarize.

        Returns:
            str: The summarized version of the input text.
        """
        try:
            max_input_tokens = 512
            tokens = self.tokenizer.tokenize(text)

            if len(tokens) > max_input_tokens:
                text = self.tokenizer.convert_tokens_to_string(tokens[:max_input_tokens])
                logging.warning("Input text truncated to fit the model's maximum input size.")

            # Simplify or adjust the prompt
            prompt = f"Summarize:\n{text}"

            inputs = self.tokenizer(
                prompt,
                return_tensors="pt",
                max_length=max_input_tokens,
                truncation=True,
                padding=True
            ).to(self.model_loader.device)

            outputs = self.model.generate(
                inputs["input_ids"],
                attention_mask=inputs["attention_mask"],
                max_new_tokens=50,
                min_length=5,
                length_penalty=2.0,
                num_beams=4,
                repetition_penalty=2.5,
                temperature=0.7,
                early_stopping=True,
                pad_token_id=self.tokenizer.pad_token_id
            )

            raw_summary = self.tokenizer.decode(outputs[0], skip_special_tokens=True).strip()
            logging.debug(f"Raw summary: {raw_summary}")

            # Simplify post-processing
            clean_summary = raw_summary.split("\n")[0]
            clean_summary = re.sub(r"[^\w\s.,!?'-]", "", clean_summary).strip()
            logging.info(f"Clean summary: {clean_summary}")

            if not clean_summary or len(clean_summary.split()) < 3:
                logging.warning("Generated summary is invalid or too short.")
                return raw_summary.strip()

            return clean_summary

        except Exception as e:
            logging.error(f"Error summarizing text: {e}")
            return "Error summarizing text."