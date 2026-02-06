import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SignIn, SignUp } from '@clerk/clerk-react';
import PostSignIn from './pages/PostSignIn';
import RequireAuth from './components/RequireAuth';
import RequireAdmin from './components/RequireAdmin';

import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import MyBookingsPage from './pages/MyBookingsPage';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
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
          {/* Public Auth Routes */}
          <Route path="/sign-in/*" element={<div className="flex justify-center items-center min-h-screen bg-gray-100"><SignIn routing="path" path="/sign-in" /></div>} />
          <Route path="/sign-up/*" element={<div className="flex justify-center items-center min-h-screen bg-gray-100"><SignUp routing="path" path="/sign-up" /></div>} />
          <Route path="/post-sign-in" element={<PostSignIn />} />

          {/* Legacy Auth Routes Redirect or kept for safety if linked elsewhere (optional) - replacing them with Clerk for now */}
          <Route path="/auth/sign-in" element={<div className="flex justify-center items-center min-h-screen bg-gray-100"><SignIn /></div>} />

          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="movies" element={<MoviesPage />} />
            <Route path="movies/:id" element={<MovieDetailsPage />} />
            <Route path="about" element={<AboutUsPage />} />

            {/* Protected Routes */}
            <Route element={<RequireAuth />}>
              <Route path="shows/:id/seats" element={<SeatSelectionPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="booking-success" element={<BookingSuccessPage />} />
              <Route path="my-bookings" element={<MyBookingsPage />} />
              <Route path="customer" element={<CustomerDashboardPage />} />
              <Route path="dashboard" element={<CustomerDashboardPage />} /> {/* Alias for backward compatibility */}
            </Route>

            {/* Admin Routes */}
            <Route element={<RequireAdmin />}>
              <Route path="admin" element={<AdminDashboardPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
