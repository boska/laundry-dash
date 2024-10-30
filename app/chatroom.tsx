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
    EmitterSubscription,
    Animated
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addMessage, setMessages, setInputText, clearInputText } from '../store/chatroomSlice';
import { NoData } from '@/components/NoData';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'other';
    timestamp: Date;
}

const inputAccessoryViewID = 'uniqueID';

// Add this color utility at the top of the file
const adjustOpacity = (hexColor: string, opacity: number): string => {
    // Remove # if present
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Add this function before renderEmptyChat
const LogoOptions = ({ colorScheme }: { colorScheme: 'light' | 'dark' | null }) => {
    const tintColor = Colors[colorScheme ?? 'light'].tint;
    return (
        <View style={styles.logoOptionsContainer}>
            <View style={styles.logoOption}>
                <View style={[styles.logoContainer, { backgroundColor: adjustOpacity(tintColor, 0.08) }]}>
                    <FontAwesome
                        name="shopping-basket"
                        size={45}
                        color={tintColor}
                    />
                </View>
            </View>
        </View>
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

export default function ChatRoom() {
    const messages = useAppSelector(state => state.chatroom.messages);
    const isLoading = useAppSelector(state => state.chatroom.isLoading);
    const inputText = useAppSelector(state => state.chatroom.inputText);
    const dispatch = useAppDispatch();
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
        if (!inputText.trim()) return;

        const newMessage = {
            id: Date.now().toString(),
            text: inputText.trim(),
            sender: 'user' as const,
            timestamp: Date.now(),
        };

        dispatch(addMessage(newMessage));
        dispatch(clearInputText());

        // Optional: Scroll to bottom after sending
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    const renderMessage = (message: Message) => {
        const tintColor = Colors[colorScheme ?? 'light'].tint;
        const bgColor = message.sender === 'user'
            ? tintColor
            : colorScheme === 'dark'
                ? '#2C2C2E'
                : adjustOpacity(tintColor, 0.1);

        return (
            <View
                key={message.id}
                style={[
                    styles.messageContainer,
                    message.sender === 'user' ? styles.userMessage : styles.otherMessage,
                    { backgroundColor: bgColor }
                ]}
            >
                <ThemedText
                    style={[
                        styles.messageText,
                        {
                            color: message.sender === 'user'
                                ? '#ffffff'
                                : Colors[colorScheme ?? 'light'].text
                        }
                    ]}
                >
                    {message.text}
                </ThemedText>
            </View>
        );
    };

    return (
        <ThemedView style={styles.container}>
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
                    : <NoData
                        colorScheme={colorScheme as 'light' | 'dark' | null}
                        icon="chatbubble-ellipses-outline"
                        title="No messages yet"
                        subtitle="Start a conversation by typing a message below"
                    />
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
                            backgroundColor: colorScheme === 'dark'
                                ? '#2C2C2E'
                                : adjustOpacity(Colors[colorScheme ?? 'light'].tint, 0.1),
                            color: Colors[colorScheme ?? 'light'].text,
                        }
                    ]}
                    inputAccessoryViewID={inputAccessoryViewID}
                    onChangeText={(text) => dispatch(setInputText(text))}
                    value={inputText}
                    placeholder="Type a message..."
                    placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
                    multiline
                />
                <Pressable onPress={sendMessage} style={styles.sendButton}>
                    <Ionicons
                        name="send"
                        size={24}
                        color={Colors[colorScheme ?? 'light'].tint}
                    />
                </Pressable>
            </View>
        </ThemedView>
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
        marginBottom: 16,
    },
    arrowIcon: {
        opacity: 0.8,
    },
});