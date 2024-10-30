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

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'other';
    timestamp: Date;
}

const inputAccessoryViewID = 'uniqueID';

export default function ChatRoom() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState('');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const insets = useSafeAreaInsets();
    const scrollViewRef = useRef<ScrollView>(null);

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
                message.sender === 'user' ? styles.userMessage : styles.otherMessage
            ]}
        >
            <ThemedText
                style={[
                    styles.messageText,
                    message.sender === 'user' && styles.userMessageText
                ]}
            >
                {message.text}
            </ThemedText>
            {/* <ThemedText
                style={[
                    styles.timestamp,
                    message.sender === 'user' && styles.userTimestamp
                ]}
            >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </ThemedText> */}
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={{
                    paddingBottom: 16,
                    paddingTop: insets.top || 16
                }}
                keyboardDismissMode="interactive"
            >
                {messages.map(renderMessage)}
            </ScrollView>

            <View style={[
                styles.inputContainer,
                { paddingBottom: isKeyboardVisible ? 8 : insets.bottom }
            ]}>
                <TextInput
                    style={styles.textInput}
                    inputAccessoryViewID={inputAccessoryViewID}
                    onChangeText={setText}
                    value={text}
                    placeholder="Type a message..."
                    multiline
                />
                <Pressable onPress={sendMessage} style={styles.sendButton}>
                    <Ionicons name="send" size={24} color="#007AFF" />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    messagesContainer: {
        flex: 1,
        padding: 16,
    },
    messageContainer: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 8,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#007AFF',
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#E5E5EA',
    },
    userMessageText: {
        color: '#ffffff',
    },
    userTimestamp: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    messageText: {
        fontSize: 16,
        color: '#000000',
    },
    timestamp: {
        fontSize: 12,
        opacity: 0.7,
        marginTop: 4,
        alignSelf: 'flex-end',
        color: '#000000',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 8,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        padding: 12,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginRight: 8,
        maxHeight: 100,
    },
    sendButton: {
        padding: 8,
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
});