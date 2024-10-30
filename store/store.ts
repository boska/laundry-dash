import { configureStore } from '@reduxjs/toolkit';
import chatroomReducer from './chatroomSlice';
import { chatMiddleware } from './chatMiddleware';

export const store = configureStore({
    reducer: {
        chatroom: chatroomReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(chatMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 