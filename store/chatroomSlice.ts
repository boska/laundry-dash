import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'other';
    timestamp: number;
}

interface ChatroomState {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    inputText: string;
}

const initialState: ChatroomState = {
    messages: [
        {
            id: 'intro-1',
            text: "Hi, I'm Yang Lee! 👋\n\n" +
                "I'm here to help you with:\n" +
                "• iOS & Android & Web\n" +
                "• Elegant UX\n" +
                "• RWD\n" +
                "• Realtime\n\n" +
                "How can I assist you today?",
            sender: 'other',
            timestamp: Date.now()
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