import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const ADMIN_EMAIL = "akindusamarasinghe21@gmail.com";

const PostSignIn = () => {
    const { isLoaded, isSignedIn, user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoaded) return;

        if (isSignedIn) {
            const email = user.primaryEmailAddress?.emailAddress;

            if (email === ADMIN_EMAIL) {
                navigate('/admin');
            } else {
                navigate('/customer');
            }
        } else {
            // Should verify if this case is even reachable given Clerk's automatic handling
            navigate('/auth/sign-in');
        }
    }, [isLoaded, isSignedIn, user, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <h2 className="text-xl font-bold mb-4">Redirecting...</h2>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
};

export default PostSignIn;
