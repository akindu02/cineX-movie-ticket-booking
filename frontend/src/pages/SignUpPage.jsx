import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, User, Ticket, Star, Film } from 'lucide-react';
import toast from 'react-hot-toast';

const SignUpPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Full name is required';

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast.success('Account created successfully!');
            navigate('/auth/sign-in'); // Redirect to login after signup
        }, 1500);
    };

    const handleGoogleLogin = () => {
        toast.loading('Connecting to Google...', { duration: 1000 });
        setTimeout(() => {
            toast.dismiss();
            toast.success('Google sign-up (UI only)');
        }, 1000);
    };

    return (
        <div className="min-h-screen flex w-full bg-white">

            {/* Left Side: Visual / Decoration (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 bg-[var(--color-dark)] relative overflow-hidden items-center justify-center">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1517604931442-710c8ef5ad25?q=80&w=2066&auto=format&fit=crop"
                        alt="Cinema Audience"
                        className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                </div>

                {/* Content over Image */}
                <div className="relative z-10 text-center px-12 max-w-xl">
                    <div className="mb-8 flex justify-center">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-2xl">
                            <Star className="w-10 h-10 text-yellow-400 fill-current" />
                        </div>
                    </div>
                    <h2 className="text-5xl font-black text-white mb-6 leading-tight">
                        Join the CineX Club
                    </h2>
                    <p className="text-gray-300 text-lg leading-relaxed mb-10">
                        Create an account to unlock exclusive rewards, faster booking, and personalized movie recommendations.
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                            <Ticket className="w-6 h-6 text-[var(--color-primary)] mb-2" />
                            <h3 className="text-white font-bold">Priority Booking</h3>
                            <p className="text-sm text-gray-400">Grab tickets before anyone else</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                            <Film className="w-6 h-6 text-[var(--color-primary)] mb-2" />
                            <h3 className="text-white font-bold">Premiere Access</h3>
                            <p className="text-sm text-gray-400">Invites to special screenings</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 bg-white overflow-y-auto">
                <div className="w-full max-w-md space-y-8">

                    {/* Header */}
                    <div className="text-center">
                        <Link to="/" className="inline-block group mb-6">
                            <div className="text-6xl font-extrabold tracking-tighter flex items-center justify-center gap-0.5 group-hover:scale-105 transition-transform duration-300">
                                <span className="text-[var(--color-primary)]">Cine</span>
                                <span className="text-[var(--color-light)]">X</span>
                            </div>
                        </Link>
                        <p className="text-xs font-bold text-gray-400 tracking-[0.3em] uppercase mb-8">Your Seat to the Big Screen</p>

                        <div className="text-left">
                            <h2 className="text-3xl font-black text-gray-900 mb-2">Create Account</h2>
                            <p className="text-gray-500 text-lg">Sign up for free and start booking</p>
                        </div>
                    </div>

                    {/* Google Signup */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:ring-4 focus:ring-gray-100 focus:outline-none group shadow-sm"
                    >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign up with Google
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="h-px bg-gray-100 flex-1"></div>
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">or sign up with email</span>
                        <div className="h-px bg-gray-100 flex-1"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[var(--color-primary)] transition-colors" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full bg-gray-50 border ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl py-3.5 pl-12 pr-4 font-medium outline-none focus:bg-white focus:border-[var(--color-primary)] focus:ring-4 focus:ring-red-500/10 transition-all`}
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.name && <p className="text-xs text-red-500 font-bold">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[var(--color-primary)] transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full bg-gray-50 border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl py-3.5 pl-12 pr-4 font-medium outline-none focus:bg-white focus:border-[var(--color-primary)] focus:ring-4 focus:ring-red-500/10 transition-all`}
                                    placeholder="name@example.com"
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 font-bold">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[var(--color-primary)] transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full bg-gray-50 border ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl py-3.5 pl-12 pr-12 font-medium outline-none focus:bg-white focus:border-[var(--color-primary)] focus:ring-4 focus:ring-red-500/10 transition-all`}
                                    placeholder="Create a password"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-500 font-bold">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">Confirm Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[var(--color-primary)] transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full bg-gray-50 border ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl py-3.5 pl-12 pr-12 font-medium outline-none focus:bg-white focus:border-[var(--color-primary)] focus:ring-4 focus:ring-red-500/10 transition-all`}
                                    placeholder="Confirm your password"
                                />
                            </div>
                            {errors.confirmPassword && <p className="text-xs text-red-500 font-bold">{errors.confirmPassword}</p>}
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full btn btn-primary py-4 rounded-xl text-lg font-bold shadow-xl shadow-red-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-gray-500 font-medium pb-4">
                        Already have an account? <Link to="/auth/sign-in" className="text-[var(--color-primary)] font-bold hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
