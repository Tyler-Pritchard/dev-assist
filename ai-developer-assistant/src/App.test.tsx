import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Homepage component', () => {
  render(<App />);
  const homepageElement = screen.getByText(/drag and drop a file here/i); // Adjust as needed
  expect(homepageElement).toBeInTheDocument();
});
