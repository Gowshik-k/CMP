const Registration = require('../models/Registration');
const Submission = require('../models/Submission');
const Conference = require('../models/Conference');
const User = require('../models/User');

// Register for a conference
exports.registerForConference = async (req, res) => {
    try {
        const { conferenceId, intendToSubmit } = req.body;
        const userId = req.user._id;

        // Check if conference exists
        const conference = await Conference.findById(conferenceId);
        if (!conference) {
            return res.status(404).json({ success: false, message: 'Conference not found' });
        }

        // Check if already registered
        const existingRegistration = await Registration.findOne({ user: userId, conference: conferenceId });
        if (existingRegistration) {
            return res.status(400).json({ success: false, message: 'Already registered for this conference' });
        }

        const registration = new Registration({
            user: userId,
            conference: conferenceId,
            intendToSubmit: intendToSubmit || false
        });

        await registration.save();

        res.status(201).json({
            success: true,
            message: 'Registered successfully',
            data: registration
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error registering for conference',
            error: error.message
        });
    }
};

// Submit a paper
exports.submitPaper = async (req, res) => {
    try {
        const { conferenceId, title, abstract, filePath } = req.body;
        const userId = req.user._id;

        // Check if conference exists
        const conference = await Conference.findById(conferenceId);
        if (!conference) {
            return res.status(404).json({ success: false, message: 'Conference not found' });
        }

        const submission = new Submission({
            title,
            abstract,
            author: userId,
            conference: conferenceId,
            filePath
        });

        await submission.save();

        // Check and update user role if it's their first submission
        const user = await User.findById(userId);
        if (user && user.role === 'Attendee') {
            user.role = 'Author';
            await user.save();
        }

        res.status(201).json({
            success: true,
            message: 'Paper submitted successfully',
            data: submission
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error submitting paper',
            error: error.message
        });
    }
};

// Get user's registrations and submissions
exports.getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select('-password');

        const registrations = await Registration.find({ user: userId })
            .populate('conference', 'title startDate endDate location status');

        const submissions = await Submission.find({ author: userId })
            .populate('conference', 'title');

        res.status(200).json({
            success: true,
            data: {
                user,
                registrations,
                submissions
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: error.message
        });
    }
};

// Get all conferences (for user browsing)
exports.getAllConferences = async (req, res) => {
    try {
        const userId = req.user._id;
        const conferences = await Conference.find({ status: { $ne: 'cancelled' } })
            .sort({ startDate: 1 });

        // Add registration status to each conference
        const userRegistrations = await Registration.find({ user: userId });

        // Create a map for easier lookup: conferenceId -> registrationObj
        const registrationMap = {};
        userRegistrations.forEach(reg => {
            registrationMap[reg.conference.toString()] = reg;
        });

        const conferencesWithStatus = conferences.map(conf => {
            const confObj = conf.toObject();
            const registration = registrationMap[conf._id.toString()];

            confObj.isRegistered = !!registration;
            if (registration) {
                confObj.intendToSubmit = registration.intendToSubmit;
            }
            return confObj;
        });

        res.status(200).json({
            success: true,
            data: conferencesWithStatus
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching conferences',
            error: error.message
        });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { affiliation, bio, socialLinks, phoneNumber } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    affiliation,
                    bio,
                    socialLinks,
                    phoneNumber
                }
            },
            { new: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};
