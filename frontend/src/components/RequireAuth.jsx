import { useAuth, RedirectToSignIn } from '@clerk/clerk-react';
import { Outlet } from 'react-router-dom';

const RequireAuth = () => {
    const { isLoaded, userId } = useAuth();

    if (!isLoaded) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!userId) {
        return <RedirectToSignIn />;
    }

    return <Outlet />;
};

export default RequireAuth;
