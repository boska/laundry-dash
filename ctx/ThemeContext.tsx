import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';

type ThemeMode = 'system' | 'light' | 'dark';

type ThemeContextType = {
    themeMode: ThemeMode;
    isDark: boolean;
    setThemeMode: (mode: ThemeMode) => void;
    colors: typeof Colors['light'] | typeof Colors['dark'];
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemTheme = useColorScheme();
    const [themeMode, setThemeMode] = useState<ThemeMode>('system');

    useEffect(() => {
        loadSavedTheme();
    }, []);

    const loadSavedTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('userThemeMode');
            if (savedTheme) {
                setThemeMode(savedTheme as ThemeMode);
            }
        } catch (error) {
            console.error('Error loading theme:', error);
        }
    };

    const handleSetThemeMode = async (newMode: ThemeMode) => {
        try {
            await AsyncStorage.setItem('userThemeMode', newMode);
            setThemeMode(newMode);
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    };

    const isDark = themeMode === 'system'
        ? systemTheme === 'dark'
        : themeMode === 'dark';

    const colors = Colors[isDark ? 'dark' : 'light'];

    return (
        <ThemeContext.Provider value={{
            themeMode,
            isDark,
            setThemeMode: handleSetThemeMode,
            colors
        }}>
            <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
                {children}
            </NavigationThemeProvider>
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}; 