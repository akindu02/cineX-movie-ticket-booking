import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Update this if your backend runs on a different port

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Movies ---
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

export const createMovie = async (movieData) => {
    const response = await api.post('/movies/', movieData);
    return response.data;
};

export const deleteMovie = async (id) => {
    const response = await api.delete(`/movies/${id}`);
    return response.data;
};

export const updateMovie = async (id, movieData) => {
    const response = await api.put(`/movies/${id}`, movieData);
    return response.data;
};

// --- Shows ---
export const getAllShows = async (params = {}) => {
    const response = await api.get('/shows/', { params });
    return response.data;
};

export const getShowById = async (id) => {
    const response = await api.get(`/shows/${id}`);
    return response.data;
};

export const deleteShow = async (id) => {
    const response = await api.delete(`/shows/${id}`);
    return response.data;
};

export const createShow = async (showData) => {
    const response = await api.post('/shows/', showData);
    return response.data;
};

export const updateShow = async (id, showData) => {
    const response = await api.put(`/shows/${id}`, showData);
    return response.data;
};

export const createShowsBatch = async (batchData) => {
    const response = await api.post('/shows/batch', batchData);
    return response.data;
};

export const getBookedSeats = async (showId) => {
    const response = await api.get(`/bookings/show/${showId}/booked-seats`);
    return response.data;
};

// --- Cinemas ---
export const getAllCinemas = async () => {
    const response = await api.get('/shows/cinemas/all');
    return response.data;
};

export const createCinema = async (cinemaData) => {
    const response = await api.post('/shows/cinemas/', cinemaData);
    return response.data;
};

export const deleteCinema = async (id) => {
    const response = await api.delete(`/shows/cinemas/${id}`);
    return response.data;
};

export const updateCinema = async (id, cinemaData) => {
    const response = await api.put(`/shows/cinemas/${id}`, cinemaData);
    return response.data;
};

// --- Bookings ---
export const createBooking = async (bookingData) => {
    const response = await api.post('/bookings/', bookingData);
    return response.data;
};

export const getUserBookings = async (userId) => {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
};

export const getAllBookings = async (params = {}) => {
    const response = await api.get('/bookings/', { params });
    return response.data;
};

export const cancelBooking = async (bookingId) => {
    const response = await api.patch(`/bookings/${bookingId}/cancel`);
    return response.data;
};
