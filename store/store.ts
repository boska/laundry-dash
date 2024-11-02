import { configureStore } from '@reduxjs/toolkit';
import chatroomReducer from './chatroomSlice';
import languageReducer from './languageSlice';
import { chatMiddleware } from './chatMiddleware';
import cartReducer from './cartSlice';

export const store = configureStore({
    reducer: {
        chatroom: chatroomReducer,
        language: languageReducer,
        cart: cartReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(chatMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;