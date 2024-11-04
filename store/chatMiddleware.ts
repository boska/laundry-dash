import { Middleware, PayloadAction, AnyAction } from '@reduxjs/toolkit';
import { addMessage, clearMessages, clearInputText } from './chatroomSlice';
import type { RootState } from './store';

// Define Message type
interface Message {
    id: string;
    text: string;
    sender: 'user' | 'other';
    timestamp: number;
}

// Mock responses with Markdown formatting
const mockResponses: { [key: string]: string } = {
    'hello': '**Hi there!** 👋 How can I help you with your laundry today?',
    'hi': '**Hello!** Welcome to *Laundry Dash*. What service can I help you with?',
    'price': '**Our pricing:** 💰\n\n' +
        '- Basic wash & fold: **$2.50/lb**\n' +
        '- Dry cleaning: **from $5/item**\n' +
        '- Express service: **+$10**\n\n' +
        'Would you like to schedule a pickup?',
    'pickup': '**Free pickup and delivery!** 🚚\n\n' +
        'Available time slots:\n' +
        '1. Morning (**8AM - 12PM**)\n' +
        '2. Afternoon (**12PM - 4PM**)\n' +
        '3. Evening (**4PM - 8PM**)\n\n' +
        'When would you like us to pick up your laundry?',
    'delivery': '**Delivery Information** 📦\n\n' +
        '- Available **7 days** a week\n' +
        '- Service hours: **8 AM - 8 PM**\n' +
        '- Always **FREE** delivery\n' +
        '- Real-time tracking available',
    'time': '**Service Times:** ⏱\n\n' +
        '- Standard Service: **24 hours**\n' +
        '- Express Service: **Same day**\n' +
        '- Rush Service: **4 hours**\n\n' +
        'Would you like to schedule a pickup?',
};

// Enhanced introduction message with Markdown
const initialMessage = {
    id: 'intro-1',
    text: "# Hi, I'm Yang Lee! 👋\n\n" +
        "I'm here to help you with your laundry needs. Here's what I can assist you with:\n\n" +
        "- **Pricing Information** 💰\n" +
        "- **Pickup Scheduling** 🚚\n" +
        "- **Delivery Status** 📦\n" +
        "- **Service Questions** ❓\n\n" +
        "*Type a message to get started!*",
    sender: 'other' as const,
    timestamp: Date.now()
};

// Default response with bold/italic instead of code
const defaultResponse = "**Thanks for your message!** Here are some things I can help you with:\n\n" +
    "- Type *price* for pricing information\n" +
    "- Type *pickup* to schedule a pickup\n" +
    "- Type *delivery* for delivery info\n" +
    "- Type *time* for service times\n\n" +
    "*How can I assist you today?*";

// Helper function to get a response with some delay
const getDelayedResponse = (text: string): Promise<string> => {
    let response = defaultResponse;

    const lowercaseText = text.toLowerCase();
    for (const [keyword, mockResponse] of Object.entries(mockResponses)) {
        if (lowercaseText.includes(keyword)) {
            response = mockResponse;
            break;
        }
    }

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(response);
        }, 1000 + Math.random() * 1000);
    });
};

let hasShownIntroduction = false;

export const chatMiddleware: Middleware =
    (store) => (next) => async (action: AnyAction) => {
        const result = next(action);

        if (addMessage.match(action)) {
            const messageAction = action as PayloadAction<Message>;
            if (messageAction.payload.sender === 'user') {
                const messageText = messageAction.payload.text;

                if (messageText.trim() === '/clean') {
                    store.dispatch(clearMessages());
                    store.dispatch(clearInputText());
                    return result;
                }

                const response = await getDelayedResponse(messageText);

                store.dispatch(addMessage({
                    id: Date.now().toString(),
                    text: response,
                    sender: 'other' as const,
                    timestamp: Date.now()
                }));
            }
        }

        return result;
    }; 