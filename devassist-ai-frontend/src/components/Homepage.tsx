import React, { useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import FileUpload from './FileUpload';
import api from '../utils/api';
import detectLanguage from '../utils/detectLanguage';

type TaskType = 'text' | 'code' | 'logs';

interface TaskEndpoints {
  [key: string]: string; // This maps task types to their respective endpoints
}

const Homepage: React.FC = () => {
  const [textInput, setTextInput] = useState<string>(''); // User input
  const [task, setTask] = useState<TaskType>('text'); // Task type
  const [results, setResults] = useState<string | null>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<string>('javascript');

  const taskEndpoints: TaskEndpoints = {
    text: '/summarize-text',
    code: '/analyze-code',
    logs: '/detect-errors',
  };

  /**
   * Updates text input value.
   */
  const handleTextInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(event.target.value);
  };

  /**
   * Sends the input to the backend for processing based on the selected task.
   */
  const handleTextSubmit = async () => {
    if (!textInput.trim()) {
      setResults('Input text cannot be empty.');
      return;
    }

    const apiEndpoint = taskEndpoints[task]; // Now apiEndpoint is guaranteed to be a string

    try {
      const response = await api.post(apiEndpoint, { text: textInput });
      setResults(response.data.result); // Adjust the key as per the backend response structure
    } catch (error) {
      console.error('Error processing request:', error);
      setResults('Failed to process the request.');
    }
  };

  /**
   * Handles file uploads and sends them for processing.
   */
  const handleFileUpload = (file: File, result: string) => {
    setResults(`Uploaded ${file.name}: ${result}`);
    setDetectedLanguage(detectLanguage(file.name));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>AI Developer Assistant</h1>
      <p>Upload code, input text, or upload log files for analysis.</p>

      {/* Task Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="task-selector" style={{ marginRight: '10px' }}>
          Select Task:
        </label>
        <select
          id="task-selector"
          value={task}
          onChange={(e) => setTask(e.target.value as TaskType)}
          style={{
            padding: '5px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        >
          <option value="text">Summarize Text</option>
          <option value="code">Analyze Code</option>
          <option value="logs">Detect Errors in Logs</option>
        </select>
      </div>

      {/* File Upload Section */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Upload Code or Log Files</h2>
        <FileUpload onFileUpload={handleFileUpload} />
      </div>

      {/* Text Input Section */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Input Text for Analysis</h2>
        <textarea
          value={textInput}
          onChange={handleTextInputChange}
          placeholder="Enter your text, code, or logs here..."
          style={{
            width: '100%',
            height: '100px',
            padding: '10px',
            border: '1px solid #ccc',
          }}
        />
        <div style={{ marginTop: '10px' }}>
          <button
            onClick={handleTextSubmit}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007BFF',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Submit
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>Analysis Results</h2>
        {results ? (
          <SyntaxHighlighter language={detectedLanguage} style={docco} showLineNumbers>
            {results}
          </SyntaxHighlighter>
        ) : (
          <p>No results to display yet. Please input text or upload files for analysis.</p>
        )}
      </div>
    </div>
  );
};

export default Homepage;
