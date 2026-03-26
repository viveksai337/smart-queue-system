import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiZap, FiClock, FiSmartphone, FiBarChart2, FiUsers, FiStar, FiCheck } from 'react-icons/fi';

const Home = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [scrollY, setScrollY] = useState(0);
    const heroRef = useRef(null);
    const cursorGlowRef = useRef(null);

    // Track mouse for cursor glow + parallax
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            if (cursorGlowRef.current) {
                cursorGlowRef.current.style.left = e.clientX + 'px';
                cursorGlowRef.current.style.top = e.clientY + 'px';
            }
        };
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // 3D Tilt on hero card
    const getTiltStyle = (ref) => {
        if (!ref?.current) return {};
        const rect = ref.current.getBoundingClientRect();
        const x = ((mousePos.x - rect.left) / rect.width - 0.5) * 20;
        const y = ((mousePos.y - rect.top) / rect.height - 0.5) * -20;
        return {
            transform: `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) translateZ(20px)`,
            transition: 'transform 0.1s ease-out',
        };
    };

    const services = [
        { emoji: '🏥', name: 'Hospitals', desc: 'Government & Private hospitals with live OPD queues', color: 'from-red-500 to-pink-500', shadow: 'rgba(239,68,68,0.3)' },
        { emoji: '🏦', name: 'Banks', desc: 'SBI, PNB and all major banks with counter management', color: 'from-blue-500 to-cyan-500', shadow: 'rgba(59,130,246,0.3)' },
        { emoji: '🏛️', name: 'Government', desc: 'Collector offices, municipality, and civic centers', color: 'from-amber-500 to-orange-500', shadow: 'rgba(245,158,11,0.3)' },
        { emoji: '🚗', name: 'RTO', desc: 'License, RC, and vehicle transfer with priority tokens', color: 'from-green-500 to-emerald-500', shadow: 'rgba(16,185,129,0.3)' },
        { emoji: '🛂', name: 'Passport', desc: 'Passport Seva Kendra with appointment queues', color: 'from-indigo-500 to-violet-500', shadow: 'rgba(99,102,241,0.3)' },
        { emoji: '🏨', name: 'Hotels', desc: 'Restaurant & hotel food ordering with table queues', color: 'from-rose-500 to-fuchsia-500', shadow: 'rgba(244,63,94,0.3)' },
    ];

    const features = [
        { icon: <FiZap />, title: 'Real-time Queue', desc: 'Live updates via WebSocket — see your position change instantly', gradient: 'from-yellow-400 to-orange-500' },
        { icon: <FiSmartphone />, title: 'QR Code Tokens', desc: 'Book, scan, and track tokens from your phone', gradient: 'from-cyan-400 to-blue-500' },
        { icon: <FiClock />, title: 'AI Wait Prediction', desc: 'ML-powered estimates so you know exactly when to arrive', gradient: 'from-purple-400 to-pink-500' },
        { icon: <FiBarChart2 />, title: 'Smart Analytics', desc: 'Peak hours, trends, and performance dashboards for admins', gradient: 'from-emerald-400 to-teal-500' },
        { icon: <FiShield />, title: 'Priority System', desc: 'VIP, elderly, handicapped — fair priority management', gradient: 'from-red-400 to-rose-500' },
        { icon: <FiUsers />, title: 'Multi-Counter', desc: 'Assign and manage multiple service counters seamlessly', gradient: 'from-indigo-400 to-violet-500' },
    ];

    const stats = [
        { value: '130+', label: 'Hospitals Listed' },
        { value: '7', label: 'Cities Covered' },
        { value: '24/7', label: 'Live Tracking' },
        { value: '< 2s', label: 'Real-time Sync' },
    ];

    return (
        <div className="relative overflow-hidden">
            {/* Cursor Glow Effect */}
            <div
                ref={cursorGlowRef}
                className="fixed pointer-events-none z-[1]"
                style={{
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
                    transform: 'translate(-50%, -50%)',
                    transition: 'left 0.15s ease, top 0.15s ease',
                }}
            />

            {/* Background Orbs */}
            <div className="orb orb-1" style={{ transform: `translateY(${scrollY * 0.3}px)` }} />
            <div className="orb orb-2" style={{ transform: `translateY(${scrollY * -0.2}px)` }} />
            <div className="orb orb-3" style={{ transform: `translateY(${scrollY * 0.15}px)` }} />

            {/* === HERO SECTION === */}
            <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
                {/* Animated Grid Background */}
                <div className="absolute inset-0 overflow-hidden opacity-10">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `
                linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)
              `,
                            backgroundSize: '60px 60px',
                            transform: `perspective(500px) rotateX(60deg) translateY(${scrollY * 0.5}px)`,
                            transformOrigin: 'center top',
                        }}
                    />
                </div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    {/* Left - Text */}
                    <div className="animate-slide-up">
                        <div className="inline-flex items-center gap-2 glass-light px-4 py-2 rounded-full mb-6">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                            <span className="text-sm text-slate-300">Smart Queue Management System</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
                            Never Wait in
                            <br />
                            <span className="gradient-text">Long Queues</span>
                            <br />
                            Again <span className="animate-wave">👋</span>
                        </h1>

                        <p className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed">
                            AI-powered queue management for hospitals, banks, government offices & hotels.
                            Book tokens, track live queues, and get SMS alerts — all from your phone.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-8">
                            <Link
                                to="/register"
                                className="btn-primary text-lg px-8 py-4 rounded-2xl inline-flex items-center gap-2 group"
                            >
                                Get Started Free
                                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/login"
                                className="btn-ghost text-lg px-8 py-4 rounded-2xl inline-flex items-center gap-2"
                            >
                                🔐 Sign In
                            </Link>
                        </div>

                        {/* Login Options */}
                        <div className="flex gap-4 flex-wrap">
                            <Link
                                to="/login"
                                className="glass-light px-5 py-3 rounded-xl flex items-center gap-3 hover:border-indigo-400/50 transition-all group cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                                    <FiUsers size={18} />
                                </div>
                                <div>
                                    <p className="text-white text-sm font-semibold group-hover:text-indigo-400 transition-colors">User Login</p>
                                    <p className="text-slate-500 text-xs">Book & track tokens</p>
                                </div>
                            </Link>
                            <Link
                                to="/login"
                                className="glass-light px-5 py-3 rounded-xl flex items-center gap-3 hover:border-amber-400/50 transition-all group cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white">
                                    <FiShield size={18} />
                                </div>
                                <div>
                                    <p className="text-white text-sm font-semibold group-hover:text-amber-400 transition-colors">Admin Login</p>
                                    <p className="text-slate-500 text-xs">Manage queues</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Right - 3D Floating Token Card */}
                    <div className="relative hidden lg:flex justify-center items-center">
                        <div
                            ref={heroRef}
                            style={getTiltStyle(heroRef)}
                            className="relative"
                        >
                            {/* Main 3D Card */}
                            <div className="w-80 glass rounded-3xl p-8 glow-primary relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
                                <div className="relative">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                                            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Now Serving</span>
                                        </div>
                                        <span className="text-slate-500 text-xs">Counter 3</span>
                                    </div>

                                    <div className="token-display text-6xl py-6 mb-6 rounded-2xl">
                                        042
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Queue Position</span>
                                            <span className="text-white font-bold">#3 of 12</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Est. Wait</span>
                                            <span className="text-emerald-400 font-bold">~8 min</span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
                                            <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full w-3/4 animate-shimmer" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating mini cards */}
                            <div className="absolute -top-8 -right-12 glass rounded-2xl p-4 animate-float" style={{ animationDelay: '0s' }}>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">🔔</span>
                                    <div>
                                        <p className="text-white text-xs font-bold">Your turn is next!</p>
                                        <p className="text-slate-500 text-[10px]">2 min ago</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-6 -left-16 glass rounded-2xl p-4 animate-float" style={{ animationDelay: '1.5s' }}>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">📱</span>
                                    <div>
                                        <p className="text-white text-xs font-bold">SMS Alert Sent</p>
                                        <p className="text-emerald-400 text-[10px]">Token Confirmed</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-1/2 -right-20 glass rounded-2xl p-3 animate-float" style={{ animationDelay: '0.8s' }}>
                                <div className="text-center">
                                    <p className="text-2xl">⚡</p>
                                    <p className="text-indigo-400 text-[10px] font-bold">Live</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
                    <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center pt-2">
                        <div className="w-1.5 h-3 bg-indigo-400 rounded-full animate-bounce" />
                    </div>
                </div>
            </section>

            {/* === STATS BAR === */}
            <section className="py-8 relative z-10">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="glass rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (
                            <div
                                key={i}
                                className="text-center transform hover:scale-110 transition-transform cursor-default"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <p className="text-3xl md:text-4xl font-black gradient-text">{stat.value}</p>
                                <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === SERVICES SECTION === */}
            <section className="py-20 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-indigo-400 text-sm font-bold uppercase tracking-widest">Our Services</span>
                        <h2 className="text-4xl md:text-5xl font-black text-white mt-3">
                            One Platform, <span className="gradient-text">Every Queue</span>
                        </h2>
                        <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                            From hospitals to hotels — manage tokens and reduce waiting time across all sectors
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, i) => (
                            <div
                                key={i}
                                className="group glass rounded-2xl p-8 card-hover relative overflow-hidden cursor-pointer"
                                style={{
                                    '--card-shadow': service.shadow,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = `0 20px 60px ${service.shadow}`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '';
                                }}
                            >
                                {/* Gradient blur on hover */}
                                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${service.color} rounded-full opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500`} />

                                <span className="text-5xl block mb-5 transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                                    {service.emoji}
                                </span>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:gradient-text transition-all">
                                    {service.name}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{service.desc}</p>

                                <div className="mt-5 flex items-center gap-2 text-indigo-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                    Explore <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === FEATURES SECTION === */}
            <section className="py-20 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Features</span>
                        <h2 className="text-4xl md:text-5xl font-black text-white mt-3">
                            Powered by <span className="gradient-text-warm">Smart Technology</span>
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="glass rounded-2xl p-8 card-hover group"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white text-xl mb-5 transform group-hover:rotate-6 group-hover:scale-110 transition-transform shadow-lg`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === HOW IT WORKS === */}
            <section className="py-20 relative z-10">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-purple-400 text-sm font-bold uppercase tracking-widest">How It Works</span>
                        <h2 className="text-4xl md:text-5xl font-black text-white mt-3">
                            3 Simple <span className="gradient-text">Steps</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'Choose Service', desc: 'Select hospital, bank, RTO, or hotel from your city', emoji: '📍' },
                            { step: '02', title: 'Book Token', desc: 'Get a digital token with QR code and estimated wait time', emoji: '🎫' },
                            { step: '03', title: 'Track & Visit', desc: 'Get live updates and arrive just when it\'s your turn', emoji: '📱' },
                        ].map((item, i) => (
                            <div key={i} className="text-center group">
                                <div className="w-20 h-20 mx-auto mb-5 glass rounded-2xl flex items-center justify-center text-4xl transform group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                                    {item.emoji}
                                </div>
                                <p className="text-indigo-400 text-xs font-bold tracking-widest mb-2">STEP {item.step}</p>
                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-slate-400 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === CITIES COVERED === */}
            <section className="py-20 relative z-10">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="text-cyan-400 text-sm font-bold uppercase tracking-widest">Coverage</span>
                        <h2 className="text-4xl font-black text-white mt-3">
                            Available in <span className="gradient-text">7 Major Cities</span>
                        </h2>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        {['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Mahabubnagar', 'Nalgonda'].map((city, i) => (
                            <div
                                key={i}
                                className="glass px-6 py-4 rounded-2xl flex items-center gap-3 card-hover cursor-default group"
                            >
                                <span className="text-2xl group-hover:animate-bounce-subtle">📍</span>
                                <span className="text-white font-bold">{city}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === CTA SECTION === */}
            <section className="py-24 relative z-10">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="relative glass rounded-3xl p-12 md:p-16 text-center overflow-hidden">
                        {/* Glow background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-emerald-600/10" />
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl" />

                        <div className="relative">
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                                Ready to Skip the Line? <span className="animate-wave">🚀</span>
                            </h2>
                            <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                                Join thousands of users saving hours of waiting time. Start for free today.
                            </p>

                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link
                                    to="/register"
                                    className="btn-accent text-lg px-10 py-5 rounded-2xl inline-flex items-center gap-2 group font-bold"
                                >
                                    <FiStar />
                                    Create Free Account
                                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/login"
                                    className="btn-ghost text-lg px-10 py-5 rounded-2xl"
                                >
                                    Already have account? Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* === FOOTER === */}
            <footer className="border-t border-slate-800/50 py-12 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src="/assets/logo.png"
                                    alt="Smart Queue System"
                                    className="h-12 w-auto object-contain"
                                />
                            </div>
                            <p className="text-slate-500 text-sm">AI-powered queue management for Telangana, India.</p>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-4">Services</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li className="hover:text-indigo-400 cursor-pointer transition-colors">🏥 Hospital Queues</li>
                                <li className="hover:text-indigo-400 cursor-pointer transition-colors">🏦 Bank Tokens</li>
                                <li className="hover:text-indigo-400 cursor-pointer transition-colors">🚗 RTO Services</li>
                                <li className="hover:text-indigo-400 cursor-pointer transition-colors">🏨 Hotel Counters</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-4">Cities</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li>📍 Hyderabad</li>
                                <li>📍 Warangal</li>
                                <li>📍 Nizamabad</li>
                                <li>📍 Karimnagar</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><Link to="/login" className="hover:text-indigo-400 transition-colors">👤 User Login</Link></li>
                                <li><Link to="/login" className="hover:text-amber-400 transition-colors">🛡️ Admin Login</Link></li>
                                <li><Link to="/register" className="hover:text-emerald-400 transition-colors">✨ Create Account</Link></li>
                                <li><Link to="/branches" className="hover:text-indigo-400 transition-colors">🏥 Browse Hospitals</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-800/50 pt-6 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-slate-600 text-sm">© 2026 SQMS — Smart Queue Management System</p>
                        <p className="text-slate-600 text-sm mt-2 md:mt-0">Made with ❤️ for Telangana</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
