import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../utils/api';

interface FileUploadProps {
  onFileUpload: (file: File, result: string) => void;
}

/**
 * FileUpload component for handling drag-and-drop or file selection.
 * @param onFileUpload - Callback function to handle the uploaded file and its analysis result.
 */
const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null); // Reset error state
    acceptedFiles.forEach(async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await api.post('/upload-file', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        onFileUpload(file, response.data.message);
      } catch (error) {
        console.error('Error uploading file:', error);
        setError('Failed to upload file.');
      }
    });
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt', '.log', '.py', '.js'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <div>
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
        {isDragActive ? <p>Drop the file here...</p> : <p>Drag and drop a file here, or click to select one.</p>}
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default FileUpload;