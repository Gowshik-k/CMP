const User = require('../models/User');
const Conference = require('../models/Conference');
const Submission = require('../models/Submission');
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
            role: role || 'Attendee',
            isEmailVerified: true,
            isPhoneVerified: true
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
            {
                role,
                isEmailVerified: true,
                isPhoneVerified: true
            },
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
        const totalConferences = await Conference.countDocuments();
        const totalSubmissions = await Submission.countDocuments();
        const recentConferences = await Conference.find()
            .sort({ createdAt: -1 })
            .limit(3);
        const roleDistribution = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        return responses.success(res, {
            totalUsers,
            totalConferences,
            totalSubmissions,
            recentConferences,
            roleDistribution
        });
    } catch (error) {
        next(error);
    }
};

// Get all submissions
exports.getAllSubmissions = async (req, res, next) => {
    try {
        const submissions = await Submission.find()
            .populate('author', 'username email')
            .populate('conference', 'title')
            .sort({ submittedAt: -1 });
        return responses.success(res, submissions);
    } catch (error) {
        next(error);
    }
};

// Update submission status
exports.updateSubmissionStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Under Review', 'Accepted', 'Rejected'];

        if (!status || !validStatuses.includes(status)) {
            return responses.badRequest(res, 'Invalid status. Must be one of: ' + validStatuses.join(', '));
        }

        const submission = await Submission.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('author', 'username email').populate('conference', 'title');

        if (!submission) {
            return responses.notFound(res, 'Submission not found');
        }

        return responses.success(res, submission, 'Submission status updated successfully');
    } catch (error) {
        next(error);
    }
};
