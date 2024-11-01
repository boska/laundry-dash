import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { useLanguage } from '@/hooks/useLanguage';

export function LanguageSelector() {
    const { currentLanguage, changeLanguage } = useLanguage();

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={() => changeLanguage(currentLanguage === 'en' ? 'zh-TW' : 'en')}
        >
            <ThemedText style={styles.emoji}>
                {currentLanguage === 'en' ? '🇹🇼' : '🇺🇸'}
            </ThemedText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 8,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emoji: {
        fontSize: 24,
    },
}); 