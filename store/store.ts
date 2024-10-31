import { configureStore } from '@reduxjs/toolkit';
import chatroomReducer from './chatroomSlice';
import languageReducer from './languageSlice';
import { chatMiddleware } from './chatMiddleware';

export const store = configureStore({
    reducer: {
        chatroom: chatroomReducer,
        language: languageReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(chatMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;