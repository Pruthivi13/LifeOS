'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import api from '@/lib/api';
import api from '@/lib/api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (userData: any, token: string) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth state from local storage
    useEffect(() => {
        const storedToken = localStorage.getItem('lifeos-token');
        const storedUser = localStorage.getItem('lifeos-user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            // Set default axios header
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
        setIsLoading(false);
    }, []);

    const login = (userData: any, newToken: string) => {
        // Normalize user data to match our User interface
        const normalizedUser: User = {
            _id: userData._id || userData.id,
            name: userData.name,
            avatar: userData.avatar || '',
            email: userData.email,
            createdAt: new Date()
        };

        setUser(normalizedUser);
        setToken(newToken);
        localStorage.setItem('lifeos-token', newToken);
        localStorage.setItem('lifeos-user', JSON.stringify(normalizedUser));

        // Set default axios header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    };

    const checkAuth = async () => {
        try {
            const res = await api.get('/api/auth/me');
            if (res.data) {
                const normalizedUser: User = {
                    _id: res.data._id || res.data.id,
                    name: res.data.name,
                    avatar: res.data.avatar || '',
                    email: res.data.email,
                    createdAt: new Date(res.data.createdAt || Date.now())
                };
                setUser(normalizedUser);
                localStorage.setItem('lifeos-user', JSON.stringify(normalizedUser));
            }
        } catch (error) {
            console.error('Failed to refresh auth', error);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('lifeos-token');
        localStorage.removeItem('lifeos-user');
        delete axios.defaults.headers.common['Authorization'];
        // Optional: Redirect to login page
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, checkAuth, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
