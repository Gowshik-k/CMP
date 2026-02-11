const Registration = require('../models/Registration');
const Submission = require('../models/Submission');
const Conference = require('../models/Conference');

// Register for a conference
exports.registerForConference = async (req, res) => {
    try {
        const { conferenceId } = req.body;
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
            conference: conferenceId
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

        const registrations = await Registration.find({ user: userId })
            .populate('conference', 'title startDate endDate location status');

        const submissions = await Submission.find({ author: userId })
            .populate('conference', 'title');

        res.status(200).json({
            success: true,
            data: {
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
        const registeredConfIds = userRegistrations.map(r => r.conference.toString());

        const conferencesWithStatus = conferences.map(conf => {
            const confObj = conf.toObject();
            confObj.isRegistered = registeredConfIds.includes(conf._id.toString());
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
