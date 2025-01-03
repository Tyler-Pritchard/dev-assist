import React, { useState, useEffect, useRef } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Editor } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import FileUpload from './FileUpload';

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

    //State to set detected language
    const [detectedLanguage, setDetectedLanguage] = useState<string>('javascript');
    
    // Stores editor content
    const [code, setCode] = useState<string>(''); 
    
    // Stores editor decorations
    const [decorations, setDecorations] = useState<string[]>([]);

    // Establish editor instance
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

    // Create ref for file input
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };
    
    // Mock suggestions
    const mockSuggestions = [
        { line: 2, message: 'Consider using `const` instead of `let`.' },
        { line: 4, message: 'Optimize this loop for better performance.' },
    ];

    const handleEditorMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
        editorRef.current = editor;

        const decorationIds = editor.deltaDecorations([], mockSuggestions.map(suggestion => ({
            range: new monaco.Range(suggestion.line, 1, suggestion.line, 1),
            options: {
                isWholeLine: true,
                inlineClassName: 'suggestion-decoration',
                hoverMessage: { value: suggestion.message },
            },
        })));
        setDecorations(decorationIds);
    };


    /**
     * Handles the upload of a code file.
     * Reads the file's content and stores it in the `uploadedCode` state.
     * @param event - The file input change event.
     */
    const handleCodeUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
        console.log("handleCodeUpload Triggered!")
        const file = event.target.files?.[0];
        if (file) {
            console.log(`Selected file: ${file.name}`);
            const reader = new FileReader();
            const language = detectLanguage(file.name); // Detect the language
            setDetectedLanguage(language);

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
  
    /**
    * Handles detect language.
    * Updates the `detectedLanguage` state with the current value.
    * @param event - The detect language.
    */
    const detectLanguage = (filename: string): string => {
        const extension = filename.split('.').pop()?.toLowerCase();
        switch (extension) {
          case 'py':
            return 'python';
          case 'js':
            return 'javascript';
          case 'java':
            return 'java';
          default:
            return 'plaintext';
        }
    };  

    /**
    * Handles file upload.
    * Updates the uploaded file.
    * @param event - File upload.
    */
    const handleFileUpload = (files: File[]) => {
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setResults((prevResults) => `${prevResults || ''}\nFile Content:\n${content}`);
            };
            reader.readAsText(file);
        });
    };

    /**
     * Display AI-generated suggestions as inline decorations.
     * Function add suggestions dynamically
     * @param event - The button input change event.
     */
    const addSuggestions = (suggestions: { line: number; message: string }[]) => {
        const editor = editorRef.current;
        if (editor) {
            const decorationIds = editor.deltaDecorations(
                decorations,
                suggestions.map(suggestion => ({
                    range: new monaco.Range(suggestion.line, 1, suggestion.line, 1),
                    options: {
                        isWholeLine: true,
                        inlineClassName: 'suggestion-decoration',
                        hoverMessage: { value: suggestion.message },
                    },
                }))
            );
            setDecorations(decorationIds);
        }
    };

    // Clear decorations on component unmount
    useEffect(() => {
        return () => {
            const editor = editorRef.current;
            if (editor) {
                editor.deltaDecorations(decorations, []);
            }
        };
    }, [decorations]);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>AI Developer Assistant</h1>
        <p>Upload code, input text, or upload log files for analysis.</p>
        <span>
            <select
                value={detectedLanguage}
                onChange={(e) => setDetectedLanguage(e.target.value)}
                style={{ 
                    marginBottom: '10px',
                    marginRight: '10px' 
                }}
                >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="plaintext">Plain Text</option>
            </select>
        </span>
        <span style={{ margin: '20px 0' }}>
            <button
                style={{ marginRight: '10px' }}
                onClick={handleButtonClick}
            >
                Upload Code
            </button>
            <input
                type="file"
                ref={fileInputRef}
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
        </span>

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
            <div style={{ margin: '20px 0' }}>
                <h2>Upload Code or Log Files</h2>
                <FileUpload onFileUpload={handleFileUpload} />
            </div>
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

        <Editor
            height="500px"
            defaultLanguage="javascript"
            value={code}
            onChange={(value) => setCode(value || '')}
            onMount={handleEditorMount}
        />

        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
            <h2>Analysis Results</h2>
            {results ? (
                <SyntaxHighlighter
                    language={detectedLanguage}
                    style={docco}
                    showLineNumbers
                >
                    {results}
                </SyntaxHighlighter>
                ) : (
                <p>No results to display yet. Please upload code or logs, or input text for analysis.</p>
            )}
            <div>
            <button onClick={() => {
                const suggestions = [
                    { line: 3, message: 'Avoid hardcoding values; consider using variables.' },
                    { line: 6,
                    message: 'Refactor this function to improve readability.' }, 
                ]; 
                addSuggestions(suggestions); 
            }}>
                Get AI Suggestions 
            </button>
            </div>
            <div>
                <button
                    style={{ marginTop: '10px' }}
                    onClick={() => setResults('This is a sample analysis result.')}
                >
                    Simulate Results
                </button>
            </div>
        </div>
    </div>
  );
};

export default Homepage;
