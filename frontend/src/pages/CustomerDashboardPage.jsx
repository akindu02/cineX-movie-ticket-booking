import { useState } from 'react';
import { LayoutGrid, Ticket, User, LogOut, CreditCard, Bell, Settings, Shield } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { formatShowTime } from '../data/shows';
import { MapPin, Calendar, Clock, Download, ArrowUpRight, CheckCircle, X } from 'lucide-react';

const CustomerDashboardPage = () => {
    const [activeSection, setActiveSection] = useState('overview');
    const navigate = useNavigate();

    const handleSignOut = () => {
        // Here you would typically clear auth context/storage
        navigate('/');
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'bookings':
                return <MyBookingsSection />;

            default:
                return <OverviewSection setActiveSection={setActiveSection} />;
        }
    };

    return (
        <div className="flex min-h-screen pt-20 bg-[var(--color-dark-100)]">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 fixed h-[calc(100vh-80px)] hidden lg:block overflow-y-auto">
                <div className="p-6">


                    <nav className="space-y-1">
                        <SidebarItem
                            icon={LayoutGrid}
                            label="Dashboard"
                            active={activeSection === 'overview'}
                            onClick={() => setActiveSection('overview')}
                        />
                        <SidebarItem
                            icon={Ticket}
                            label="My Bookings"
                            active={activeSection === 'bookings'}
                            onClick={() => setActiveSection('bookings')}
                        />

                    </nav>

                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <nav className="space-y-1">
                            <SidebarItem icon={Bell} label="Notifications" />


                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all font-medium mt-4"
                            >
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </button>
                        </nav>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-4 md:p-8 overflow-y-auto">
                <div className="max-w-5xl mx-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${active
            ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-red-200'
            : 'text-gray-500 hover:bg-gray-50 hover:text-[var(--color-primary)]'
            }`}
    >
        <Icon className="w-5 h-5" />
        {label}
    </button>
);

/* --- Sub-Sections --- */

const OverviewSection = ({ setActiveSection }) => {
    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-[var(--color-light)]">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard icon={Ticket} label="Total Bookings" value="12" color="bg-blue-50 text-blue-600" />
                <StatsCard icon={Calendar} label="Upcoming Shows" value="2" color="bg-orange-50 text-orange-600" />
                <StatsCard icon={CreditCard} label="Points" value="450" color="bg-purple-50 text-purple-600" />
            </div>

            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[var(--color-light)]">Recent Activity</h2>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                <Ticket className="w-5 h-5" />
                            </div>
                            <div className="flex-grow">
                                <h4 className="font-bold text-sm text-[var(--color-light)]">Ticket Purchased</h4>
                                <p className="text-xs text-gray-500">Dune: Part Two • IMAX Screen</p>
                            </div>
                            <span className="text-xs text-gray-400 font-medium">2 days ago</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const StatsCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
            <Icon className="w-6 h-6" />
        </div>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        <h3 className="text-2xl font-bold text-[var(--color-light)]">{value}</h3>
    </div>
);

const MyBookingsSection = () => {
    // Reusing the list logic from MyBookingsPage, simplified for the dashboard
    const bookings = [
        {
            id: 'BK78291',
            title: 'Dune: Part Three',
            cinemaName: 'Scope Cinemas',
            screenName: 'IMAX',
            date: '2026-02-14',
            time: '18:30',
            seats: ['H5', 'H6'],
            status: 'confirmed',
            posterUrl: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=400&h=600&fit=crop',
        },
        {
            id: 'BK10293',
            title: 'The Haunting Hour',
            cinemaName: 'PVR Cinemas',
            screenName: 'Gold Class',
            date: '2025-12-20',
            time: '20:00',
            seats: ['C1', 'C2'],
            status: 'completed',
            posterUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=600&fit=crop',
        }
    ];

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-[var(--color-light)] mb-6">My Bookings</h2>
            <div className="space-y-4">
                {bookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition-all">
                        <img src={booking.posterUrl} alt="" className="w-full md:w-24 h-32 object-cover rounded-xl shadow-sm" />
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg text-[var(--color-light)]">{booking.title}</h3>
                                    <p className="text-sm text-gray-500">{booking.cinemaName} • {booking.screenName}</p>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${booking.status === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    {booking.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 my-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    {new Date(booking.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    {formatShowTime(booking.time)}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-bold text-gray-400">Seats:</span>
                                <span className="font-bold text-[var(--color-primary)]">{booking.seats.join(', ')}</span>
                            </div>
                        </div>
                        <div className="flex md:flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-dashed border-gray-100 pt-4 md:pt-0 md:pl-6">
                            <button className="flex-1 btn bg-gray-50 text-[var(--color-light)] hover:bg-gray-100 border border-gray-200 text-xs px-4 py-2 rounded-lg font-bold">
                                View Ticket
                            </button>
                            {booking.status === 'confirmed' && (
                                <button className="flex-1 btn text-xs px-4 py-2 border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 rounded-lg font-bold">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};



export default CustomerDashboardPage;
