import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WatchList from '../pages/WatchList'

test('renders watchlist page', () => {
  render(<WatchList />);
  expect(screen.getByText(/My Watchlist/i)).toBeInTheDocument();
});

test('removes a movie from the watchlist', async () => {
  // Mock watchlist data
  const mockWatchlist = [
    { id: 1, movieId: 123, title: 'Spider-Man', poster_path: 'https://m.media-amazon.com/images/I/81Fd1jD8DAL._AC_UF894,1000_QL80_.jpg' },
  ];

  // Mock API call
  jest.spyOn(global, 'fetch').mockImplementation((url) => {
    if (url.includes('/watchlist')) {
      return Promise.resolve({
        json: () => Promise.resolve(mockWatchlist),
      });
    }
    if (url.includes('/watchlist/1')) {
      return Promise.resolve({ status: 200 });
    }
  });

  render(<WatchList />);
  
  // Simulate user interaction
  const removeButton = await screen.findByText('Remove');
  fireEvent.click(removeButton);

  expect(await screen.findByText(/Your watchlist is empty!/i)).toBeInTheDocument();
});
