import { useState, useEffect } from 'react';
import { analyticsAPI } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell } from 'recharts';
import { FiTrendingUp, FiClock, FiSun, FiMoon } from 'react-icons/fi';

const Analytics = () => {
    const [peakData, setPeakData] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const [hourlyData, setHourlyData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [peakRes, weeklyRes, hourlyRes] = await Promise.all([
                    analyticsAPI.getPeakHours(),
                    analyticsAPI.getWeekly(),
                    analyticsAPI.getHourly(),
                ]);
                setPeakData(peakRes.data.data);
                setWeeklyData(weeklyRes.data.data);
                setHourlyData(hourlyRes.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const chartTooltipStyle = {
        contentStyle: {
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '12px',
            color: '#e2e8f0',
            fontSize: '12px',
        },
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    // Find peak hours
    const peakHours = peakData.filter(d => d.is_peak);
    const busiestHour = peakData.reduce((max, curr) => curr.avg_tokens > (max?.avg_tokens || 0) ? curr : max, null);

    return (
        <div className="min-h-screen px-6 py-8 max-w-7xl mx-auto">
            <div className="mb-8 animate-slide-up">
                <h1 className="text-3xl font-bold text-white">Analytics & Insights</h1>
                <p className="text-dark-400 mt-1">Peak hour analysis and performance metrics</p>
            </div>

            {/* Key Insights */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up stagger-1">
                <div className="glass rounded-2xl p-5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-danger-400 to-danger-500 flex items-center justify-center text-white mb-3">
                        <FiTrendingUp />
                    </div>
                    <p className="text-white font-bold text-lg">
                        {busiestHour?.hour || 'N/A'}
                    </p>
                    <p className="text-dark-400 text-xs">Busiest Hour</p>
                </div>

                <div className="glass rounded-2xl p-5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warning-400 to-warning-500 flex items-center justify-center text-white mb-3">
                        <FiSun />
                    </div>
                    <p className="text-white font-bold text-lg">{peakHours.length}</p>
                    <p className="text-dark-400 text-xs">Peak Hours Today</p>
                </div>

                <div className="glass rounded-2xl p-5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white mb-3">
                        <FiClock />
                    </div>
                    <p className="text-white font-bold text-lg">
                        {busiestHour?.avg_tokens?.toFixed(1) || 0}
                    </p>
                    <p className="text-dark-400 text-xs">Avg Tokens/Hour (Peak)</p>
                </div>

                <div className="glass rounded-2xl p-5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-white mb-3">
                        <FiMoon />
                    </div>
                    <p className="text-white font-bold text-lg">
                        {weeklyData.reduce((sum, d) => sum + d.tokens, 0)}
                    </p>
                    <p className="text-dark-400 text-xs">This Week Total</p>
                </div>
            </div>

            {/* Peak Hour Chart */}
            <div className="glass rounded-2xl p-6 mb-6 animate-slide-up stagger-2">
                <h2 className="text-lg font-bold text-white mb-4">Peak Hour Analysis (Last 30 Days)</h2>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={peakData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748b' }} />
                            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                            <Tooltip {...chartTooltipStyle} />
                            <Bar
                                dataKey="avg_tokens"
                                radius={[4, 4, 0, 0]}
                                fill="#818cf8"
                            >
                                {peakData.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={entry.is_peak ? '#ef4444' : '#818cf8'}
                                    />
                                ))}
                            </Bar>
                            <defs>
                                <linearGradient id="peakGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ef4444" />
                                    <stop offset="100%" stopColor="#dc2626" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex gap-6 mt-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-primary-400"></div>
                        <span className="text-dark-400">Normal Hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-danger-400"></div>
                        <span className="text-dark-400">Peak Hours</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Today's Hourly */}
                <div className="glass rounded-2xl p-6 animate-slide-up stagger-3">
                    <h2 className="text-lg font-bold text-white mb-4">Today's Hourly Token Flow</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={hourlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#64748b' }} />
                                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                                <Tooltip {...chartTooltipStyle} />
                                <defs>
                                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#818cf8" stopOpacity={0.4} />
                                        <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="tokens" stroke="#818cf8" fill="url(#areaGradient)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Weekly Trend */}
                <div className="glass rounded-2xl p-6 animate-slide-up stagger-4">
                    <h2 className="text-lg font-bold text-white mb-4">Weekly Comparison</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} />
                                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                                <Tooltip {...chartTooltipStyle} />
                                <Bar dataKey="tokens" fill="url(#weeklyGradient)" radius={[6, 6, 0, 0]} />
                                <defs>
                                    <linearGradient id="weeklyGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#34d399" />
                                        <stop offset="100%" stopColor="#059669" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
