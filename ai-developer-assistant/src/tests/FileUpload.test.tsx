import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FileUpload from '../components/FileUpload';

class MockDataTransfer {
  files: File[] = [];

  constructor(files: File[]) {
    this.files = files;
  }

  get items() {
    return this.files.map((file) => ({
      kind: 'file',
      type: file.type,
      getAsFile: () => file,
      getAsString: () => null,
    }));
  }
}

test('handles file drag-and-drop', () => {
  const mockOnFileUpload = jest.fn();

  render(<FileUpload onFileUpload={mockOnFileUpload} />);

  const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
  const dropzone = screen.getByRole('button', { name: /drag and drop a file here/i });

  const dataTransfer = new MockDataTransfer([file]);

  // Use fireEvent to simulate the drag-and-drop sequence
  fireEvent.dragEnter(dropzone, { dataTransfer });
  fireEvent.dragOver(dropzone, { dataTransfer });
  fireEvent.drop(dropzone, { dataTransfer });

  // Assert that the callback was called with the correct file
  expect(mockOnFileUpload).toHaveBeenCalledTimes(1);
  expect(mockOnFileUpload).toHaveBeenCalledWith([file]); // Adjust if the callback expects a single file instead of an array
});
