import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/user/Dashboard';
import BranchSelect from './pages/user/BranchSelect';
import LiveQueue from './pages/user/LiveQueue';
import AdminDashboard from './pages/admin/AdminDashboard';
import BranchManagement from './pages/admin/BranchManagement';
import QueueControl from './pages/admin/QueueControl';
import Analytics from './pages/admin/Analytics';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen">
                    <Navbar />

                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* User Routes */}
                        <Route path="/dashboard" element={
                            <ProtectedRoute><UserDashboard /></ProtectedRoute>
                        } />
                        <Route path="/branches" element={
                            <ProtectedRoute><BranchSelect /></ProtectedRoute>
                        } />
                        <Route path="/live-queue" element={
                            <ProtectedRoute><LiveQueue /></ProtectedRoute>
                        } />

                        {/* Admin Routes */}
                        <Route path="/admin" element={
                            <AdminRoute><AdminDashboard /></AdminRoute>
                        } />
                        <Route path="/admin/branches" element={
                            <AdminRoute><BranchManagement /></AdminRoute>
                        } />
                        <Route path="/admin/queue" element={
                            <AdminRoute><QueueControl /></AdminRoute>
                        } />
                        <Route path="/admin/analytics" element={
                            <AdminRoute><Analytics /></AdminRoute>
                        } />
                    </Routes>
                </div>

                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: 'rgba(30, 41, 59, 0.95)',
                            color: '#e2e8f0',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            borderRadius: '12px',
                            backdropFilter: 'blur(12px)',
                        },
                        success: {
                            iconTheme: { primary: '#10b981', secondary: '#fff' },
                        },
                        error: {
                            iconTheme: { primary: '#ef4444', secondary: '#fff' },
                        },
                    }}
                />
            </AuthProvider>
        </Router>
    );
}

export default App;
