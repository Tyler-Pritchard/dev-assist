import React, { useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

/**
 * Homepage component for the AI Developer Assistant application.
 * Provides options for uploading code, entering text, or uploading log files for analysis.
 */
const Homepage: React.FC = () => {
    // State to store uploaded code content
    const [uploadedCode, setUploadedCode] = useState<string | null>(null);

    // State to store text input from the user
    const [textInput, setTextInput] = useState<string>('');

    // State to store uploaded log file content
    const [logFile, setLogFile] = useState<string | null>(null);

    //State to store results from analysis
    const [results, setResults] = useState<string | null>(null);

    /**
     * Handles the upload of a code file.
     * Reads the file's content and stores it in the `uploadedCode` state.
     * @param event - The file input change event.
     */
    const handleCodeUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
            const content = e.target?.result as string;
            setUploadedCode(content);
            setResults(`Uploaded Code Analysis: ${content.slice(0, 100)}...`); // Simulated output
            };
            reader.readAsText(file);
        }
    };  

    /**
    * Handles the upload of a log file.
    * Reads the file's content and stores it in the `logFile` state.
    * @param event - The file input change event.
    */
    const handleLogFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string;
            setLogFile(content);
            setResults(`Log File Analysis: ${content.slice(0, 100)}...`); // Simulated output
          };
          reader.readAsText(file);
        }
    };

    /**
    * Handles changes to the text input field.
    * Updates the `textInput` state with the current value.
    * @param event - The textarea change event.
    */
    const handleTextInput = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
        const input = event.target.value;
        setTextInput(input);
        setResults(`Text Analysis: ${input.slice(0, 100)}...`); // Simulated output
    };
  

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>AI Developer Assistant</h1>
        <p>Upload code, input text, or upload log files for analysis.</p>

        <div style={{ margin: '20px 0' }}>
            {/* Upload Code Section */}
            <label htmlFor="upload-code">
            <button style={{ marginRight: '10px' }}>Upload Code</button>
            </label>
            <input
            type="file"
            id="upload-code"
            style={{ display: 'none' }}
            onChange={handleCodeUpload}
            />
            {uploadedCode && (
            <pre
                style={{
                backgroundColor: '#f4f4f4',
                padding: '10px',
                border: '1px solid #ccc',
                marginTop: '10px',
                }}
            >
                {uploadedCode}
            </pre>
            )}
        </div>

        <div style={{ margin: '20px 0' }}>
            {/* Text Input Section */}
            <button onClick={() => setTextInput('')} style={{ marginRight: '10px' }}>
            Input Text
            </button>
            <textarea
            value={textInput}
            onChange={handleTextInput}
            placeholder="Enter your text here..."
            style={{
                width: '100%',
                height: '100px',
                marginTop: '10px',
                padding: '10px',
                border: '1px solid #ccc',
            }}
            />
            {textInput && (
            <pre
                style={{
                backgroundColor: '#f4f4f4',
                padding: '10px',
                border: '1px solid #ccc',
                marginTop: '10px',
                }}
            >
                {textInput}
            </pre>
            )}
        </div>

        <div style={{ margin: '20px 0' }}>
            {/* Upload Log File Section */}
            <label htmlFor="upload-log">
            <button style={{ marginRight: '10px' }}>Upload Log File</button>
            </label>
            <input
            type="file"
            id="upload-log"
            style={{ display: 'none' }}
            onChange={handleLogFileUpload}
            />
            {logFile && (
            <pre
                style={{
                backgroundColor: '#f4f4f4',
                padding: '10px',
                border: '1px solid #ccc',
                marginTop: '10px',
                }}
            >
                {logFile}
            </pre>
            )}
        </div>
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
            <h2>Analysis Results</h2>
            {results ? (
                <SyntaxHighlighter
                    language="javascript"
                    style={docco}
                    showLineNumbers
                >
                    {results}
                </SyntaxHighlighter>
                ) : (
                <p>No results to display yet. Please upload code or logs, or input text for analysis.</p>
                )}

            <button
                style={{ marginTop: '10px' }}
                onClick={() => setResults('This is a sample analysis result.')}
                >
                Simulate Results
            </button>
        </div>
    </div>
  );
};

export default Homepage;
