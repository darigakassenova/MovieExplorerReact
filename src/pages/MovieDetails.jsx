import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getReviewsByMovie, createReview, deleteReview, getWatchlist, addToWatchlist } from '../network/mock.js';
import { IMAGE_BASE_URL, BASE_URL, API_KEY } from '../network/endpoints';
import '../index.css';

import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import { Alert }from '@mui/material';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ content: '', rating: '' });
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);

    if (user) {
      checkIfInWatchlist(); 
      const parsedUser = JSON.parse(user);
      setIsAuthenticated(true);
      setUser(parsedUser);
    }
  }, [id]);

  useEffect(() => {
    const getMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${BASE_URL}movie/${id}?api_key=${API_KEY}&language=en-US`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }
        const movieData = await response.json();
        setMovie(movieData);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    getMovieDetails();
  }, [id]);


  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsData = await getReviewsByMovie(id);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [id]);

  const checkIfInWatchlist = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      try {
        const watchlist = await getWatchlist(user.id);
        const exists = watchlist.some((item) => item.movieId === parseInt(id));
        setInWatchlist(exists);
      } catch (error) {
        console.error('Error checking watchlist:', error);
      }
    }
  };

  const handleAddToWatchlist = async () => {
    if (!isAuthenticated) {
      setError('You need to sign in to add movies to your watchlist.');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const watchlistEntry = {
        movieId: parseInt(id),
        userId: user.id,
      };

      try {
        await addToWatchlist(watchlistEntry); 
        setInWatchlist(true);
        setSuccess('Movie added to your watchlist!');
      } catch (error) {
        console.error('Error adding movie to watchlist:', error);
      }
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('You need to sign in to leave a review.');
      return;
    }
    if (!newReview.content) {
      setError('Please fill out all fields.');
      return;
    }
    const review = {
      movieId: parseInt(id),
      userId: user.id,
      userName: user.username,
      content: newReview.content,
    };

    try {
      const createdReview = await createReview(review);
      setReviews((prev) => [...prev, createdReview]);
      setNewReview({ content: ''});
      console.log(user.username);
    } catch (error) {
      console.error('Error creating review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const review = reviews.find((review) => review.id === reviewId);
    if (!review || review.userId !== user.id) {
      setError('You can only delete your own reviews.');
      return;
    }

    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };
  
  if (loading) return <p>Loading movie details...</p>;
  if (!movie) return <p>Movie not found.</p>;

  return (
    <div className="movie-details" style={{ position: 'relative'}} >

      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 0,
          width: '100%',
          height: '500px',
          backgroundImage: `url(${IMAGE_BASE_URL}${movie.backdrop_path})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
        }} 
      />
      <div className="movie-details-content" style={{ backdropFilter: 'blur(5px)', padding: '20px 60px' }}>
        <div className="movie-details-header">
          <img
            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            className="movie-details-poster"
            style={{
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
              maxWidth: '300px',
            }}
          />
          <div className="movie-details-info" style={{ marginLeft: '20px' }}>
            <h1>
              {movie.title} <span>({movie.release_date.split('-')[0]})</span>
            </h1>
            <p className="movie-details-tagline">{movie.tagline}</p>
            <p>
              <strong>Overview:</strong> {movie.overview}
            </p>
            <p>
              <strong>Release Date:</strong> {movie.release_date}
            </p>
            <p>
              <strong>Runtime:</strong> {movie.runtime} minutes
            </p>
            <p>
              <strong>Genres:</strong> {movie.genres.map((genre) => genre.name).join(', ')}
            </p>
            <p>
              <strong>Vote Average:</strong> {movie.vote_average} / 10
            </p>
            <button
              onClick={handleAddToWatchlist}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: inWatchlist ? 'not-allowed' : 'pointer',
              }}
              disabled={inWatchlist}
            >
              {inWatchlist ? <TurnedInIcon style={{fontSize: '2rem', color: 'black'}}/> : <TurnedInNotIcon style={{fontSize: '2rem', color: 'white'}}/>}
            </button>
            {error && (
                <Alert severity="error" sx={{ mt: 1, width: '30%' }} onClose={() => setError(null)}>{error}</Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mt: 1, width: '30%'}} onClose={() => setSuccess(null)}>{success}</Alert>
            )}
          </div>
        </div>

        <div className="movie-reviews" style={{ marginTop: '100px' }}>
          <h1 style={{color: "#ffb700"}}>Reviews</h1>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} style={{ backgroundColor: 'white', color: 'black', border: '1px solid #ccc', borderRadius: '5px', padding: '10px', marginBottom: '10px', width: '50%' }}>
                <p><strong>{review.userName}:</strong> {review.content}</p>
                {user?.id === review.userId && (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    style={{ background: 'transparent', color: 'red', border: '1px solid red', borderRadius: '3px', padding: '5px 10px' }}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          ) : (
            <h3>Leave the first review!</h3>
          )}

          {isAuthenticated && (
            <form onSubmit={handleAddReview} style={{ marginTop: '50px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
              <textarea
                value={newReview.content}
                onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                placeholder="Write your review"
                style={{ width: '50%', height: '90px', marginBottom: '30px', borderRadius: '5px', padding: '10px 10px' }}
              />
              <button type="submit" 
              style={{ 
                backgroundColor: 'transparent', 
                color: 'green', 
                border: '1px solid green', 
                borderRadius: '3px', 
                padding: '10px 20px' }}>
                Submit
              </button>
            </form>
          )}
          {!isAuthenticated && <p>Please sign in to leave a review.</p>}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
