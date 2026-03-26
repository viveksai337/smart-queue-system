import { useState, useEffect } from 'react';
import { analyticsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { FiUsers, FiClock, FiCheckCircle, FiXCircle, FiTrendingUp, FiActivity } from 'react-icons/fi';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [hourly, setHourly] = useState([]);
    const [weekly, setWeekly] = useState([]);
    const [branchStats, setBranchStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, hourlyRes, weeklyRes, branchRes] = await Promise.all([
                    analyticsAPI.getDashboard(),
                    analyticsAPI.getHourly(),
                    analyticsAPI.getWeekly(),
                    analyticsAPI.getBranchStats(),
                ]);
                setStats(statsRes.data.data);
                setHourly(hourlyRes.data.data);
                setWeekly(weeklyRes.data.data);
                setBranchStats(branchRes.data.data);
            } catch (error) {
                console.error('Dashboard fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    const statCards = [
        { label: 'Total Users', value: stats?.total_users || 0, icon: <FiUsers />, color: 'from-primary-500 to-primary-700', textColor: 'text-primary-400' },
        { label: "Today's Tokens", value: stats?.today_tokens || 0, icon: <FiActivity />, color: 'from-accent-500 to-accent-600', textColor: 'text-accent-400' },
        { label: 'Active Now', value: stats?.active_tokens || 0, icon: <FiTrendingUp />, color: 'from-warning-400 to-warning-500', textColor: 'text-warning-400' },
        { label: 'Completed', value: stats?.completed_today || 0, icon: <FiCheckCircle />, color: 'from-green-500 to-green-600', textColor: 'text-green-400' },
        { label: 'Cancelled', value: stats?.cancelled_today || 0, icon: <FiXCircle />, color: 'from-danger-400 to-danger-500', textColor: 'text-danger-400' },
        { label: 'Avg Wait', value: `${stats?.avg_wait_time || 0}m`, icon: <FiClock />, color: 'from-purple-500 to-pink-500', textColor: 'text-purple-400' },
    ];

    const COLORS = ['#818cf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#38bdf8'];

    const chartTooltipStyle = {
        contentStyle: {
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '12px',
            color: '#e2e8f0',
            fontSize: '12px',
        },
    };

    return (
        <div className="min-h-screen px-6 py-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 animate-slide-up">
                <h1 className="text-3xl font-bold text-white">
                    Admin Dashboard <span className="animate-wave">📊</span>
                </h1>
                <p className="text-dark-400 mt-1">Real-time overview of all queue operations</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 animate-slide-up stagger-1">
                {statCards.map((card, i) => (
                    <div key={i} className="glass rounded-2xl p-5 card-hover">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-3`}>
                            {card.icon}
                        </div>
                        <p className={`text-2xl font-black ${card.textColor}`}>{card.value}</p>
                        <p className="text-dark-400 text-xs mt-1">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* Hourly Distribution */}
                <div className="glass rounded-2xl p-6 animate-slide-up stagger-2">
                    <h2 className="text-lg font-bold text-white mb-4">Today's Hourly Distribution</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hourly}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748b' }} />
                                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                                <Tooltip {...chartTooltipStyle} />
                                <Bar dataKey="tokens" fill="url(#gradient1)" radius={[4, 4, 0, 0]} />
                                <defs>
                                    <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#818cf8" />
                                        <stop offset="100%" stopColor="#4f46e5" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Weekly Trends */}
                <div className="glass rounded-2xl p-6 animate-slide-up stagger-3">
                    <h2 className="text-lg font-bold text-white mb-4">Weekly Trends</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weekly}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} />
                                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                                <Tooltip {...chartTooltipStyle} />
                                <defs>
                                    <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="tokens" stroke="#34d399" fill="url(#gradient2)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Branch Stats */}
            <div className="glass rounded-2xl p-6 animate-slide-up stagger-4">
                <h2 className="text-lg font-bold text-white mb-4">Branch-wise Status</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-dark-700/50">
                                <th className="text-left px-4 py-3 text-dark-400 font-medium">Branch</th>
                                <th className="text-left px-4 py-3 text-dark-400 font-medium">Type</th>
                                <th className="text-center px-4 py-3 text-dark-400 font-medium">Waiting</th>
                                <th className="text-center px-4 py-3 text-dark-400 font-medium">Serving</th>
                                <th className="text-center px-4 py-3 text-dark-400 font-medium">Completed</th>
                                <th className="text-center px-4 py-3 text-dark-400 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {branchStats.map((branch, i) => (
                                <tr key={i} className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors">
                                    <td className="px-4 py-3 text-white font-medium">{branch.branch_name}</td>
                                    <td className="px-4 py-3">
                                        <span className="badge" style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }}>
                                            {branch.branch_type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-warning-400 font-bold">{branch.waiting}</td>
                                    <td className="px-4 py-3 text-center text-primary-400 font-bold">{branch.serving}</td>
                                    <td className="px-4 py-3 text-center text-accent-400 font-bold">{branch.completed_today}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`badge ${branch.waiting > 10 ? 'badge-cancelled' : branch.waiting > 5 ? 'badge-warning' : 'badge-completed'}`}>
                                            {branch.waiting > 10 ? 'Busy' : branch.waiting > 5 ? 'Moderate' : 'Normal'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
