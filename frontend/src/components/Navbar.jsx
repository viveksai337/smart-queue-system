import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiLogOut, FiHome, FiGrid, FiMapPin, FiActivity, FiUsers, FiBarChart2, FiSettings, FiChevronDown } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showLoginDropdown, setShowLoginDropdown] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
        setShowLoginDropdown(false);
    }, [location]);

    const isActive = (path) => location.pathname === path;

    const userLinks = [
        { path: '/dashboard', icon: <FiGrid size={16} />, label: 'Dashboard' },
        { path: '/branches', icon: <FiMapPin size={16} />, label: 'Book Token' },
        { path: '/live-queue', icon: <FiActivity size={16} />, label: 'Live Queue' },
    ];

    const adminLinks = [
        { path: '/admin', icon: <FiBarChart2 size={16} />, label: 'Dashboard' },
        { path: '/admin/branches', icon: <FiSettings size={16} />, label: 'Branches' },
        { path: '/admin/queue', icon: <FiActivity size={16} />, label: 'Queue Control' },
        { path: '/admin/analytics', icon: <FiBarChart2 size={16} />, label: 'Analytics' },
    ];

    const navLinks = user?.role === 'admin' ? adminLinks : userLinks;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'glass py-3 shadow-lg shadow-black/20'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <img
                        src="/assets/logo.png"
                        alt="Smart Queue System"
                        className="h-10 w-auto object-contain transform group-hover:scale-105 transition-transform"
                    />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {user ? (
                        <>
                            {navLinks.map(link => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive(link.path)
                                        ? 'bg-indigo-600/20 text-indigo-400'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                        }`}
                                >
                                    {link.icon}
                                    {link.label}
                                </Link>
                            ))}
                        </>
                    ) : (
                        <>
                            <Link
                                to="/"
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive('/') ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                <FiHome size={16} />
                                Home
                            </Link>
                            <a
                                href="/#services"
                                onClick={(e) => {
                                    if (location.pathname === '/') {
                                        e.preventDefault();
                                        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-all cursor-pointer"
                            >
                                <FiGrid size={16} />
                                Services
                            </a>
                            <a
                                href="/#contact"
                                onClick={(e) => {
                                    if (location.pathname === '/') {
                                        e.preventDefault();
                                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-all cursor-pointer"
                            >
                                <FiMapPin size={16} />
                                Contact Us
                            </a>
                        </>
                    )}
                </div>

                {/* Right Side */}
                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <>
                            <div className="glass-light px-4 py-2 rounded-xl flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${user.role === 'admin' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                                <span className="text-slate-300 text-sm font-medium">{user.name}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-lg ${user.role === 'admin' ? 'bg-amber-400/15 text-amber-400' : 'bg-indigo-400/15 text-indigo-400'
                                    }`}>
                                    {user.role}
                                </span>
                            </div>
                            <button
                                onClick={logout}
                                className="p-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                                title="Logout"
                            >
                                <FiLogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Login Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-all text-sm font-medium"
                                >
                                    Login <FiChevronDown size={14} className={`transition-transform ${showLoginDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {showLoginDropdown && (
                                    <div className="absolute right-0 top-12 glass rounded-2xl p-3 w-60 animate-slide-up shadow-2xl shadow-black/40">
                                        <Link
                                            to="/login"
                                            state={{ role: 'user' }}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-500/10 transition-all group"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                                                <FiUsers size={16} />
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-bold group-hover:text-indigo-400">User Login</p>
                                                <p className="text-slate-500 text-xs">Book & track tokens</p>
                                            </div>
                                        </Link>
                                        <Link
                                            to="/login"
                                            state={{ role: 'admin' }}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-500/10 transition-all group mt-1"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white">
                                                <FiSettings size={16} />
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-bold group-hover:text-amber-400">Admin Login</p>
                                                <p className="text-slate-500 text-xs">Manage queues & branches</p>
                                            </div>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <Link
                                to="/register"
                                className="btn-primary py-2.5 px-5 text-sm rounded-xl"
                            >
                                Sign Up Free
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
                >
                    {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden glass mt-2 mx-4 rounded-2xl p-4 animate-slide-up">
                    {user ? (
                        <>
                            <div className="flex items-center gap-3 p-3 mb-3 bg-slate-800/50 rounded-xl">
                                <div className={`w-2 h-2 rounded-full ${user.role === 'admin' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                                <span className="text-white text-sm font-medium">{user.name}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-lg ml-auto ${user.role === 'admin' ? 'bg-amber-400/15 text-amber-400' : 'bg-indigo-400/15 text-indigo-400'
                                    }`}>
                                    {user.role}
                                </span>
                            </div>
                            {navLinks.map(link => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${isActive(link.path) ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    {link.icon}
                                    {link.label}
                                </Link>
                            ))}
                            <button
                                onClick={logout}
                                className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 w-full mt-2 transition-all"
                            >
                                <FiLogOut size={16} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/" className="flex items-center gap-3 p-3 rounded-xl text-white text-sm font-medium">
                                <FiHome size={16} /> Home
                            </Link>
                            <Link to="/login" className="flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:text-white text-sm font-medium mt-1">
                                <FiUsers size={16} /> User Login
                            </Link>
                            <Link to="/login" className="flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:text-amber-400 text-sm font-medium mt-1">
                                <FiSettings size={16} /> Admin Login
                            </Link>
                            <Link to="/register" className="btn-primary w-full text-center text-sm mt-3 py-3">
                                Sign Up Free
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
