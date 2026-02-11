const responses = require('../utils/responses');

/**
 * Global error handling middleware
 * Should be added at the end of all routes
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return responses.badRequest(res, 'Validation failed', errors);
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return responses.badRequest(res, `${field} already exists`);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return responses.unauthorized(res, 'Invalid token');
    }

    if (err.name === 'TokenExpiredError') {
        return responses.unauthorized(res, 'Token expired');
    }

    // MongoDB connection errors
    if (err.name === 'MongooseServerSelectionError' || err.name === 'MongoNetworkError') {
        return responses.serviceUnavailable(res, 'Database connection error');
    }

    // Default to 500 server error
    return responses.serverError(res, err.message || 'Internal server error');
};

module.exports = errorHandler;
