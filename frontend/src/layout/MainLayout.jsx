import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = () => {
    const location = useLocation();
    const hideFooter = location.pathname === '/about' || location.pathname === '/dashboard' || location.pathname === '/admin' || location.pathname.includes('/seats') || location.pathname.includes('/checkout') || location.pathname.includes('/booking-success');

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            {!hideFooter && <Footer />}
        </div>
    );
};

export default MainLayout;
