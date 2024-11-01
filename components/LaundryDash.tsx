import { Animated } from 'react-native';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { useRef } from 'react';
import { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/build/FontAwesome';
import { StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';
import { getTranslation, Language } from '@/constants/i18n';
// Add this color utility at the top of the file
const adjustOpacity = (hexColor: string, opacity: number): string => {
    // Remove # if present
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
const LogoOptions = ({ colorScheme }: { colorScheme: 'light' | 'dark' | null }) => {
    const tintColor = Colors[colorScheme ?? 'light'].tint;
    return (
        <ThemedView style={styles.logoOptionsContainer}>
            <ThemedView style={styles.logoOption}>
                <ThemedView style={[styles.logoContainer, { backgroundColor: adjustOpacity(tintColor, 0.08) }]}>
                    <FontAwesome
                        name="shopping-basket"
                        size={45}
                        color={tintColor}
                    />
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
};


// Add this animation component before renderEmptyChat
const BouncingArrow = ({ color }: { color: string }) => {
    const bounceAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const bounce = Animated.sequence([
            Animated.timing(bounceAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            })
        ]);

        Animated.loop(bounce).start();
    }, []);

    const translateY = bounceAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 10]
    });

    return (
        <Animated.View style={{ transform: [{ translateY }] }}>
            <FontAwesome
                name="arrow-down"
                size={20}
                color={color}
                style={styles.arrowIcon}
            />
        </Animated.View>
    );
};


interface LaundryDashProps {
    colorScheme: 'light' | 'dark' | null;
    language?: Language;
}

export const LaundryDash = ({ colorScheme, language = 'en' }: LaundryDashProps) => {
    const t = getTranslation(language);

    return (
        <ThemedView style={styles.emptyChatContainer}>
            <LogoOptions colorScheme={colorScheme} />

            <ThemedText type="title" style={styles.emptyChatText}>
                {t.laundryDash.title}
            </ThemedText>

            <ThemedText style={styles.emptyChatSubtext}>
                {t.laundryDash.subtitle}
            </ThemedText>

            <ThemedView style={styles.featuresContainer}>
                {[
                    { icon: 'clock-o' as const, text: t.laundryDash.features.sameDay },
                    { icon: 'truck' as const, text: t.laundryDash.features.delivery },
                    { icon: 'star' as const, text: t.laundryDash.features.quality },
                ].map((feature, index) => (
                    <ThemedView
                        key={index}
                        style={[
                            styles.featureItem,
                            { backgroundColor: adjustOpacity(Colors[colorScheme ?? 'light'].tint, 0.1) }
                        ]}
                    >
                        <FontAwesome
                            name={feature.icon}
                            size={24}
                            color={Colors[colorScheme ?? 'light'].tint}
                        />
                        <ThemedText style={styles.featureText}>
                            {feature.text}
                        </ThemedText>
                    </ThemedView>
                ))}
            </ThemedView>

            <ThemedView style={styles.startContainer}>
                <ThemedText style={styles.startText}>
                    {t.laundryDash.startMessage}
                </ThemedText>
                <BouncingArrow color={Colors[colorScheme ?? 'light'].tint} />
            </ThemedView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messagesContainer: {
        flex: 1,
        padding: 16,
    },
    messageContainer: {
        maxWidth: '70%',
        padding: 12,
        borderRadius: 20,
        marginBottom: 8,
    },
    userMessage: {
        alignSelf: 'flex-end',
    },
    otherMessage: {
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 8,
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    textInput: {
        flex: 1,
        padding: 12,
        paddingHorizontal: 16,
        borderRadius: 25,
        marginRight: 8,
        maxHeight: 100,
        fontSize: 16,
    },
    sendButton: {
        padding: 8,
        marginLeft: 4,
    },
    inputAccessory: {
        backgroundColor: '#f8f8f8',
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    clearButton: {
        color: '#007AFF',
        padding: 8,
    },
    emptyChatContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logoOptionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 24,
        marginBottom: 32,
        paddingHorizontal: 16,
    },
    logoOption: {
        alignItems: 'center',
        gap: 8,
    },
    logoContainer: {
        position: 'relative',
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        padding: 16,
        marginBottom: 24,
    },
    emptyChatText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    emptyChatSubtext: {
        fontSize: 18,
        opacity: 0.7,
        marginBottom: 32,
        textAlign: 'center',
    },
    featuresContainer: {
        width: '100%',
        marginTop: 20,
        gap: 16,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(0, 132, 255, 0.1)',
        padding: 16,
        borderRadius: 12,
    },
    featureText: {
        fontSize: 16,
        fontWeight: '500',
    },
    startContainer: {
        marginTop: 40,
        alignItems: 'center',
    },
    startText: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 16,
    },
    arrowIcon: {
        opacity: 0.8,
    },
});