// User Roles
export const ROLES = {
    ATTENDEE: 'Attendee',
    AUTHOR: 'Author',
    REVIEWER: 'Reviewer',
    CHAIR: 'Chair',
    ADMIN: 'Admin'
};

export const ROLE_LIST = Object.values(ROLES);

// Verification Code Length
export const VERIFICATION_CODE_LENGTH = 6;

// Form Validation
export const VALIDATION = {
    USERNAME_MIN_LENGTH: 3,
    PASSWORD_MIN_LENGTH: 6,
    PHONE_PATTERN: /^\+?[1-9]\d{1,14}$/
};

// UI Messages
export const MESSAGES = {
    LOGIN_SUCCESS: 'Login successful',
    REGISTRATION_SUCCESS: 'Registration successful. Codes sent to email and mobile.',
    VERIFICATION_SUCCESS: 'Account verified successfully',
    GENERIC_ERROR: 'An error occurred. Please try again.'
};
