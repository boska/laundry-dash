import { Switch } from 'react-native';
import { useTheme } from '../ctx/ThemeContext';
import { Colors } from '@/constants/Colors';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <Switch
            value={theme === 'dark'}
            onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
            trackColor={{
                false: '#767577',
                true: Colors[theme ?? 'light'].tint + '20',
            }}
            thumbColor={theme === 'dark' ? Colors[theme].tint : '#f4f3f4'}
            ios_backgroundColor="#767577"
        />
    );
} 