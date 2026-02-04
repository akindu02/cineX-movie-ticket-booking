import { Film, User, Heart, Globe, Award, Shield } from 'lucide-react';

const AboutUsPage = () => {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-16 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    Reimagining the <span className="text-[var(--color-primary)]">Cinema Experience</span>
                </h1>
                <p className="text-xl text-[var(--color-light-400)] max-w-2xl mx-auto">
                    CineX is Sri Lanka's premium movie booking platform, dedicated to bringing the magic of movies closer to you with seamless technology and world-class service.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                {[
                    { label: 'Cinemas', value: '50+', icon: Film },
                    { label: 'Happy Users', value: '100k+', icon: User },
                    { label: 'Movies Screened', value: '1,000+', icon: Film },
                    { label: 'Cities', value: '12', icon: Globe },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-[var(--color-dark-200)] p-6 rounded-xl border border-white/5 text-center">
                        <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--color-primary)]">
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                        <p className="text-[var(--color-light-400)] text-sm">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                <div className="text-center p-6">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-500">
                        <Heart className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Customer First</h3>
                    <p className="text-[var(--color-light-400)]">We obsess over every detail of your booking journey to ensure it's smooth, fast, and enjoyable.</p>
                </div>
                <div className="text-center p-6">
                    <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-500">
                        <Award className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
                    <p className="text-[var(--color-light-400)]">We partner only with the best cinemas equipped with state-of-the-art projection and sound.</p>
                </div>
                <div className="text-center p-6">
                    <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-500">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Trusted & Secure</h3>
                    <p className="text-[var(--color-light-400)]">Your data and payments are protected with enterprise-grade security standards.</p>
                </div>
            </div>

            {/* Story */}
            <div className="bg-[var(--color-dark-200)] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 border border-white/5">
                <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                    <p className="text-[var(--color-light-300)] mb-4 leading-relaxed">
                        Founded in 2024, CineX started with a simple question: "Why is booking a movie ticket still so complicated?"
                    </p>
                    <p className="text-[var(--color-light-300)] leading-relaxed">
                        What began as a small project has now grown into the country's most loved entertainment platform. We are a team of movie buffs, tech geeks, and design enthusiasts working together to redefine how you experience entertainment.
                    </p>
                </div>
                <div className="flex-1 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-purple-600 blur-3xl opacity-20 rounded-full"></div>
                    <img
                        src="https://images.unsplash.com/photo-1517604931442-71053e3e2c3c?w=800&h=600&fit=crop"
                        alt="Cinema Hall"
                        className="relative rounded-2xl shadow-2xl border border-white/10"
                    />
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;
