const User = require('../models/User');

// Create new user
exports.createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const newUser = new User({
            username,
            email,
            password, // Password hashing is handled by User model pre-save hook
            role
        });

        await newUser.save();

        const userResponse = await User.findById(newUser._id).select('-password');
        res.status(201).json(userResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user role
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['Attendee', 'Author', 'Reviewer', 'Chair', 'Admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get stats
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const roleDistribution = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        res.json({
            totalUsers,
            roleDistribution
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
