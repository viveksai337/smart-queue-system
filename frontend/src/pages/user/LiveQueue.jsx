import { useState, useEffect } from 'react';
import { branchAPI, queueAPI } from '../../services/api';
import { FiUsers, FiClock, FiMonitor, FiRefreshCw, FiUser, FiFileText } from 'react-icons/fi';

const CATEGORY_COLORS = {
    HOS: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-400/30', label: 'Hospital' },
    BNK: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-400/30', label: 'Bank' },
    GOV: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-400/30', label: 'Government' },
    RTO: { bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-400/30', label: 'RTO' },
    PSP: { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-400/30', label: 'Passport' },
    HTL: { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-400/30', label: 'Hotel' },
    GEN: { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-400/30', label: 'General' },
};

const getTokenDisplay = (token) => {
    const prefix = token.category_prefix || 'GEN';
    return `${prefix}-${String(token.display_number).padStart(3, '0')}`;
};

const getCatStyle = (prefix) => CATEGORY_COLORS[prefix] || CATEGORY_COLORS.GEN;

const LiveQueue = () => {
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [queueData, setQueueData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const res = await branchAPI.getAll();
                setBranches(res.data.data);
                if (res.data.data.length > 0) setSelectedBranch(res.data.data[0]);
            } catch (error) { console.error('Failed to fetch branches'); }
            finally { setLoading(false); }
        };
        fetchBranches();
    }, []);

    const fetchQueue = async () => {
        if (!selectedBranch) return;
        setRefreshing(true);
        try {
            const res = await queueAPI.getLiveQueue(selectedBranch.id);
            setQueueData(res.data.data);
        } catch (error) { console.error('Failed to fetch queue'); }
        finally { setRefreshing(false); }
    };

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 5000);
        return () => clearInterval(interval);
    }, [selectedBranch]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="spinner"></div></div>;
    }

    return (
        <div className="min-h-screen px-6 py-8 max-w-6xl mx-auto pt-24">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-slide-up">
                <div>
                    <h1 className="text-3xl font-bold text-white">Live Queue 🔴</h1>
                    <p className="text-slate-400 mt-1">Real-time queue status • Auto-refreshes every 5s</p>
                </div>
                <button onClick={fetchQueue} className="btn-ghost flex items-center gap-2 text-sm">
                    <FiRefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Refresh
                </button>
            </div>

            {/* Branch Selector */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-8 animate-slide-up stagger-1">
                {branches.slice(0, 20).map((branch) => (
                    <button
                        key={branch.id}
                        onClick={() => setSelectedBranch(branch)}
                        className={`flex-shrink-0 px-5 py-3 rounded-xl text-sm font-medium transition-all ${selectedBranch?.id === branch.id ? 'bg-indigo-600 text-white glow-primary' : 'glass text-slate-400 hover:text-white'
                            }`}
                    >
                        {branch.name}
                    </button>
                ))}
            </div>

            {queueData && (
                <>
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-up stagger-2">
                        <div className="glass rounded-2xl p-5 text-center">
                            <FiUsers className="text-amber-400 mx-auto mb-2" size={24} />
                            <p className="text-3xl font-black text-white">{queueData.waiting_count}</p>
                            <p className="text-slate-400 text-xs mt-1">Waiting</p>
                        </div>
                        <div className="glass rounded-2xl p-5 text-center">
                            <FiMonitor className="text-indigo-400 mx-auto mb-2" size={24} />
                            <p className="text-3xl font-black text-white">{queueData.serving_count}</p>
                            <p className="text-slate-400 text-xs mt-1">Serving</p>
                        </div>
                        <div className="glass rounded-2xl p-5 text-center">
                            <FiClock className="text-emerald-400 mx-auto mb-2" size={24} />
                            <p className="text-3xl font-black text-white">{queueData.branch?.active_counters || 0}</p>
                            <p className="text-slate-400 text-xs mt-1">Active Counters</p>
                        </div>
                        <div className="glass rounded-2xl p-5 text-center">
                            <FiClock className="text-red-400 mx-auto mb-2" size={24} />
                            <p className="text-3xl font-black text-white">
                                ~{queueData.branch ? Math.ceil((queueData.waiting_count * queueData.branch.avg_service_time) / (queueData.branch.active_counters || 1)) : 0}
                            </p>
                            <p className="text-slate-400 text-xs mt-1">Est. Wait (min)</p>
                        </div>
                    </div>

                    {/* Now Serving */}
                    {queueData.serving.length > 0 && (
                        <div className="mb-8 animate-slide-up stagger-3">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                                Now Serving
                            </h2>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {queueData.serving.map((token) => {
                                    const catStyle = getCatStyle(token.category_prefix);
                                    return (
                                        <div key={token.id} className="glass rounded-xl p-5 border-l-4 border-indigo-500">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="token-display text-xl py-2 px-4 rounded-lg">
                                                    {getTokenDisplay(token)}
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-slate-500 text-xs">Counter</p>
                                                    <p className="text-2xl font-bold text-indigo-400">{token.counter_id || '-'}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-white text-sm font-semibold flex items-center gap-2">
                                                    <FiUser size={12} className="text-indigo-400" /> {token.candidate_name || token.user?.name || 'Customer'}
                                                </p>
                                                <p className="text-slate-400 text-xs flex items-center gap-2">
                                                    <FiFileText size={12} className="text-emerald-400" /> {token.purpose || 'General Service'}
                                                </p>
                                            </div>
                                            <span className={`badge mt-2 ${catStyle.bg} ${catStyle.text} border ${catStyle.border}`}>{catStyle.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Waiting Queue */}
                    <div className="animate-slide-up stagger-4">
                        <h2 className="text-lg font-bold text-white mb-4">Waiting Queue</h2>
                        {queueData.waiting.length === 0 ? (
                            <div className="glass rounded-2xl p-10 text-center">
                                <p className="text-3xl mb-2">✨</p>
                                <p className="text-slate-400">Queue is empty!</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {queueData.waiting.map((token, index) => {
                                    const catStyle = getCatStyle(token.category_prefix);
                                    return (
                                        <div key={token.id} className="queue-item flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm">
                                                    #{index + 1}
                                                </div>
                                                <div className={`px-3 py-1 rounded-lg ${catStyle.bg} border ${catStyle.border}`}>
                                                    <span className={`${catStyle.text} text-sm font-black`}>{getTokenDisplay(token)}</span>
                                                </div>
                                                <div>
                                                    <p className="text-white font-semibold text-sm">
                                                        {token.candidate_name || token.user?.name || 'Customer'}
                                                    </p>
                                                    <p className="text-slate-500 text-xs flex items-center gap-1">
                                                        <FiFileText size={10} /> {token.purpose || 'General Service'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="badge badge-waiting">Waiting</span>
                                                <p className="text-slate-500 text-xs mt-1">~{token.estimated_time} min</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default LiveQueue;
