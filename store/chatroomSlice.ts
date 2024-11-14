import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { introMessage } from './messages/intro';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'other';
    timestamp: number;
    type?: 'text' | 'gyroscope';
}

interface ChatroomState {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    inputText: string;
}

const initialState: ChatroomState = {
    messages: [{
        id: 'intro-1',
        text: introMessage,
        sender: 'other' as const,
        timestamp: Date.now(),
        type: 'text'
    },
    {
        id: 'gyroscope-1',
        text: 'Hello',
        sender: 'other' as const,
        timestamp: Date.now(),
        type: 'gyroscope'
    }
    ],
    isLoading: false,
    error: null,
    inputText: '',
};

const chatroomSlice = createSlice({
    name: 'chatroom',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<Message>) => {
            state.messages.push(action.payload);
        },
        setMessages: (state, action: PayloadAction<Message[]>) => {
            state.messages = action.payload;
        },
        clearMessages: (state) => {
            state.messages = [];
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setInputText: (state, action: PayloadAction<string>) => {
            state.inputText = action.payload;
        },
        clearInputText: (state) => {
            state.inputText = '';
        },
    },
});

export const {
    addMessage,
    setMessages,
    clearMessages,
    setLoading,
    setError,
    setInputText,
    clearInputText
} = chatroomSlice.actions;
export default chatroomSlice.reducer; 