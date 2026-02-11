const User = require('../models/User');
const responses = require('../utils/responses');
const { ROLE_LIST, isValidRole } = require('../constants/roles');

// Create new user
exports.createUser = async (req, res, next) => {
    try {
        const { username, email, password, phoneNumber, role } = req.body;

        // Validate required fields
        if (!username || !email || !password || !phoneNumber) {
            return responses.badRequest(res, 'All fields are required');
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return responses.badRequest(res, 'User with this email already exists');
        }

        const newUser = new User({
            username,
            email,
            password, // Password hashing is handled by User model pre-save hook
            phoneNumber,
            role: role || 'Attendee'
        });

        await newUser.save();

        const userResponse = await User.findById(newUser._id).select('-password');
        return responses.created(res, userResponse, 'User created successfully');
    } catch (error) {
        next(error);
    }
};

// Get all users
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');
        return responses.success(res, users);
    } catch (error) {
        next(error);
    }
};

// Update user role
exports.updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;

        if (!role) {
            return responses.badRequest(res, 'Role is required');
        }

        if (!isValidRole(role)) {
            return responses.badRequest(res, `Invalid role. Must be one of: ${ROLE_LIST.join(', ')}`);
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return responses.notFound(res, 'User not found');
        }

        return responses.success(res, user, 'User role updated successfully');
    } catch (error) {
        next(error);
    }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return responses.notFound(res, 'User not found');
        }

        return responses.success(res, null, 'User deleted successfully');
    } catch (error) {
        next(error);
    }
};

// Get stats
exports.getStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const roleDistribution = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        return responses.success(res, {
            totalUsers,
            roleDistribution
        });
    } catch (error) {
        next(error);
    }
};
