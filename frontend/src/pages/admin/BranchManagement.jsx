import { useState, useEffect } from 'react';
import { branchAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiClock, FiX } from 'react-icons/fi';

const BranchManagement = () => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        name: '', location: '', type: 'bank',
        total_counters: 5, active_counters: 3,
        avg_service_time: 10, opening_time: '09:00',
        closing_time: '17:00',
    });

    const fetchBranches = async () => {
        try {
            const res = await branchAPI.getAll();
            setBranches(res.data.data);
        } catch (error) {
            console.error('Failed to fetch branches');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await branchAPI.update(editing.id, form);
                toast.success('Branch updated!');
            } else {
                await branchAPI.create(form);
                toast.success('Branch created!');
            }
            setShowModal(false);
            setEditing(null);
            resetForm();
            fetchBranches();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (branch) => {
        setEditing(branch);
        setForm({
            name: branch.name,
            location: branch.location,
            type: branch.type,
            total_counters: branch.total_counters,
            active_counters: branch.active_counters,
            avg_service_time: branch.avg_service_time,
            opening_time: branch.opening_time?.slice(0, 5) || '09:00',
            closing_time: branch.closing_time?.slice(0, 5) || '17:00',
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to deactivate this branch?')) return;
        try {
            await branchAPI.delete(id);
            toast.success('Branch deactivated');
            fetchBranches();
        } catch (error) {
            toast.error('Failed to deactivate branch');
        }
    };

    const resetForm = () => {
        setForm({
            name: '', location: '', type: 'bank',
            total_counters: 5, active_counters: 3,
            avg_service_time: 10, opening_time: '09:00',
            closing_time: '17:00',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: ['total_counters', 'active_counters', 'avg_service_time'].includes(name)
                ? parseInt(value) || 0
                : value,
        }));
    };

    const typeEmojis = { bank: '🏦', hospital: '🏥', government: '🏛️', rto: '🚗', passport: '🛂' };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-6 py-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8 animate-slide-up">
                <div>
                    <h1 className="text-3xl font-bold text-white">Branch Management</h1>
                    <p className="text-dark-400 mt-1">Add, edit, and manage all service branches</p>
                </div>
                <button
                    onClick={() => { resetForm(); setEditing(null); setShowModal(true); }}
                    className="btn-primary flex items-center gap-2"
                >
                    <FiPlus /> Add Branch
                </button>
            </div>

            {/* Branch Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-up stagger-1">
                {branches.map((branch) => (
                    <div key={branch.id} className="glass rounded-2xl p-6 card-hover">
                        <div className="flex items-start justify-between mb-3">
                            <span className="text-3xl">{typeEmojis[branch.type]}</span>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleEdit(branch)}
                                    className="p-2 rounded-lg text-dark-400 hover:text-primary-400 hover:bg-primary-400/10 transition-all"
                                >
                                    <FiEdit2 size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(branch.id)}
                                    className="p-2 rounded-lg text-dark-400 hover:text-danger-400 hover:bg-danger-400/10 transition-all"
                                >
                                    <FiTrash2 size={14} />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1">{branch.name}</h3>
                        <p className="text-dark-400 text-sm flex items-center gap-1 mb-4">
                            <FiMapPin size={12} /> {branch.location}
                        </p>

                        <div className="grid grid-cols-3 gap-2 mb-3">
                            <div className="bg-dark-800/50 rounded-lg p-2 text-center">
                                <p className="text-sm font-bold text-warning-400">{branch.waiting_count}</p>
                                <p className="text-dark-500 text-[10px]">Queue</p>
                            </div>
                            <div className="bg-dark-800/50 rounded-lg p-2 text-center">
                                <p className="text-sm font-bold text-accent-400">{branch.active_counters}/{branch.total_counters}</p>
                                <p className="text-dark-500 text-[10px]">Counters</p>
                            </div>
                            <div className="bg-dark-800/50 rounded-lg p-2 text-center">
                                <p className="text-sm font-bold text-primary-400">{branch.avg_service_time}m</p>
                                <p className="text-dark-500 text-[10px]">Avg Time</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 text-dark-500 text-xs">
                            <FiClock size={10} />
                            {branch.opening_time?.slice(0, 5)} - {branch.closing_time?.slice(0, 5)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
                    <div className="glass rounded-2xl p-8 max-w-lg w-full animate-slide-up max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">
                                {editing ? 'Edit Branch' : 'Add New Branch'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="p-2 text-dark-400 hover:text-white">
                                <FiX size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-dark-300 mb-1">Branch Name</label>
                                <input name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="SBI Main Branch" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-300 mb-1">Location</label>
                                <input name="location" value={form.location} onChange={handleChange} className="input-field" placeholder="Full address" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-300 mb-1">Type</label>
                                <select name="type" value={form.type} onChange={handleChange} className="input-field">
                                    <option value="bank" className="bg-dark-900">🏦 Bank</option>
                                    <option value="hospital" className="bg-dark-900">🏥 Hospital</option>
                                    <option value="government" className="bg-dark-900">🏛️ Government</option>
                                    <option value="rto" className="bg-dark-900">🚗 RTO</option>
                                    <option value="passport" className="bg-dark-900">🛂 Passport</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-dark-300 mb-1">Total Counters</label>
                                    <input type="number" name="total_counters" value={form.total_counters} onChange={handleChange} className="input-field" min="1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-300 mb-1">Active Counters</label>
                                    <input type="number" name="active_counters" value={form.active_counters} onChange={handleChange} className="input-field" min="0" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-300 mb-1">Avg Service Time (min)</label>
                                <input type="number" name="avg_service_time" value={form.avg_service_time} onChange={handleChange} className="input-field" min="1" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-dark-300 mb-1">Opening Time</label>
                                    <input type="time" name="opening_time" value={form.opening_time} onChange={handleChange} className="input-field" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-300 mb-1">Closing Time</label>
                                    <input type="time" name="closing_time" value={form.closing_time} onChange={handleChange} className="input-field" />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1">Cancel</button>
                                <button type="submit" className="btn-primary flex-1">
                                    {editing ? 'Update Branch' : 'Create Branch'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BranchManagement;
