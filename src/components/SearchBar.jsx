import React, { useState, useEffect, useRef } from 'react';
import { fetchMovies } from '../network/network.js';
import { IMAGE_BASE_URL, BASE_URL, API_KEY } from '../network/endpoints.js';
import {
  TextField,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material';

const SearchBar = ({ onMovieSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dropdownRef = useRef(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const response = await fetchMovies(
        `${BASE_URL}search/movie?api_key=${API_KEY}&query=${query}&page=${page}`
      );

      if (page === 1) {
        setResults(response);
      } else {
        setResults((prev) => [...prev, ...response]);
      }

      if (response.length < 20) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    setPage(1);

    if (value.trim()) {
      handleSearch();
    } else {
      setResults([]);
    }
  };

  const handleLoadMore = () => {
    if (!hasMore || loading) return;
    setPage((prevPage) => prevPage + 1);
  };

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setResults([]);
      setQuery('') 
    }
  };

  const handleMovieSelect = (movie) => {
    setResults([]);
    setQuery('') 
    onMovieSelect(movie); 
  };

  useEffect(() => {
    if (page > 1) handleSearch();
  }, [page]);

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <Box sx={{ position: 'relative', width: '50%', mt: 2, mr: 25 }} ref={dropdownRef}>
      {/* Search Input */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for movies..."
        value={query}
        onChange={handleInputChange}
        sx={{
          backgroundColor: 'transparent',
          borderRadius: '8px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#ffb700' },
            '&:hover fieldset': { borderColor: '#ffb700' },
            '&.Mui-focused fieldset': { borderColor: '#ffb700' },
          },
          '& .MuiOutlinedInput-input': {
            color: 'white',
          },
          '& .MuiInputBase-input::placeholder': {
            color: 'white',
          },
        }}
        InputProps={{
          endAdornment: loading && <CircularProgress size={20} color="primary" />,
        }}
      />

      {/* Results */}
      {results.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'black',
            border: '1px solid #ffb700',
            borderRadius: '8px',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 10,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
          onScroll={(e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.target;
            if (scrollTop + clientHeight >= scrollHeight - 10) {
              handleLoadMore();
            }
          }}
        >
          <List>
            {results.map((movie) => (
              <ListItem
                key={movie.id}
                button
                onClick={() => handleMovieSelect(movie)}
                sx={{
                  '&:hover': { border: '1px solid #ffb700' },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : ''}
                    alt={movie.title}
                    variant="rounded"
                  />
                </ListItemAvatar>
                <ListItemText primary={movie.title} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;
