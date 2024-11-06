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
interface Message {
    id: string;
    text: string;
    sender: 'user' | 'other';
    timestamp: Date;
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
    }
});