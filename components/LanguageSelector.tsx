import { TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { useLanguage } from '@/hooks/useLanguage';

export function LanguageSelector() {
    const { currentLanguage, changeLanguage } = useLanguage();

    return (
        <TouchableOpacity
            onPress={() => changeLanguage(currentLanguage === 'en' ? 'zh-TW' : 'en')}
        >
            <ThemedText>
                {currentLanguage === 'en' ? '切換到中文' : 'Switch to English'}
            </ThemedText>
        </TouchableOpacity>
    );
} 