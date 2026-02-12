const Conference = require('../models/Conference');
const Submission = require('../models/Submission');
const Review = require('../models/Review');
const User = require('../models/User');
const responses = require('../utils/responses');

// Get conferences managed by the current chair with real stats
exports.getManagedConferences = async (req, res, next) => {
    try {
        // Chairs can access ALL conferences (not just their own)
        const conferences = await Conference.find({})
            .sort({ startDate: 1 });

        // Enhance each conference with real counts
        const enhancedConferences = await Promise.all(conferences.map(async (conf) => {
            const submissionCount = await Submission.countDocuments({ conference: conf._id });
            const pendingReviewCount = await Review.countDocuments({
                conference: conf._id,
                status: 'Pending'
            });

            const confObj = conf.toObject();
            confObj.stats = {
                submissions: submissionCount,
                allReviews: await Review.countDocuments({ conference: conf._id }),
                pendingReviews: pendingReviewCount
            };
            return confObj;
        }));

        return responses.success(res, enhancedConferences);
    } catch (error) {
        next(error);
    }
};

// Get available reviewers (Users with 'Reviewer' role)
exports.getAvailableReviewers = async (req, res, next) => {
    try {
        const reviewers = await User.find({ role: 'Reviewer' }).select('username email');
        return responses.success(res, reviewers);
    } catch (error) {
        next(error);
    }
};

// Assign a reviewer to a submission
exports.assignReviewer = async (req, res, next) => {
    try {
        const { submissionId, reviewerId } = req.body;

        if (!submissionId || !reviewerId) {
            return responses.badRequest(res, 'Submission ID and Reviewer ID are required');
        }

        const submission = await Submission.findById(submissionId).populate('conference');
        if (!submission) return responses.notFound(res, 'Submission not found');

        // Chairs can assign reviewers to ANY conference

        // Check if already assigned
        const existingReview = await Review.findOne({ submission: submissionId, reviewer: reviewerId });
        if (existingReview) {
            return responses.badRequest(res, 'Reviewer is already assigned to this submission');
        }

        const review = new Review({
            submission: submissionId,
            reviewer: reviewerId,
            conference: submission.conference._id
        });

        await review.save();
        return responses.created(res, review, 'Reviewer assigned successfully');
    } catch (error) {
        next(error);
    }
};

// Get submissions for a specific conference managed by the chair
exports.getConferenceSubmissions = async (req, res, next) => {
    try {
        const { conferenceId } = req.params;

        // Chairs can access submissions for ANY conference
        const conference = await Conference.findById(conferenceId);

        if (!conference) {
            return responses.notFound(res, 'Conference not found');
        }

        const submissions = await Submission.find({ conference: conferenceId })
            .populate('author', 'username email')
            .sort({ submittedAt: -1 });

        return responses.success(res, submissions);
    } catch (error) {
        next(error);
    }
};

// Update submission status (Restricted to chair's conferences)
exports.updateSubmissionStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ['Under Review', 'Accepted', 'Rejected'];

        if (!status || !validStatuses.includes(status)) {
            return responses.badRequest(res, 'Invalid status');
        }

        // Find submission and populate conference
        const submission = await Submission.findById(id).populate('conference');

        if (!submission) {
            return responses.notFound(res, 'Submission not found');
        }

        // Chairs can update statuses for ANY conference

        submission.status = status;
        await submission.save();

        const updatedSubmission = await Submission.findById(id)
            .populate('author', 'username email')
            .populate('conference', 'title');

        return responses.success(res, updatedSubmission, 'Status updated successfully');
    } catch (error) {
        next(error);
    }
};
// Create a new conference (Chair/Admin)
exports.createConference = async (req, res, next) => {
    try {
        const {
            title, description, startDate, endDate, submissionDeadline, location,
            mode, themes, acceptanceNotification, registrationFees,
            contactEmail, contactPhone, convenors
        } = req.body;

        const conference = new Conference({
            title,
            description,
            startDate,
            endDate,
            submissionDeadline: submissionDeadline || undefined,
            location,
            mode,
            themes,
            acceptanceNotification: acceptanceNotification || undefined,
            registrationFees,
            contactEmail,
            contactPhone,
            convenors,
            createdBy: req.user._id
        });

        await conference.save();
        return responses.created(res, conference, 'Conference created successfully');
    } catch (error) {
        next(error);
    }
};

// Update an existing conference (Must be the creator)
exports.updateConference = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const conference = await Conference.findById(id);
        if (!conference) return responses.notFound(res, 'Conference not found');

        // Verify ownership
        if (conference.createdBy.toString() !== req.user._id.toString()) {
            return responses.forbidden(res, 'Access denied: You do not manage this conference');
        }

        // Apply updates
        Object.keys(updates).forEach(key => {
            if (updates[key] !== undefined) {
                conference[key] = updates[key];
            }
        });

        await conference.save();
        return responses.success(res, conference, 'Conference updated successfully');
    } catch (error) {
        next(error);
    }
};

// Delete a conference (Must be the creator)
exports.deleteConference = async (req, res, next) => {
    try {
        const { id } = req.params;

        const conference = await Conference.findById(id);
        if (!conference) return responses.notFound(res, 'Conference not found');

        // Verify ownership
        if (conference.createdBy.toString() !== req.user._id.toString()) {
            return responses.forbidden(res, 'Access denied: You do not manage this conference');
        }

        // Check if there are any submissions before deleting? 
        // For simplicity, we'll allow deletion, but in a real-world app, we might prevent it if active.
        await Conference.findByIdAndDelete(id);

        // Also clean up associated submissions and reviews?
        await Submission.deleteMany({ conference: id });
        await Review.deleteMany({ conference: id });

        return responses.success(res, null, 'Conference and all associated data deleted successfully');
    } catch (error) {
        next(error);
    }
};
