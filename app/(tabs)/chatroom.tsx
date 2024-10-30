import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    InputAccessoryView,
    View,
    Pressable,
    Keyboard,
    EmitterSubscription
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome } from '@expo/vector-icons';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'other';
    timestamp: Date;
}

const inputAccessoryViewID = 'uniqueID';

// Add this function before renderEmptyChat
const LogoOptions = ({ colorScheme }: { colorScheme: 'light' | 'dark' | null }) => (
    <View style={styles.logoOptionsContainer}>
        <View style={styles.logoOption}>
            <View style={[styles.logoContainer, { backgroundColor: 'rgba(0, 132, 255, 0.08)' }]}>
                <FontAwesome
                    name="shopping-basket"
                    size={45}
                    color={Colors[colorScheme ?? 'light'].tint}
                />
            </View>
        </View>
    </View>
);

// Update renderEmptyChat to use LogoOptions
const renderEmptyChat = (colorScheme: 'light' | 'dark' | null) => (
    <View style={styles.emptyChatContainer}>
        <LogoOptions colorScheme={colorScheme} />

        <ThemedText type="title" style={styles.emptyChatText}>
            Laundry Dash
        </ThemedText>

        <ThemedText style={styles.emptyChatSubtext}>
            24/7 door-to-door laundry service
        </ThemedText>

        <View style={styles.featuresContainer}>
            {[
                { icon: 'clock-o', text: 'Same Day Service' },
                { icon: 'truck', text: 'Free Pickup & Delivery' },
                { icon: 'star', text: 'Premium Quality' },
            ].map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                    <FontAwesome
                        name={feature.icon}
                        size={24}
                        color={Colors[colorScheme ?? 'light'].tint}
                    />
                    <ThemedText style={styles.featureText}>
                        {feature.text}
                    </ThemedText>
                </View>
            ))}
        </View>

        <View style={styles.startContainer}>
            <ThemedText style={styles.startText}>
                Send a message to get started!
            </ThemedText>
            <FontAwesome
                name="arrow-down"
                size={20}
                color={Colors[colorScheme ?? 'light'].tint}
                style={styles.arrowIcon}
            />
        </View>
    </View>
);

export default function ChatRoom() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState('');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const insets = useSafeAreaInsets();
    const scrollViewRef = useRef<ScrollView>(null);
    const colorScheme = useColorScheme();

    useEffect(() => {
        const keyboardWillShow = Keyboard.addListener('keyboardWillShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardWillHide = Keyboard.addListener('keyboardWillHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardWillShow.remove();
            keyboardWillHide.remove();
        };
    }, []);

    const sendMessage = () => {
        if (text.trim()) {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: text.trim(),
                sender: 'user',
                timestamp: new Date()
            };
            setMessages([...messages, newMessage]);
            setText('');
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    };

    const renderMessage = (message: Message) => (
        <View
            key={message.id}
            style={[
                styles.messageContainer,
                message.sender === 'user' ? styles.userMessage : styles.otherMessage,
                {
                    backgroundColor: message.sender === 'user'
                        ? '#0084ff'
                        : colorScheme === 'dark' ? '#2C2C2E' : '#E5E5EA'
                }
            ]}
        >
            <ThemedText
                style={[
                    styles.messageText,
                    { color: message.sender === 'user' ? '#ffffff' : Colors[colorScheme ?? 'light'].text }
                ]}
            >
                {message.text}
            </ThemedText>
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={[
                styles.container,
                { backgroundColor: Colors[colorScheme ?? 'light'].background }
            ]}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={{
                    paddingBottom: 16,
                    paddingTop: insets.top || 16,
                    flexGrow: 1
                }}
                keyboardDismissMode="interactive"
            >
                {messages.length > 0
                    ? messages.map(renderMessage)
                    : renderEmptyChat(colorScheme)
                }
            </ScrollView>

            <View style={[
                styles.inputContainer,
                {
                    paddingBottom: isKeyboardVisible ? 8 : insets.bottom,
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                    borderTopColor: 'transparent'
                }
            ]}>
                <TextInput
                    style={[
                        styles.textInput,
                        {
                            backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#E5E5EA',
                            color: Colors[colorScheme ?? 'light'].text,
                        }
                    ]}
                    inputAccessoryViewID={inputAccessoryViewID}
                    onChangeText={setText}
                    value={text}
                    placeholder="Type a message..."
                    placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
                    multiline
                />
                <Pressable onPress={sendMessage} style={styles.sendButton}>
                    <Ionicons
                        name="send"
                        size={24}
                        color="#0084ff"
                    />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}

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
        marginBottom: 8,
    },
    arrowIcon: {
        opacity: 0.8,
    },
});