import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

// Initialize Lemon Squeezy with API key
lemonSqueezySetup({
    apiKey: process.env.LEMONSQUEEZY_API_KEY!,
    onError: (error) => console.error('Lemon Squeezy Error:', error),
});

export { lemonSqueezySetup };

// Re-export commonly used functions
export {
    getProduct,
    getVariant,
    createCheckout,
    getSubscription,
    updateSubscription,
    cancelSubscription,
    getCustomer,
    listOrders,
    listSubscriptions,
} from '@lemonsqueezy/lemonsqueezy.js';
