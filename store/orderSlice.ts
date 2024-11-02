import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type OrderStatus =
    | 'pick-up'
    | 'on-the-way-to-laundry'
    | 'laundrying'
    | 'drying'
    | 'on-the-way-to-user'
    | 'completed';

export interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    status: OrderStatus;
    items: OrderItem[];
    total: number;
    estimatedDelivery: string;
}

interface OrderState {
    currentOrder: Order | null;
}

const initialState: OrderState = {
    currentOrder: null
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        createOrder: (state, action: PayloadAction<Order>) => {
            state.currentOrder = action.payload;
        },
        updateOrderStatus: (state, action: PayloadAction<OrderStatus>) => {
            if (state.currentOrder) {
                state.currentOrder.status = action.payload;
            }
        },
        clearOrder: (state) => {
            state.currentOrder = null;
        }
    }
});

export const { createOrder, updateOrderStatus, clearOrder } = orderSlice.actions;
export default orderSlice.reducer; 