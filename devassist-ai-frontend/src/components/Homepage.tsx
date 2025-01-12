import React, { useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import FileUpload from './FileUpload';
import api from '../utils/api';
import detectLanguage from '../utils/detectLanguage';

const Homepage: React.FC = () => {
  const [results, setResults] = useState<string | null>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<string>('javascript');

  /**
   * Handles text input changes and sends it for analysis.
   */
  const handleTextInput = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    try {
      const response = await api.post('/analyze-text', { text });
      setResults(response.data.result);
    } catch (error) {
      console.error('Error analyzing text:', error);
      setResults('Failed to analyze text.');
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

      {/* Language Selector */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="language-selector" style={{ marginRight: '10px' }}>
          Preferred Language:
        </label>
        <select
          id="language-selector"
          value={detectedLanguage}
          onChange={(e) => setDetectedLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="plaintext">Plain Text</option>
        </select>
      </div>

      {/* File Upload Section */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Upload Code or Log Files</h2>
        <FileUpload onFileUpload={handleFileUpload} />
      </div>

      {/* Text Input Section */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Analyze Text</h2>
        <textarea
          onChange={handleTextInput}
          placeholder="Enter your text here..."
          style={{
            width: '100%',
            height: '100px',
            padding: '10px',
            border: '1px solid #ccc',
          }}
        />
      </div>

      {/* Results Section */}
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>Analysis Results</h2>
        {results ? (
          <SyntaxHighlighter language={detectedLanguage} style={docco} showLineNumbers>
            {results}
          </SyntaxHighlighter>
        ) : (
          <p>No results to display yet. Please upload a file or input text for analysis.</p>
        )}
      </div>
    </div>
  );
};

export default Homepage;
