import { Middleware } from '@reduxjs/toolkit';
import { addMessage, clearMessages, clearInputText } from './chatroomSlice';
import type { RootState } from './store';

// Mock responses for different user inputs
const mockResponses: { [key: string]: string } = {
    'hello': 'Hi there! How can I help you with your laundry today?',
    'hi': 'Hello! Welcome to Laundry Dash. What service can I help you with?',
    'price': 'Our basic wash & fold service starts at $2.50/lb. Would you like to see our full price list?',
    'pickup': 'We offer free pickup and delivery! When would you like us to pick up your laundry?',
    'delivery': 'We deliver 7 days a week between 8 AM and 8 PM. Delivery is always free!',
    'time': 'We typically complete orders within 24 hours. Would you like to schedule a pickup?',
};

// Introduction message that will be sent automatically
const introductionMessage = {
    id: 'intro-1',
    text: "👋 Welcome to Laundry Dash Support! I'm your virtual assistant. I can help you with:\n\n" +
        "• Pricing information\n" +
        "• Pickup scheduling\n" +
        "• Delivery status\n" +
        "• Service questions\n\n" +
        "How can I assist you today?",
    sender: 'other',
    timestamp: Date.now()
};

// Helper function to get a response with some delay
const getDelayedResponse = (text: string): Promise<string> => {
    // Default response if no matching keywords found
    let response = "Thanks for your message! How can I assist you with your laundry needs today?";

    // Check for keywords in the input text
    const lowercaseText = text.toLowerCase();
    for (const [keyword, mockResponse] of Object.entries(mockResponses)) {
        if (lowercaseText.includes(keyword)) {
            response = mockResponse;
            break;
        }
    }

    // Simulate network delay (1-2 seconds)
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(response);
        }, 1000 + Math.random() * 1000);
    });
};

let hasShownIntroduction = false;

export const chatMiddleware: Middleware<{}, RootState> = (store) => (next) => async (action) => {
    // First, let the action go through
    const result = next(action);

    // Show introduction message when chat is cleared or first loaded
    if (action.type === '@@INIT') {
        hasShownIntroduction = true;
        setTimeout(() => {
            store.dispatch(addMessage(introductionMessage));
        }, 500); // Small delay for better UX
    }

    // If it's an addMessage action with a user message
    if (action.type === addMessage.type && action.payload.sender === 'user') {
        const messageText = action.payload.text;

        // Check for /clean command
        if (messageText.trim() === '/clean') {
            store.dispatch(clearMessages());
            store.dispatch(clearInputText());
            return result;
        }

        // Get the response for normal messages
        const response = await getDelayedResponse(messageText);

        // Dispatch the bot's response
        store.dispatch(addMessage({
            id: Date.now().toString(),
            text: response,
            sender: 'other',
            timestamp: Date.now()
        }));
    }

    return result;
}; 