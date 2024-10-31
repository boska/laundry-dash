import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';

interface AuthContextType {
    signIn: (token: string) => void;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    signIn: () => null,
    signOut: () => null,
    session: null,
    isLoading: false,
});

export function useAuth() {
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useAuth must be wrapped in a <AuthProvider />');
        }
    }
    return value;
}

export function AuthProvider({ children }: PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState('user-token');

    return (
        <AuthContext.Provider
            value={{
                signIn: (token: string) => {
                    setSession(token);
                },
                signOut: () => {
                    setSession(null);
                },
                session,
                isLoading,
            }}>
            {children}
        </AuthContext.Provider>
    );
} 