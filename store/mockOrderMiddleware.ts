import { Middleware } from '@reduxjs/toolkit';
import { createOrder, updateOrderStatus, OrderStatus } from './orderSlice';

const ORDER_STATUS_SEQUENCE: OrderStatus[] = [
    'pick-up',
    'on-the-way-to-laundry',
    'laundrying',
    'drying',
    'on-the-way-to-user',
    'completed'
];

// Random delay between 3-8 seconds
const getRandomDelay = () => Math.floor(Math.random() * 5000) + 3000;

export const mockOrderMiddleware: Middleware = (store) => (next) => (action) => {
    const result = next(action);

    if (createOrder.match(action)) {
        let currentStatusIndex = 0;

        const updateStatus = () => {
            currentStatusIndex++;
            if (currentStatusIndex < ORDER_STATUS_SEQUENCE.length) {
                const nextStatus = ORDER_STATUS_SEQUENCE[currentStatusIndex];
                setTimeout(() => {
                    store.dispatch(updateOrderStatus(nextStatus));
                    updateStatus();
                }, getRandomDelay());
            }
        };

        // Start the status update chain
        updateStatus();
    }

    return result;
}; 