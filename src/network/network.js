import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 5000,
});

export const fetchMovies = async (endpoint) => {
  try {
    const response = await axiosInstance.get(endpoint);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
