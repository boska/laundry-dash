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
    messages: [],
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
    setLoading,
    setError,
    setInputText,
    clearInputText
} = chatroomSlice.actions;
export default chatroomSlice.reducer; 