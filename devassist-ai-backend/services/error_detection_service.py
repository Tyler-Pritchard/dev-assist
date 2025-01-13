import logging
from utils.model_loader import ModelLoader

class ErrorDetectionService:
    def detect_errors(self, logs: str, model_loader: ModelLoader) -> str:
        """
        Detect errors in the provided log data.

        Args:
            logs (str): The log data to analyze.
            model_loader (ModelLoader): The loaded model instance.

        Returns:
            str: A summary of detected errors or issues.
        """
        try:
            logging.info("Analyzing logs for errors")
            prompt = f"""
            You are a log analysis expert. Analyze the following logs and:
            - Identify any errors, warnings, or anomalies.
            - Summarize the issues in concise, clear bullet points.
            
            Logs:
            {logs}
            """
            # Generate predictions using the model
            input_ids = model_loader.tokenizer.encode(prompt, return_tensors="pt").to(model_loader.device)
            outputs = model_loader.model.generate(
                input_ids,
                max_new_tokens=150,
                pad_token_id=model_loader.tokenizer.eos_token_id,
                length_penalty=1.5,
                num_beams=4,
                early_stopping=True
            )
            analysis = model_loader.tokenizer.decode(outputs[0], skip_special_tokens=True)
            logging.info(f"Generated error analysis: {analysis}")
            return analysis.strip()
        except Exception as e:
            logging.error(f"Error analyzing logs: {e}")
            return "Error analyzing logs."
