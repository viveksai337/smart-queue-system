import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('sqms_token');
        const savedUser = localStorage.getItem('sqms_user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await authAPI.login({ email, password });
        const { user: userData, token: authToken } = res.data.data;

        setUser(userData);
        setToken(authToken);
        localStorage.setItem('sqms_token', authToken);
        localStorage.setItem('sqms_user', JSON.stringify(userData));

        return userData;
    };

    const register = async (userData) => {
        const res = await authAPI.register(userData);
        const { user: newUser, token: authToken } = res.data.data;

        setUser(newUser);
        setToken(authToken);
        localStorage.setItem('sqms_token', authToken);
        localStorage.setItem('sqms_user', JSON.stringify(newUser));

        return newUser;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('sqms_token');
        localStorage.removeItem('sqms_user');
    };

    const isAdmin = user?.role === 'admin';
    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login,
            register,
            logout,
            isAdmin,
            isAuthenticated,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export default AuthContext;
