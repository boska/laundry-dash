import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
    signIn: (token: string) => void;
    signOut: () => void;
    login: (email: string, password: string) => Promise<void>;
    session: string | null;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadSession = async () => {
            const storedSession = await AsyncStorage.getItem('user-token');
            if (storedSession) {
                setSession(storedSession);
            }
            setIsLoading(false);
        };

        loadSession();
    }, []);

    const signIn = async (token: string) => {
        await AsyncStorage.setItem('user-token', token);
        setSession(token);
    };

    const signOut = async () => {
        await AsyncStorage.removeItem('user-token');
        setSession(null);
    };

    const login = async (email: string, password: string) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const token = 'dummy-token';
        await signIn(token);
    };

    return (
        <AuthContext.Provider value={{ signIn, signOut, login, session, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 