import { useState, useEffect } from 'react';
import { branchAPI, queueAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiSearch, FiMapPin, FiClock, FiUsers, FiX, FiNavigation, FiFilter } from 'react-icons/fi';

const BranchSelect = () => {
    const [branches, setBranches] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showBooking, setShowBooking] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [purposes, setPurposes] = useState([]);
    const [selectedPurpose, setSelectedPurpose] = useState('');
    const [candidateName, setCandidateName] = useState('');
    const [categoryPrefix, setCategoryPrefix] = useState('');

    useEffect(() => { fetchCities(); }, []);
    useEffect(() => { fetchBranches(); }, [selectedCity, selectedCategory]);

    const fetchCities = async () => {
        try {
            const res = await branchAPI.getCities();
            setCities(res.data.data);
        } catch (err) { console.error('Failed to fetch cities'); }
    };

    const fetchBranches = async () => {
        setLoading(true);
        try {
            const params = {};
            if (selectedCity) params.city = selectedCity;
            if (selectedCategory) params.category = selectedCategory;
            const res = await branchAPI.getAll(params);
            setBranches(res.data.data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const openBookingModal = async (branch) => {
        setShowBooking(branch);
        setSelectedPurpose('');
        setCandidateName('');
        try {
            const res = await queueAPI.getPurposes(branch.id);
            setPurposes(res.data.data);
            setCategoryPrefix(res.data.category_prefix);
        } catch (error) {
            setPurposes(['General Service']);
            setCategoryPrefix('GEN');
        }
    };

    const handleBook = async () => {
        if (!selectedPurpose) { toast.error('Please select a purpose for your visit'); return; }
        if (!candidateName.trim()) { toast.error('Please enter your name'); return; }
        setBookingLoading(true);
        try {
            const res = await queueAPI.bookToken({
                branch_id: showBooking.id,
                purpose: selectedPurpose,
                candidate_name: candidateName.trim(),
            });
            toast.success(`Token booked! Your token: ${res.data.data.display_token}`);
            setShowBooking(null);
            fetchBranches();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Booking failed');
        } finally { setBookingLoading(false); }
    };

    const categoryLabels = {
        government: { label: 'Government', emoji: '🏛️', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30' },
        private: { label: 'Private', emoji: '🏥', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30' },
        specialty: { label: 'Specialty', emoji: '⚕️', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/30' },
    };

    const filteredBranches = branches.filter(b =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.location.toLowerCase().includes(search.toLowerCase())
    );

    const grouped = {
        government: filteredBranches.filter(b => b.category === 'government'),
        private: filteredBranches.filter(b => b.category === 'private'),
        specialty: filteredBranches.filter(b => b.category === 'specialty'),
    };

    const totalCount = filteredBranches.length;

    return (
        <div className="min-h-screen px-4 sm:px-6 py-8 max-w-7xl mx-auto pt-24">
            <div className="mb-6 animate-slide-up">
                <h1 className="text-3xl font-bold text-white">Find Hospitals <span className="animate-wave">🏥</span></h1>
                <p className="text-slate-400 mt-1">Select your city and book a token at any hospital</p>
            </div>

            {/* City Selector */}
            <div className="mb-6 animate-slide-up stagger-1">
                <div className="flex items-center gap-2 mb-3">
                    <FiNavigation className="text-indigo-400" />
                    <span className="text-sm font-semibold text-slate-300">Select City</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => setSelectedCity('')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedCity === '' ? 'bg-indigo-600 text-white glow-primary' : 'glass text-slate-400 hover:text-white'}`}>
                        🌍 All Cities
                    </button>
                    {cities.map(city => (
                        <button key={city} onClick={() => setSelectedCity(city)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedCity === city ? 'bg-indigo-600 text-white glow-primary' : 'glass text-slate-400 hover:text-white'}`}>
                            📍 {city}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-slide-up stagger-2">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type="text" placeholder="Search hospitals by name or address..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-11" />
                    {search && <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"><FiX size={16} /></button>}
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setSelectedCategory('')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedCategory === '' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-400/30' : 'glass text-slate-400 hover:text-white'}`}>All</button>
                    {Object.entries(categoryLabels).map(([key, val]) => (
                        <button key={key} onClick={() => setSelectedCategory(key === selectedCategory ? '' : key)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedCategory === key ? `${val.bg} ${val.color} border` : 'glass text-slate-400 hover:text-white'}`}>
                            {val.emoji} {val.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Bar */}
            <div className="glass rounded-2xl p-4 mb-6 flex items-center justify-between animate-slide-up stagger-2">
                <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-indigo-400">{totalCount}</span>
                    <span className="text-slate-400 text-sm">hospitals found{selectedCity && <span className="text-indigo-400"> in {selectedCity}</span>}</span>
                </div>
                <div className="flex gap-4 text-xs">
                    <span className="text-blue-400">🏛️ {grouped.government.length} Govt</span>
                    <span className="text-emerald-400">🏥 {grouped.private.length} Private</span>
                    <span className="text-purple-400">⚕️ {grouped.specialty.length} Specialty</span>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20"><div className="spinner"></div></div>
            ) : totalCount === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <p className="text-4xl mb-3">🔍</p>
                    <p className="text-slate-400">No hospitals found matching your criteria</p>
                </div>
            ) : (
                Object.entries(grouped).map(([cat, items]) => {
                    if (items.length === 0) return null;
                    const catInfo = categoryLabels[cat];
                    return (
                        <div key={cat} className="mb-8 animate-slide-up">
                            <h2 className={`text-lg font-bold ${catInfo.color} mb-4 flex items-center gap-2`}>
                                <span className="text-xl">{catInfo.emoji}</span> {catInfo.label} Hospitals
                                <span className="text-slate-500 text-sm font-normal">({items.length})</span>
                            </h2>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {items.map((branch) => (
                                    <div key={branch.id} className="glass rounded-2xl p-5 card-hover">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white font-bold text-sm truncate">{branch.name}</h3>
                                                <p className="text-slate-500 text-xs flex items-center gap-1 mt-1 truncate">
                                                    <FiMapPin size={10} className="shrink-0" /> {branch.location}
                                                </p>
                                            </div>
                                            <span className={`badge ml-2 shrink-0 ${catInfo.bg} ${catInfo.color} border text-[10px]`}>{branch.city}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                            <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                                                <p className="text-sm font-bold text-amber-400">{branch.waiting_count}</p>
                                                <p className="text-slate-600 text-[10px]">In Queue</p>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                                                <p className="text-sm font-bold text-emerald-400">{branch.active_counters}/{branch.total_counters}</p>
                                                <p className="text-slate-600 text-[10px]">Counters</p>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                                                <p className="text-sm font-bold text-indigo-400">{branch.avg_service_time}m</p>
                                                <p className="text-slate-600 text-[10px]">Avg Time</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1 text-slate-500 text-xs">
                                                <FiClock size={10} /> {branch.opening_time?.slice(0, 5)} - {branch.closing_time?.slice(0, 5)}
                                            </div>
                                            <button onClick={() => openBookingModal(branch)} className="btn-primary text-xs py-2 px-4">Book Token</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })
            )}

            {/* Booking Modal with Purpose & Candidate Name */}
            {showBooking && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
                    <div className="glass rounded-2xl p-8 max-w-md w-full animate-slide-up max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Book Token</h3>
                            <button onClick={() => setShowBooking(null)} className="p-2 text-slate-400 hover:text-white"><FiX size={20} /></button>
                        </div>

                        <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                            <p className="text-white font-bold">{showBooking.name}</p>
                            <p className="text-slate-500 text-xs mt-1">📍 {showBooking.location}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-indigo-400 text-xs font-bold bg-indigo-400/10 px-2 py-1 rounded-lg">{showBooking.city}</span>
                                <span className="text-amber-400 text-xs font-bold bg-amber-400/10 px-2 py-1 rounded-lg">{categoryPrefix} Token</span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-slate-300 mb-2">👤 Your Name</label>
                            <input type="text" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} className="input-field" placeholder="Enter your full name" />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-slate-300 mb-2">📋 Purpose of Visit</label>
                            <select value={selectedPurpose} onChange={(e) => setSelectedPurpose(e.target.value)} className="input-field">
                                <option value="" className="bg-slate-900">-- Select Purpose --</option>
                                {purposes.map((p, i) => (
                                    <option key={i} value={p} className="bg-slate-900">{p}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-6">
                            <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                                <p className="text-amber-400 font-bold">{showBooking.waiting_count}</p>
                                <p className="text-slate-500 text-[10px]">In Queue</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                                <p className="text-indigo-400 font-bold">~{Math.ceil((showBooking.waiting_count * showBooking.avg_service_time) / (showBooking.active_counters || 1))}m</p>
                                <p className="text-slate-500 text-[10px]">Est Wait</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                                <p className="text-emerald-400 font-bold">{showBooking.active_counters}</p>
                                <p className="text-slate-500 text-[10px]">Active</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setShowBooking(null)} className="btn-ghost flex-1">Cancel</button>
                            <button onClick={handleBook} disabled={bookingLoading} className="btn-accent flex-1 flex items-center justify-center gap-2">
                                {bookingLoading ? <div className="spinner w-5 h-5 border-2"></div> : `🎫 Book ${categoryPrefix} Token`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BranchSelect;
