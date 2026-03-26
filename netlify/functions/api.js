const serverless = require('serverless-http');
const path = require('path');

// Set up environment for the backend
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Import the Express app and startup function
const { app, startServer } = require(path.join(__dirname, '..', '..', 'backend', 'server'));

let isInitialized = false;

const initializeApp = async () => {
    if (!isInitialized) {
        await startServer().catch(err => {
            console.error('Init error:', err);
        });
        isInitialized = true;
        console.log('✅ Netlify Function initialized');
    }
};

// Create serverless handler - strip the /.netlify/functions/api prefix
const handler = serverless(app, {
    basePath: '/.netlify/functions/api',
});

// Export the handler with initialization
exports.handler = async (event, context) => {
    // Prevent Lambda from waiting for event loop to empty
    context.callbackWaitsForEmptyEventLoop = false;

    // Initialize on first call (cold start)
    await initializeApp();

    // Handle the request
    return handler(event, context);
};
