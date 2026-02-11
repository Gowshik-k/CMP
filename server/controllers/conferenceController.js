const Conference = require('../models/Conference');

exports.getAllConferences = async (req, res) => {
    try {
        const conferences = await Conference.find()
            .sort({ startDate: 1 })
            .populate('createdBy', 'username email');

        res.status(200).json({
            success: true,
            data: conferences
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching conferences',
            error: error.message
        });
    }
};

exports.createConference = async (req, res) => {
    try {
        const { title, description, startDate, endDate, submissionDeadline, location } = req.body;

        const conference = new Conference({
            title,
            description,
            startDate,
            endDate,
            submissionDeadline,
            location,
            createdBy: req.user._id
        });

        await conference.save();

        res.status(201).json({
            success: true,
            message: 'Conference created successfully',
            data: conference
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating conference',
            error: error.message
        });
    }
};

exports.updateConference = async (req, res) => {
    try {
        const updates = req.body;
        const conference = await Conference.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!conference) {
            return res.status(404).json({
                success: false,
                message: 'Conference not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Conference updated successfully',
            data: conference
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating conference',
            error: error.message
        });
    }
};

exports.deleteConference = async (req, res) => {
    try {
        const conference = await Conference.findByIdAndDelete(req.params.id);

        if (!conference) {
            return res.status(404).json({
                success: false,
                message: 'Conference not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Conference deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting conference',
            error: error.message
        });
    }
};
