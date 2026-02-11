/**
 * Standardized API response helpers
 */

const success = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

const error = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
    const response = {
        success: false,
        message
    };

    if (errors) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);
};

const created = (res, data, message = 'Resource created successfully') => {
    return success(res, data, message, 201);
};

const badRequest = (res, message = 'Bad request', errors = null) => {
    return error(res, message, 400, errors);
};

const unauthorized = (res, message = 'Unauthorized') => {
    return error(res, message, 401);
};

const forbidden = (res, message = 'Forbidden') => {
    return error(res, message, 403);
};

const notFound = (res, message = 'Resource not found') => {
    return error(res, message, 404);
};

const serverError = (res, message = 'Internal server error') => {
    return error(res, message, 500);
};

const serviceUnavailable = (res, message = 'Service unavailable') => {
    return error(res, message, 503);
};

module.exports = {
    success,
    error,
    created,
    badRequest,
    unauthorized,
    forbidden,
    notFound,
    serverError,
    serviceUnavailable
};
