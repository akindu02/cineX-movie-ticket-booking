import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import MyBookingsPage from './pages/MyBookingsPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import AboutUsPage from './pages/AboutUsPage';

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #333',
          },
        }}
      />
      <Router>
        <Routes>
          {/* Auth Routes - No Layout */}
          <Route path="/auth/sign-in" element={<SignInPage />} />
          <Route path="/auth/sign-up" element={<SignUpPage />} />

          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="movies" element={<MoviesPage />} />
            <Route path="movies/:id" element={<MovieDetailsPage />} />
            <Route path="shows/:id/seats" element={<SeatSelectionPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="booking-success" element={<BookingSuccessPage />} />
            <Route path="my-bookings" element={<MyBookingsPage />} />

            <Route path="about" element={<AboutUsPage />} />
            <Route path="admin" element={<AdminDashboardPage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
