import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Update this if your backend runs on a different port

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getMovies = async (params = {}) => {
    const response = await api.get('/movies/', { params });
    return response.data;
};

export const getMovieById = async (id) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
};

export const getMovieShows = async (id) => {
    const response = await api.get(`/movies/${id}/shows`);
    return response.data;
};
