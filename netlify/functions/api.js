const serverless = require('serverless-http');
const path = require('path');

// Set environment
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'sqms_super_secret_key_netlify_2024';
process.env.FRONTEND_URL = process.env.URL || 'https://sqms-smart-queue.netlify.app';

// Import the Express app
const { app, startServer } = require('../../backend/server');

let isInitialized = false;

const initializeApp = async () => {
    if (!isInitialized) {
        try {
            await startServer();
            isInitialized = true;
            console.log('✅ Netlify Function initialized successfully');
        } catch (err) {
            console.error('❌ Init error:', err.message);
            // Don't throw - let the app try to serve anyway
            isInitialized = true;
        }
    }
};

// Create serverless handler
const handler = serverless(app, {
    basePath: '/.netlify/functions/api',
});

exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        await initializeApp();
        return await handler(event, context);
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: 'Server error',
                error: error.message,
            }),
        };
    }
};
