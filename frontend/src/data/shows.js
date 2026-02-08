
export const cinemas = [
    "Scope Cinemas - Colombo City Centre",
    "PVR Cinemas - One Galle Face",
    "Liberty Cinema - Kollupitiya",
    "Savoy 3D - Wellawatte",
    "Majestic Cineplex - Bambalapitiya"
];

export const screenTypes = ["IMAX", "Dolby Atmos", "Gold Class", "Premium", "Standard", "3D"];

// Generate some realistic looking shows
const generateShows = () => {
    const shows = [];
    let showId = 1;
    const today = new Date();

    // For the next 7 days
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        // For each cinema
        cinemas.forEach(cinema => {
            // 3-5 shows per cinema per day
            const numShows = Math.floor(Math.random() * 3) + 3;

            for (let j = 0; j < numShows; j++) { // Use different variable for inner loop
                const movieId = Math.floor(Math.random() * 12) + 1;
                const screen = screenTypes[Math.floor(Math.random() * screenTypes.length)];

                let price = 1000;
                if (screen.includes('IMAX')) price = 2500;
                if (screen.includes('Gold')) price = 3500;
                if (screen.includes('Premium')) price = 1800;
                if (screen.includes('3D')) price += 300;

                // Times between 10 AM and 10 PM
                const hour = 10 + Math.floor(Math.random() * 12);
                const minute = Math.random() < 0.5 ? '00' : '30';
                const time = `${hour}:${minute}`;

                shows.push({
                    id: showId++,
                    movieId,
                    cinemaName: cinema,
                    screenName: screen,
                    date: dateStr,
                    time,
                    priceLkr: price,
                    availableSeats: Math.floor(Math.random() * 100) + 20
                });
            }
        });
    }
    return shows;
};

export const shows = generateShows();

// Helper functions
export const getShowById = (id) => shows.find(s => s.id === parseInt(id));
export const getShowsByMovieId = (movieId) => shows.filter(s => s.movieId === parseInt(movieId));
export const getShowsByDate = (date) => shows.filter(s => s.date === date);
export const getShowsByCinema = (cinemaName) => shows.filter(s => s.cinemaName === cinemaName);
export const getShowsByMovieAndDate = (movieId, date) => shows.filter(s => s.movieId === parseInt(movieId) && s.date === date);

export const getAllCinemas = () => cinemas;
export const getAllScreenTypes = () => screenTypes;

export const getAvailableDates = (movieId) => {
    const movieShows = getShowsByMovieId(movieId);
    const dates = [...new Set(movieShows.map(s => s.date))];
    return dates.sort();
};

export const formatShowTime = (time) => {
    if (!time) return '';

    // Handle ISO datetime string (e.g., "2026-02-10T14:30:00")
    if (time.includes('T') || time.includes('-')) {
        const date = new Date(time);
        const h = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${minutes} ${ampm}`;
    }

    // Handle simple time string (e.g., "14:30")
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
};

export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR'
    }).format(price);
};
