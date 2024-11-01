import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorSchemeName, useColorScheme } from 'react-native';

type ThemeMode = 'system' | 'light' | 'dark';

type ThemeContextType = {
    themeMode: ThemeMode;
    theme: ColorSchemeName;
    setThemeMode: (mode: ThemeMode) => void;
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

    // Calculate actual theme based on mode
    const theme: ColorSchemeName = themeMode === 'system'
        ? systemTheme
        : themeMode;

    return (
        <ThemeContext.Provider value={{
            themeMode,
            theme,
            setThemeMode: handleSetThemeMode
        }}>
            {children}
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