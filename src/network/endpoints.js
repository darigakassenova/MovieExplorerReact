export const API_KEY = "221dee9f3c95e26093a42249048c2237";

export const BASE_URL = "https://api.themoviedb.org/3/";

export const ENDPOINTS = {
  trending: `${BASE_URL}trending/movie/day?api_key=${API_KEY}`,
  popular: `${BASE_URL}movie/popular?api_key=${API_KEY}`,
  top_rated: `${BASE_URL}movie/top_rated?api_key=${API_KEY}`,
  upcoming: `${BASE_URL}movie/upcoming?api_key=${API_KEY}`,
  now_playing: `${BASE_URL}movie/now_playing?api_key=${API_KEY}`,
};

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';