import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FileUpload from '../components/FileUpload';

jest.mock('react-syntax-highlighter', () => ({
  Light: () => <div />,
}));

// Mock DataTransfer globally
class MockDataTransfer {
  private fileList: File[] = [];
  items: DataTransferItem[] = [];

  setFiles(files: File[]) {
    this.fileList = files;
    Object.defineProperty(this, 'files', {
      get: () => this.fileList,
    });
    this.items = files.map((file) => ({
      kind: 'file',
      type: file.type,
      getAsFile: () => file,
    })) as DataTransferItem[];
  }
}

Object.defineProperty(global, 'DataTransfer', {
  value: MockDataTransfer,
});

test('renders FileUpload component', () => {
  render(<FileUpload onFileUpload={jest.fn()} />);
  expect(screen.getByText(/Drag and drop a file here/i)).toBeInTheDocument();
  expect(screen.getByText(/or click to select one/i)).toBeInTheDocument();
});

test('handles file drag-and-drop', () => {
  const mockOnFileUpload = jest.fn();
  render(<FileUpload onFileUpload={mockOnFileUpload} />);

  const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
  const dropzone = screen.getByText(/Drag and drop a file here/i).closest('div');
  expect(dropzone).toBeInTheDocument();

  const dataTransfer = new MockDataTransfer();
  dataTransfer.setFiles([file]);

  fireEvent.drop(dropzone!, { dataTransfer });

  expect(mockOnFileUpload).toHaveBeenCalledTimes(1);
  expect(mockOnFileUpload).toHaveBeenCalledWith(file);
});

test('handles file selection via click', () => {
  const mockOnFileUpload = jest.fn();
  render(<FileUpload onFileUpload={mockOnFileUpload} />);

  const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
  const input = screen.getByLabelText(/Drag and drop a file here/i);
  expect(input).toBeInTheDocument();

  fireEvent.change(input, {
    target: { files: [file] },
  });

  expect(mockOnFileUpload).toHaveBeenCalledTimes(1);
  expect(mockOnFileUpload).toHaveBeenCalledWith(file);
});

test('rejects unsupported file types', () => {
  const mockOnFileUpload = jest.fn();
  render(<FileUpload onFileUpload={mockOnFileUpload} />);

  const unsupportedFile = new File(['file content'], 'test.exe', { type: 'application/x-msdownload' });
  const dropzone = screen.getByText(/Drag and drop a file here/i).closest('div');
  expect(dropzone).toBeInTheDocument();

  const dataTransfer = new MockDataTransfer();
  dataTransfer.setFiles([unsupportedFile]);

  fireEvent.drop(dropzone!, { dataTransfer });

  expect(mockOnFileUpload).not.toHaveBeenCalled();
});

test('handles multiple file uploads', () => {
  const mockOnFileUpload = jest.fn();
  render(<FileUpload onFileUpload={mockOnFileUpload} />);

  const file1 = new File(['content 1'], 'test1.txt', { type: 'text/plain' });
  const file2 = new File(['content 2'], 'test2.txt', { type: 'text/plain' });

  const dropzone = screen.getByText(/Drag and drop a file here/i).closest('div');
  expect(dropzone).toBeInTheDocument();

  const dataTransfer = new MockDataTransfer();
  dataTransfer.setFiles([file1, file2]);

  fireEvent.drop(dropzone!, { dataTransfer });

  expect(mockOnFileUpload).toHaveBeenCalledTimes(2);
  expect(mockOnFileUpload).toHaveBeenNthCalledWith(1, file1);
  expect(mockOnFileUpload).toHaveBeenNthCalledWith(2, file2);
});
