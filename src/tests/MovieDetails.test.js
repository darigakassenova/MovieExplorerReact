import React from 'react';
import { render, screen } from '@testing-library/react';
import MovieDetails from '../pages/MovieDetails'

test('renders movie details page', async () => {
  // Mock movie data
  const mockMovie = {
    id: 1,
    title: 'Spider-Man',
    overview: 'A great movie about Spider-Man.',
    poster_path: 'https://m.media-amazon.com/images/I/81Fd1jD8DAL._AC_UF894,1000_QL80_.jpg',
    release_date: '2002-05-03',
    genres: [{ name: 'Action' }],
    vote_average: 8.5,
  };

  // Mock fetch API
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockMovie),
    })
  );

  render(<MovieDetails />);
  
  expect(await screen.findByText('Spider-Man')).toBeInTheDocument();
  expect(screen.getByText('A great movie about Spider-Man.')).toBeInTheDocument();
});
