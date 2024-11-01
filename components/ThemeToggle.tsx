import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../ctx/ThemeContext';
import { Colors } from '@/constants/Colors';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <TouchableOpacity
            style={{ padding: 8 }}
            onPress={toggleTheme}
        >
            {theme === 'dark' ? (
                <FontAwesome name="sun-o" size={24} color={Colors[theme ?? 'light'].text} />
            ) : (
                <FontAwesome name="moon-o" size={24} color={Colors[theme ?? 'light'].text} />
            )}
        </TouchableOpacity>
    );
} 