module.exports = function (roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).send('Unauthorized');
        }

        // We'll need to fetch the full user from DB or ensure the token contains the role
        // For now, since the login token only has _id, we need to handle this.
        // Let's assume the authMiddleware will be updated to fetch user or token will be updated.

        // However, if we follow the current authRoutes.js:
        // const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        // The token only has _id.

        // I will update authMiddleware to fetch the user and attach it to req.user.
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).send('Forbidden: Access Denied');
        }

        next();
    };
};
