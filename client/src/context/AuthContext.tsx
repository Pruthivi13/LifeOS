'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
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

    // Initialize auth state from local storage and sync with server
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('lifeos-token');
            const storedUser = localStorage.getItem('lifeos-user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                // Set cached user first for immediate display
                setUser(JSON.parse(storedUser));

                // Then fetch fresh data from server to sync
                try {
                    const res = await api.get('/api/auth/me', {
                        headers: { Authorization: `Bearer ${storedToken}` }
                    });
                    if (res.data) {
                        const freshUser: User = {
                            _id: res.data._id || res.data.id,
                            name: res.data.name,
                            avatar: res.data.avatar || '',
                            email: res.data.email,
                            phone: res.data.phone,
                            createdAt: new Date(res.data.createdAt || Date.now())
                        };
                        setUser(freshUser);
                        localStorage.setItem('lifeos-user', JSON.stringify(freshUser));
                    }
                } catch (error) {
                    console.error('Failed to sync user data:', error);
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = (userData: any, newToken: string) => {
        // Normalize user data to match our User interface
        const normalizedUser: User = {
            _id: userData._id || userData.id,
            name: userData.name,
            avatar: userData.avatar || '',
            email: userData.email,
            phone: userData.phone,
            createdAt: new Date()
        };

        setUser(normalizedUser);
        setToken(newToken);
        localStorage.setItem('lifeos-token', newToken);
        localStorage.setItem('lifeos-user', JSON.stringify(normalizedUser));
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
                    phone: res.data.phone,
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
