// User Roles
const ROLES = {
    ATTENDEE: 'Attendee',
    AUTHOR: 'Author',
    REVIEWER: 'Reviewer',
    CHAIR: 'Chair',
    ADMIN: 'Admin'
};

const ROLE_LIST = [
    ROLES.ATTENDEE,
    ROLES.AUTHOR,
    ROLES.REVIEWER,
    ROLES.CHAIR,
    ROLES.ADMIN
];

// Validation helper
const isValidRole = (role) => ROLE_LIST.includes(role);

module.exports = {
    ROLES,
    ROLE_LIST,
    isValidRole
};
