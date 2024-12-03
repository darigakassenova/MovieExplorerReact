import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import SearchBar from '../components/SearchBar'

test('renders the search input field', () => {
  render(<SearchBar onMovieSelect={jest.fn()} />);
  const searchInput = screen.getByPlaceholderText(/Search for movies.../i);
  expect(searchInput).toBeInTheDocument();
});

test('calls API when user types in search bar', async () => {
  const mockOnMovieSelect = jest.fn();
  render(<SearchBar onMovieSelect={mockOnMovieSelect} />);

  const searchInput = screen.getByPlaceholderText(/Search for movies.../i);
  fireEvent.change(searchInput, { target: { value: 'Spider-Man' } });

  // Simulate API response
  await screen.findByText('Spider-Man'); // Assuming "Spider-Man" is a returned movie title
});
