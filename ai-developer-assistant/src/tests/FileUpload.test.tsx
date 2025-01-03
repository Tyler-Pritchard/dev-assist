import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FileUpload from '../components/FileUpload';

test('handles file drag-and-drop', () => {
  const mockOnFileUpload = jest.fn();

  render(<FileUpload onFileUpload={mockOnFileUpload} />);

  const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
  const dropzone = screen.getByRole('button', { name: /drag and drop a file here/i });

  const dataTransfer = {
      dataTransfer: {
          files: [file],
          items: [
              {
                  kind: 'file',
                  type: file.type,
                  getAsFile: () => file,
              },
          ],
      },
  };

  // Simulate drag-and-drop sequence
  fireEvent.dragEnter(dropzone, dataTransfer);
  fireEvent.dragOver(dropzone, dataTransfer);
  fireEvent.drop(dropzone, dataTransfer);

  // Assert that the callback was called with the correct file
  expect(mockOnFileUpload).toHaveBeenCalledTimes(1);
  expect(mockOnFileUpload).toHaveBeenCalledWith([file]);
});
