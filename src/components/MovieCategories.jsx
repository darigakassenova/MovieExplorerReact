import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import { fetchMovies } from '../network/network';
import { ENDPOINTS } from '../network/endpoints';
import '../index.css';
import { useNavigate } from 'react-router-dom';

const MovieCategories = ({ category, endpointKey }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [displayedMovies, setDisplayedMovies] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getMovies = async () => {
      try {
        setLoading(true);
        const movieData = await fetchMovies(`${ENDPOINTS[endpointKey]}&page=${page}`);

        setMovies((prevMovies) => {
          const movieIds = new Set(prevMovies.map((movie) => movie.id));
          const newMovies = movieData.filter((movie) => !movieIds.has(movie.id));
          return [...prevMovies, ...newMovies];
        });

        // Update displayed movies
        setDisplayedMovies((prevDisplayed) => [
          ...prevDisplayed,
          ...movieData.slice(0, 4), 
        ]);
      } catch (error) {
        console.error('Error loading movies:', error);
      } finally {
        setLoading(false);
      }
    };

    getMovies();
  }, [endpointKey, page]);

  const handleLoadMore = () => {
    const nextMovies = movies.slice(displayedMovies.length, displayedMovies.length + 4);
    setDisplayedMovies((prevDisplayed) => [...prevDisplayed, ...nextMovies]);
    setPage((prevPage) => prevPage + 1); 
  };

  const handleMovieClick = (movie) => {
    console.log(`Clicked on: ${movie.title}`);
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="trending-section">
      <h2>{category}</h2>
      <div className="card-container">
        {displayedMovies.length > 0 ? (
          displayedMovies.map((movie) => (
            <Card
              key={movie.id}
              sx={{
                maxWidth: 280,
                backgroundColor: 'transparent',
                margin: '5px',
              }}
              className="card-item"
            >
              <div onClick={() => handleMovieClick(movie)} style={{ cursor: 'pointer' }}>
                <CardMedia
                  sx={{
                    height: 400,
                    border: '1px solid #ffb700',
                    borderRadius: '10px',
                  }}
                  image={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  title={movie.title}
                  className="card-image"
                />
              </div>
              <CardActions className="card-actions">
                <h3
                  onClick={() => handleMovieClick(movie)}
                  style={{ cursor: 'pointer', marginLeft: 8, color: '#ffb700', fontWeight: 'lighter' }}
                >
                  {movie.title}
                </h3>
              </CardActions>
            </Card>
          ))
        ) : (
          <p>No movies available</p>
        )}
      </div>
      {/* Load More Button */}
      {!loading && (
        <Button
          variant="contained"
          onClick={handleLoadMore}
          sx={{
            marginTop: 2,
            backgroundColor: 'transparent',
            border: 'solid 1px #ffb700',
            color: 'white',
            '&:hover': { backgroundColor: '#ffa726' },
          }}
        >
          More
        </Button>
      )}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default MovieCategories;
