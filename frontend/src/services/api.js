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

// --- Shows ---
export const getShowById = async (id) => {
    const response = await api.get(`/shows/${id}`);
    return response.data;
};

export const getBookedSeats = async (showId) => {
    const response = await api.get(`/bookings/show/${showId}/booked-seats`);
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

export const cancelBooking = async (bookingId) => {
    const response = await api.patch(`/bookings/${bookingId}/cancel`);
    return response.data;
};

