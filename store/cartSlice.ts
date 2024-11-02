import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    serviceType: 'basic' | 'premium' | 'express';
    type: string;
}

interface CartState {
    items: CartItem[];
    total: number;
}

const initialState: CartState = {
    items: [
        { id: '1', name: 'Instant', price: 300, quantity: 1, serviceType: 'basic', type: 'pants' },
        { id: '2', name: 'Pet Wash', price: 200, quantity: 0, serviceType: 'premium', type: 'animal' },
    ],
    total: 300,
};

interface UpdateQuantityPayload {
    id: string;
    serviceType: string;
    quantity: number;
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(item =>
                item.id === action.payload.id &&
                item.serviceType === action.payload.serviceType
            );

            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }

            state.total = state.items.reduce(
                (sum, item) => sum + (item.price * item.quantity),
                0
            );
        },
        removeFromCart: (state, action: PayloadAction<{ id: string, serviceType: string }>) => {
            state.items = state.items.filter(
                item => !(item.id === action.payload.id && item.serviceType === action.payload.serviceType)
            );
            state.total = state.items.reduce(
                (sum, item) => sum + (item.price * item.quantity),
                0
            );
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
        },
        updateQuantity: (state, action: PayloadAction<UpdateQuantityPayload>) => {
            const { id, serviceType, quantity } = action.payload;
            const item = state.items.find(
                item => item.id === id && item.serviceType === serviceType
            );

            if (item) {
                item.quantity = quantity;
                state.total = state.items.reduce(
                    (sum, item) => sum + (item.price * item.quantity),
                    0
                );
            }
        },
    },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer; 