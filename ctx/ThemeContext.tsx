import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorSchemeName } from 'react-native';

type ThemeContextType = {
    theme: ColorSchemeName;
    setTheme: (theme: ColorSchemeName) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<ColorSchemeName>(null);

    useEffect(() => {
        // Load saved theme when app starts
        loadSavedTheme();
    }, []);

    const loadSavedTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('userTheme');
            if (savedTheme) {
                setTheme(savedTheme as ColorSchemeName);
            }
        } catch (error) {
            console.error('Error loading theme:', error);
        }
    };

    const handleSetTheme = async (newTheme: ColorSchemeName) => {
        try {
            await AsyncStorage.setItem('userTheme', newTheme || '');
            setTheme(newTheme);
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
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