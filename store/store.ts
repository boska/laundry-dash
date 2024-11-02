import { configureStore } from '@reduxjs/toolkit';
import chatroomReducer from './chatroomSlice';
import languageReducer from './languageSlice';
import { chatMiddleware } from './chatMiddleware';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';
import { mockOrderMiddleware } from './mockOrderMiddleware';

export const store = configureStore({
    reducer: {
        chatroom: chatroomReducer,
        language: languageReducer,
        cart: cartReducer,
        order: orderReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([
            chatMiddleware,
            mockOrderMiddleware
        ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;