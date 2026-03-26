import { useState, useEffect } from 'react';
import { queueAPI, branchAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiPlay, FiSkipForward, FiCheck, FiRefreshCw, FiUser, FiFileText, FiHash, FiMapPin } from 'react-icons/fi';

const CATEGORY_COLORS = {
    HOS: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-400/30', label: 'Hospital' },
    BNK: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-400/30', label: 'Bank' },
    GOV: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-400/30', label: 'Government' },
    RTO: { bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-400/30', label: 'RTO' },
    PSP: { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-400/30', label: 'Passport' },
    HTL: { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-400/30', label: 'Hotel' },
    GEN: { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-400/30', label: 'General' },
};

const QueueControl = () => {
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedCounter, setSelectedCounter] = useState(1);
    const [queue, setQueue] = useState({ waiting: [], serving: [], branch: null });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBranches();
    }, []);

    useEffect(() => {
        if (selectedBranch) fetchQueue();
    }, [selectedBranch]);

    const fetchBranches = async () => {
        try {
            const res = await branchAPI.getAll();
            setBranches(res.data.data);
            if (res.data.data.length > 0) {
                setSelectedBranch(res.data.data[0].id);
            }
        } catch (error) {
            toast.error('Failed to load branches');
        }
    };

    const fetchQueue = async () => {
        setLoading(true);
        try {
            const res = await queueAPI.getLiveQueue(selectedBranch);
            setQueue(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCallNext = async () => {
        try {
            const res = await queueAPI.callNext({ branch_id: selectedBranch, counter_id: selectedCounter });
            toast.success(res.data.message);
            fetchQueue();
        } catch (error) {
            toast.error('Failed to call next token');
        }
    };

    const handleComplete = async (tokenId) => {
        try {
            await queueAPI.completeToken(tokenId);
            toast.success('Token completed!');
            fetchQueue();
        } catch (error) {
            toast.error('Failed to complete token');
        }
    };

    const handleSkip = async (tokenId) => {
        try {
            await queueAPI.skipToken(tokenId);
            toast.success('Token skipped!');
            fetchQueue();
        } catch (error) {
            toast.error('Failed to skip token');
        }
    };

    const getTokenDisplay = (token) => {
        const prefix = token.category_prefix || 'GEN';
        return `${prefix}-${String(token.display_number).padStart(3, '0')}`;
    };

    const getCatStyle = (prefix) => CATEGORY_COLORS[prefix] || CATEGORY_COLORS.GEN;

    return (
        <div className="min-h-screen px-4 sm:px-6 py-8 max-w-7xl mx-auto pt-24">
            {/* Header */}
            <div className="mb-6 animate-slide-up">
                <h1 className="text-3xl font-bold text-white">Queue Control Panel <span className="animate-wave">🎛️</span></h1>
                <p className="text-slate-400 mt-1">Manage tokens — call, complete, and skip with candidate details</p>
            </div>

            {/* Branch & Counter Selector */}
            <div className="glass rounded-2xl p-6 mb-6 animate-slide-up stagger-1">
                <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">🏥 Select Branch</label>
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="input-field"
                        >
                            {branches.map(b => (
                                <option key={b.id} value={b.id} className="bg-slate-900">{b.name} ({b.city})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">🖥️ Counter</label>
                        <select
                            value={selectedCounter}
                            onChange={(e) => setSelectedCounter(Number(e.target.value))}
                            className="input-field"
                        >
                            {queue.branch && Array.from({ length: queue.branch.total_counters }, (_, i) => (
                                <option key={i + 1} value={i + 1} className="bg-slate-900">Counter {i + 1}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end gap-2">
                        <button onClick={handleCallNext} className="btn-accent flex-1 flex items-center justify-center gap-2 py-3">
                            <FiPlay size={16} /> Call Next
                        </button>
                        <button onClick={fetchQueue} className="btn-ghost p-3" title="Refresh">
                            <FiRefreshCw size={16} />
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="bg-amber-400/10 rounded-xl p-3 text-center border border-amber-400/20">
                        <p className="text-2xl font-black text-amber-400">{queue.waiting_count || 0}</p>
                        <p className="text-slate-400 text-xs">Waiting</p>
                    </div>
                    <div className="bg-indigo-400/10 rounded-xl p-3 text-center border border-indigo-400/20">
                        <p className="text-2xl font-black text-indigo-400">{queue.serving_count || 0}</p>
                        <p className="text-slate-400 text-xs">Serving</p>
                    </div>
                    <div className="bg-emerald-400/10 rounded-xl p-3 text-center border border-emerald-400/20">
                        <p className="text-2xl font-black text-emerald-400">{queue.branch?.active_counters || 0}</p>
                        <p className="text-slate-400 text-xs">Active Counters</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20"><div className="spinner"></div></div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* NOW SERVING */}
                    <div className="animate-slide-up stagger-2">
                        <h2 className="text-lg font-bold text-indigo-400 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
                            Now Serving ({queue.serving?.length || 0})
                        </h2>

                        {queue.serving?.length === 0 ? (
                            <div className="glass rounded-2xl p-8 text-center">
                                <p className="text-3xl mb-2">🕐</p>
                                <p className="text-slate-500 text-sm">No one being served. Click "Call Next" to start.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {queue.serving?.map((token) => {
                                    const catStyle = getCatStyle(token.category_prefix);
                                    return (
                                        <div key={token.id} className="glass rounded-2xl p-5 border-l-4 border-indigo-500 glow-primary">
                                            {/* Token Header */}
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="token-display text-2xl py-3 px-5 rounded-xl">
                                                        {getTokenDisplay(token)}
                                                    </div>
                                                    <span className={`badge ${catStyle.bg} ${catStyle.text} border ${catStyle.border}`}>
                                                        {catStyle.label}
                                                    </span>
                                                </div>
                                                <span className="text-slate-500 text-xs">Counter {token.counter_id}</span>
                                            </div>

                                            {/* Candidate Info */}
                                            <div className="bg-slate-800/50 rounded-xl p-3 mb-3 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <FiUser className="text-indigo-400" size={14} />
                                                    <span className="text-white font-semibold text-sm">{token.candidate_name || token.user?.name || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FiFileText className="text-emerald-400" size={14} />
                                                    <span className="text-slate-300 text-sm">{token.purpose || 'General Service'}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <button onClick={() => handleComplete(token.id)} className="btn-accent flex-1 text-xs py-2 flex items-center justify-center gap-1">
                                                    <FiCheck size={14} /> Complete
                                                </button>
                                                <button onClick={() => handleSkip(token.id)} className="btn-ghost text-xs py-2 px-4 flex items-center gap-1">
                                                    <FiSkipForward size={14} /> Skip
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* WAITING QUEUE */}
                    <div className="animate-slide-up stagger-3">
                        <h2 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                            Waiting Queue ({queue.waiting?.length || 0})
                        </h2>

                        {queue.waiting?.length === 0 ? (
                            <div className="glass rounded-2xl p-8 text-center">
                                <p className="text-3xl mb-2">🎉</p>
                                <p className="text-slate-500 text-sm">Queue is empty! No one waiting.</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                                {queue.waiting?.map((token, index) => {
                                    const catStyle = getCatStyle(token.category_prefix);
                                    return (
                                        <div key={token.id} className="glass rounded-xl p-4 card-hover group">
                                            <div className="flex items-center gap-3">
                                                {/* Position */}
                                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-bold shrink-0">
                                                    #{index + 1}
                                                </div>

                                                {/* Token Number */}
                                                <div className={`px-3 py-1.5 rounded-lg ${catStyle.bg} border ${catStyle.border} shrink-0`}>
                                                    <span className={`${catStyle.text} text-sm font-black`}>{getTokenDisplay(token)}</span>
                                                </div>

                                                {/* Candidate Info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white text-sm font-semibold truncate">
                                                        {token.candidate_name || token.user?.name || 'Guest'}
                                                    </p>
                                                    <p className="text-slate-500 text-xs truncate flex items-center gap-1">
                                                        <FiFileText size={10} /> {token.purpose || 'General Service'}
                                                    </p>
                                                </div>

                                                {/* Priority Badge */}
                                                {token.priority === 'vip' && (
                                                    <span className="badge bg-amber-400/15 text-amber-400 border border-amber-400/30 text-[10px]">VIP</span>
                                                )}
                                                {token.priority === 'priority' && (
                                                    <span className="badge bg-red-400/15 text-red-400 border border-red-400/30 text-[10px]">Priority</span>
                                                )}

                                                {/* Actions - Visible on hover */}
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                    <button onClick={() => handleSkip(token.id)} className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 transition-all" title="Skip">
                                                        <FiSkipForward size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Est Time */}
                                            <div className="flex items-center gap-2 mt-2 ml-11">
                                                <span className="text-slate-600 text-[10px]">Est: ~{token.estimated_time || 0} min</span>
                                                <span className="text-slate-700 text-[10px]">•</span>
                                                <span className="text-slate-600 text-[10px]">{new Date(token.createdAt || token.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QueueControl;
