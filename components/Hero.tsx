import { StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface HeroProps {
    colorScheme: 'light' | 'dark' | null;
    icon?: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
}

export const Hero = ({
    colorScheme,
    icon = 'chatbubble-ellipses-outline',
    title = 'No messages yet',
    subtitle = 'Start a conversation by typing a message below'
}: HeroProps) => {
    return (
        <ThemedView style={styles.heroContainer}>
            <Ionicons
                name={icon}
                size={64}
                color={Colors[colorScheme ?? 'light'].tabIconDefault}
            />
            <ThemedText style={styles.heroTitle}>{title}</ThemedText>
            <ThemedText style={[
                styles.heroSubtitle,
                { color: Colors[colorScheme ?? 'light'].tabIconDefault }
            ]}>
                {subtitle}
            </ThemedText>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    heroContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 24,
    },
    heroTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    heroSubtitle: {
        fontSize: 16,
        textAlign: 'center',
    },
}); 