import { useUser, RedirectToSignIn } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router-dom';

const ADMIN_EMAIL = "akindusamarasinghe21@gmail.com";

const RequireAdmin = () => {
    const { isLoaded, isSignedIn, user } = useUser();

    if (!isLoaded) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!isSignedIn) {
        return <RedirectToSignIn />;
    }

    // Check if the user's primary email matches the admin email
    const email = user.primaryEmailAddress?.emailAddress;

    if (email !== ADMIN_EMAIL) {
        // Not an admin, redirect to customer dashboard
        return <Navigate to="/customer" replace />;
    }

    return <Outlet />;
};

export default RequireAdmin;
