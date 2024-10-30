import { configureStore } from '@reduxjs/toolkit';
import chatroomReducer from './chatroomSlice';

export const store = configureStore({
    reducer: {
        chatroom: chatroomReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 