import axios from 'axios';

const BASE_URL = 'http://localhost:5001';


const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

// Users
export const getUsers = async () => {
  const response = await axiosInstance.get('/users');
  return response.data;
};

export const createUser = async (user) => {
  const response = await axiosInstance.post('/users', user);
  return response.data;
};

export const updateUser = async (id, user) => {
  const response = await axiosInstance.put(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/users/${id}`);
  return response.data;
};

// Reviews
export const getReviewsByMovie = async (movieId) => {
  const response = await axiosInstance.get(`/reviews?movieId=${movieId}`);
  return response.data;
};

export const createReview = async (review) => {
  const response = await axiosInstance.post('/reviews', review);
  return response.data;
};

export const updateReview = async (id, review) => {
  const response = await axiosInstance.put(`/reviews/${id}`, review);
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await axiosInstance.delete(`/reviews/${id}`);
  return response.data;
};

// Watchlist
export const getWatchlist = async (userId) => {
  const response = await axios.get(`${BASE_URL}/watchlist?userId=${userId}`);
  return response.data;
};

export const addToWatchlist = async (watchlistEntry) => {
  const response = await axios.post(`${BASE_URL}/watchlist`, watchlistEntry);
  return response.data;
};

export const removeFromWatchlist = async (watchlistEntryId) => {
  const response = await axios.delete(`${BASE_URL}/watchlist/${watchlistEntryId}`);
  return response.data;
};