import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    View,
    Pressable,
    Keyboard,
    Animated,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addMessage, setInputText, clearInputText } from '../store/chatroomSlice';
import { NoData } from '@/components/NoData';
import { useTheme } from '@/ctx/ThemeContext';
import Markdown from 'react-native-markdown-display';
import { ThemedText } from '@/components/ThemedText';
import { Gyroscope } from 'expo-sensors';
import { throttle } from 'lodash';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'other';
    timestamp: number;
    type?: 'text' | 'gyroscope';
}

const inputAccessoryViewID = 'uniqueID';

// Update adjustOpacity to use any color
const adjustOpacity = (color: string, opacity: number): string => {
    // Remove # if present
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Add this component for gyroscope message
const GyroscopeMessage = () => {
    const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
    const [subscription, setSubscription] = useState(null);
    const { colors } = useTheme();

    // Add smoothing factor
    const alpha = 0.8; // Adjust between 0 and 1 (higher = smoother but more latency)
    const prevValues = useRef({ x: 0, y: 0, z: 0 });

    // Smooth the values using exponential moving average
    const smoothValue = (newValue: number, prevValue: number) => {
        return alpha * prevValue + (1 - alpha) * newValue;
    };

    // Throttle the update function
    const updateData = throttle((data) => {
        const smoothedData = {
            x: smoothValue(data.x, prevValues.current.x),
            y: smoothValue(data.y, prevValues.current.y),
            z: smoothValue(data.z, prevValues.current.z),
        };

        prevValues.current = smoothedData;
        setData(smoothedData);
    }, 16); // ~60fps

    useEffect(() => {
        const subscription = Gyroscope.addListener(data => {
            // Ignore tiny movements
            const threshold = 0.5;
            const filteredData = {
                x: Math.abs(data.x) < threshold ? 0 : data.x,
                y: Math.abs(data.y) < threshold ? 0 : data.y,
                z: Math.abs(data.z) < threshold ? 0 : data.z,
            };

            updateData(filteredData);
        });

        setSubscription(subscription);

        return () => {
            subscription.remove();
            updateData.cancel(); // Clean up throttle
        };
    }, []);

    // Smooth out the size changes
    const baseSize = 60;
    const maxSizeChange = 40;
    const movement = Math.abs(x + y + z);
    const indicatorSize = baseSize + Math.min(movement * 20, maxSizeChange);

    return (
        <View style={styles.gyroscopeContainer}>
            <Animated.View style={[
                styles.gyroscopeIndicator,
                {
                    width: indicatorSize,
                    height: indicatorSize,
                    backgroundColor: colors.tint,
                    transform: [
                        { rotateX: `${x * 90}deg` },
                        { rotateY: `${y * 90}deg` },
                        { rotateZ: `${z * 90}deg` },
                    ],
                }
            ]}>
                <Ionicons
                    name="compass-outline"
                    size={indicatorSize / 2}
                    color={colors.background}
                />
            </Animated.View>
            <ThemedText style={styles.gyroscopeText}>
                x: {x.toFixed(3)} y: {y.toFixed(3)} z: {z.toFixed(3)}
            </ThemedText>
        </View>
    );
};

export default function ChatRoom() {
    const messages = useAppSelector(state => state.chatroom.messages);
    const inputText = useAppSelector(state => state.chatroom.inputText);
    const dispatch = useAppDispatch();
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const insets = useSafeAreaInsets();
    const scrollViewRef = useRef<ScrollView>(null);
    const { colors, isDark } = useTheme();
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const keyboardWillShow = Keyboard.addListener('keyboardWillShow', (e) => {
            setKeyboardVisible(true);
            setKeyboardHeight(e.endCoordinates.height);
        });
        const keyboardWillHide = Keyboard.addListener('keyboardWillHide', () => {
            setKeyboardVisible(false);
            setKeyboardHeight(0);
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
        const bgColor = message.sender === 'user'
            ? colors.cardBackground
            : colors.cardBackground;

        // If it's a gyroscope message
        if (message.type === 'gyroscope') {
            return (
                <View
                    key={message.id}
                    style={[
                        styles.messageContainer,
                        styles.otherMessage,
                        { backgroundColor: bgColor }
                    ]}
                >
                    <GyroscopeMessage />
                </View>
            );
        }

        const textColor = colors.text;

        const markdownStyles = {
            body: {
                color: textColor,
                fontSize: 16,
                lineHeight: 22,
                fontWeight: '500',
            },
            link: {
                color: colors.tint,
            },
            code_inline: {
                backgroundColor: colors.inputBackground,
                padding: 4,
                borderRadius: 4,
            },
            code_block: {
                backgroundColor: colors.inputBackground,
                padding: 8,
                borderRadius: 8,
                marginVertical: 8,
            },
            bullet_list: {
                marginVertical: 8,
            },
            paragraph: {
                marginVertical: 0,
                color: textColor,
            },
            text: {
                color: textColor,
            },
            list_item: {
                color: textColor,
            },
            ordered_list: {
                color: textColor,
            },
        };

        return (
            <View
                key={message.id}
                style={[
                    styles.messageContainer,
                    message.sender === 'user' ? styles.userMessage : styles.otherMessage,
                    { backgroundColor: bgColor }
                ]}
            >
                <Markdown style={markdownStyles as any}>
                    {message.text}
                </Markdown>
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
                    addingTop: 16,
                    flexGrow: 1
                }}
                keyboardDismissMode="interactive"
            >
                {messages.length > 0
                    ? messages.map(renderMessage)
                    : <NoData
                        colorScheme={isDark ? 'dark' : 'light'}
                        icon="chatbubble-ellipses-outline"
                        title="No messages yet"
                        subtitle="Start a conversation by typing a message below"
                    />
                }
            </ScrollView>

            <KeyboardAvoidingView style={[
                styles.inputContainer,
                {
                    paddingBottom: isKeyboardVisible
                        ? keyboardHeight + 8
                        : Math.max(insets.bottom, 8),
                    backgroundColor: colors.background,
                    borderTopColor: 'transparent'
                }
            ]}>
                <TextInput
                    style={[
                        styles.textInput,
                        {
                            backgroundColor: adjustOpacity(colors.tint, 0.1),
                            color: colors.text,
                        }
                    ]}
                    inputAccessoryViewID={inputAccessoryViewID}
                    onChangeText={(text) => dispatch(setInputText(text))}
                    value={inputText}
                    placeholder="Type a message..."
                    placeholderTextColor={colors.tabIconDefault}
                    multiline
                />
                <Pressable onPress={sendMessage} style={styles.sendButton}>
                    <Ionicons
                        name="send"
                        size={24}
                        color={colors.tint}
                    />
                </Pressable>
            </KeyboardAvoidingView>
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
        maxWidth: '85%',
        padding: 12,
        borderRadius: 13,
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
    gyroscopeContainer: {
        alignItems: 'center',
        padding: 8,
    },
    gyroscopeIndicator: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        opacity: 0.8,
        marginBottom: 8,
    },
    gyroscopeText: {
        fontSize: 12,
        opacity: 0.7,
    }
});