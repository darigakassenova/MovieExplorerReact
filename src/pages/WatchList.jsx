import React, { useEffect, useState } from 'react';
import { getWatchlist, removeFromWatchlist } from '../network/mock.js';
import { IMAGE_BASE_URL, ENDPOINTS, BASE_URL, API_KEY } from '../network/endpoints';
import { fetchMovies } from '../network/network.js';
import { TextField, CircularProgress, Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const WatchList = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserWatchlist = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;

        const data = await getWatchlist(user.id);
        setWatchlist(data);
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserWatchlist();
  }, []);

  const fetchMoviesByCategory = async () => {
    try {
      setLoading(true);

      let movies = [];
      if (category === 'all') {
        movies = await Promise.all(
          watchlist.map(async (item) => {
            const response = await fetch(`${BASE_URL}movie/${item.movieId}?api_key=${API_KEY}`);
            return response.json();
          })
        );
      } else {
        const endpoint = ENDPOINTS[category];
        const categoryMovies = await fetchMovies(endpoint);

        movies = watchlist
          .map((item) => categoryMovies.find((movie) => movie.id === item.movieId))
          .filter(Boolean);
      }

      const filteredMovies = movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setFilteredMovies(filteredMovies);
    } catch (error) {
      console.error('Error fetching movies by category:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoviesByCategory();
  }, [watchlist, category, searchQuery]);

  const handleRemoveFromWatchlist = async (watchlistId) => {
    try {
      await removeFromWatchlist(watchlistId);
      setWatchlist((prev) => prev.filter((item) => item.id !== watchlistId));
    } catch (error) {
      console.error('Error removing movie from watchlist:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: '50px' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your watchlist...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        My Watchlist
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        {['all', 'now_playing', 'upcoming', 'popular', 'top_rated'].map((filter) => (
          <Button
            key={filter}
            onClick={() => setCategory(filter)}
            variant={category === filter ? 'contained' : 'outlined'}
            sx={{
              mx: 1,
              textTransform: 'capitalize',
              color: category === filter ? 'white' : '#ffb700',
              backgroundColor: category === filter ? '#ffb700' : 'transparent',
              borderColor: '#ffb700',
              '&:hover': {
                backgroundColor: category === filter ? '#ff9800' : 'rgba(255, 183, 0, 0.1)',
              },
            }}
          >
            {filter.replace('_', ' ')}
          </Button>
        ))}
      </Box>

      {/* Watchlist Items */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
        {filteredMovies.length > 0 ? (
          filteredMovies.map((item) => {
            const watchlistEntry = watchlist.find((entry) => entry.movieId === item.id);
            if (!watchlistEntry) return null;

            return (
              <Box
                key={watchlistEntry.id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: 2,
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  width: '65%'
                }}
                onClick={() => navigate(`/movie/${item.id}`)}
              >
                {/* Movie Poster */}
                <img
                  src={`${IMAGE_BASE_URL}${item.poster_path}`}
                  alt={item.title}
                  style={{
                    width: '180px',
                    height: '280px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginRight: '20px',
                  }}
                />

                {/* Movie Info */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom sx={{color: 'black', fontWeight: 'bold'}}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {item.release_date}
                  </Typography>
                  <Typography variant="body1" paragraph color="textSecondary">
                    {item.overview}
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromWatchlist(watchlistEntry.id);
                      }}
                  >
                    Remove
                  </Button>
                </Box>
              </Box>
            );
          })
        ) : (
          <Typography variant="h6" align="center">
            No movies match your criteria.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default WatchList;
