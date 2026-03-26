import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { queueAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import { FiClock, FiMapPin, FiHash, FiX, FiPlus, FiChevronRight } from 'react-icons/fi';

const UserDashboard = () => {
    const { user } = useAuth();
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedToken, setSelectedToken] = useState(null);

    const fetchTokens = async () => {
        try {
            const res = await queueAPI.getMyTokens();
            setTokens(res.data.data);
        } catch (error) {
            console.error('Failed to fetch tokens:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTokens();
        const interval = setInterval(fetchTokens, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleCancel = async (tokenId) => {
        try {
            await queueAPI.cancelToken(tokenId);
            toast.success('Token cancelled successfully');
            fetchTokens();
        } catch (error) {
            toast.error('Failed to cancel token');
        }
    };

    const activeTokens = tokens.filter(t => ['waiting', 'serving'].includes(t.status));
    const pastTokens = tokens.filter(t => ['completed', 'cancelled', 'skipped'].includes(t.status));

    const getStatusBadge = (status) => {
        const classes = {
            waiting: 'badge-waiting',
            serving: 'badge-serving',
            completed: 'badge-completed',
            cancelled: 'badge-cancelled',
            skipped: 'badge-skipped',
        };
        return <span className={`badge ${classes[status]}`}>{status}</span>;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-6 py-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8 animate-slide-up">
                <h1 className="text-3xl font-bold text-white">
                    Hello, {user?.name}! <span className="animate-wave">👋</span>
                </h1>
                <p className="text-dark-400 mt-1">Manage your queue tokens and track your position</p>
            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 animate-slide-up stagger-1">
                <Link to="/branches" className="glass rounded-2xl p-6 card-hover no-underline group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                        <FiPlus size={22} />
                    </div>
                    <h3 className="text-white font-bold text-lg">Book New Token</h3>
                    <p className="text-dark-400 text-sm mt-1">Select a branch and get your token</p>
                </Link>

                <Link to="/live-queue" className="glass rounded-2xl p-6 card-hover no-underline group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                        <FiClock size={22} />
                    </div>
                    <h3 className="text-white font-bold text-lg">Live Queue</h3>
                    <p className="text-dark-400 text-sm mt-1">View real-time queue status</p>
                </Link>

                <div className="glass rounded-2xl p-6 card-hover">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning-400 to-warning-500 flex items-center justify-center text-white">
                            <FiHash size={22} />
                        </div>
                        <div>
                            <p className="text-dark-400 text-sm">Active Tokens</p>
                            <p className="text-3xl font-black text-white">{activeTokens.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Tokens */}
            <div className="mb-10 animate-slide-up stagger-2">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></span>
                    Active Tokens
                </h2>

                {activeTokens.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <p className="text-4xl mb-4">🎫</p>
                        <p className="text-dark-400 text-lg">No active tokens</p>
                        <p className="text-dark-500 text-sm mt-1">Book a token to get started!</p>
                        <Link to="/branches" className="btn-primary inline-flex items-center gap-2 mt-4 no-underline">
                            Book Token <FiChevronRight />
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {activeTokens.map((token) => (
                            <div key={token.id} className={`glass rounded-2xl p-6 card-hover ${token.status === 'serving' ? 'glow-primary' : ''}`}>
                                <div className="flex items-start justify-between mb-4">
                                    {getStatusBadge(token.status)}
                                    {token.status === 'waiting' && (
                                        <button
                                            onClick={() => handleCancel(token.id)}
                                            className="p-1.5 rounded-lg text-dark-500 hover:text-danger-400 hover:bg-danger-400/10 transition-all"
                                            title="Cancel token"
                                        >
                                            <FiX size={16} />
                                        </button>
                                    )}
                                </div>

                                <div className="token-display text-4xl mb-4 rounded-xl py-6">
                                    {String(token.display_number).padStart(3, '0')}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-dark-400 text-sm">
                                        <FiMapPin size={14} />
                                        <span>{token.branch?.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-dark-400 text-sm">
                                        <FiClock size={14} />
                                        <span>
                                            {token.status === 'serving'
                                                ? `Serving at Counter ${token.counter_id || '-'}`
                                                : `Position: #${token.position} | ~${token.estimated_time} min wait`
                                            }
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-dark-400 text-sm">
                                        <FiHash size={14} />
                                        <span className="font-mono text-xs">{token.token_number}</span>
                                    </div>
                                </div>

                                {/* QR Code */}
                                <button
                                    onClick={() => setSelectedToken(selectedToken?.id === token.id ? null : token)}
                                    className="btn-ghost w-full mt-4 text-sm py-2"
                                >
                                    {selectedToken?.id === token.id ? 'Hide QR' : 'Show QR Code'}
                                </button>

                                {selectedToken?.id === token.id && (
                                    <div className="mt-4 flex justify-center p-4 bg-white rounded-xl animate-slide-up">
                                        <QRCodeSVG value={token.qr_code || token.token_number} size={160} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Past Tokens */}
            {pastTokens.length > 0 && (
                <div className="animate-slide-up stagger-3">
                    <h2 className="text-xl font-bold text-white mb-4">Recent History</h2>
                    <div className="glass rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-dark-700/50">
                                        <th className="text-left px-6 py-4 text-dark-400 font-medium">Token</th>
                                        <th className="text-left px-6 py-4 text-dark-400 font-medium">Branch</th>
                                        <th className="text-left px-6 py-4 text-dark-400 font-medium">Status</th>
                                        <th className="text-left px-6 py-4 text-dark-400 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pastTokens.slice(0, 10).map((token) => (
                                        <tr key={token.id} className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors">
                                            <td className="px-6 py-4 font-mono text-white font-bold">#{String(token.display_number).padStart(3, '0')}</td>
                                            <td className="px-6 py-4 text-dark-300">{token.branch?.name}</td>
                                            <td className="px-6 py-4">{getStatusBadge(token.status)}</td>
                                            <td className="px-6 py-4 text-dark-400">{new Date(token.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
