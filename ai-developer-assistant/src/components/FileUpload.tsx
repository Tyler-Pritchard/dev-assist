import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
}

/**
 * FileUpload component for handling drag-and-drop or file selection.
 * @param onFileUpload - Callback function to handle the uploaded file.
 */
const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Accepted files:', acceptedFiles);
    if (!acceptedFiles || !acceptedFiles.length) {
        console.error("No valid files were dropped.");
        return;
    }
    onFileUpload(acceptedFiles);
  }, [onFileUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
        'text/*': ['.txt', '.log', '.js', '.py', '.java'], // Specify acceptable file types
        },
        maxSize: 1024 * 1024, // 1 MB
    });

  return (
    <div
      {...getRootProps()}
      style={{
        border: '2px dashed #ccc',
        padding: '20px',
        textAlign: 'center',
        borderRadius: '8px',
        backgroundColor: isDragActive ? '#f0f8ff' : '#f9f9f9',
        cursor: 'pointer',
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the file here...</p>
      ) : (
        <div role="button" aria-label="Drag and drop a file here">
          Drag and drop a file here, or click to select one.
        </div>
      )}
    </div>
  );
};

export default FileUpload;
