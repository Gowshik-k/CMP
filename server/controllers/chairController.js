const Conference = require('../models/Conference');
const Submission = require('../models/Submission');
const Review = require('../models/Review');
const User = require('../models/User');
const responses = require('../utils/responses');

// Get conferences managed by the current chair with real stats
exports.getManagedConferences = async (req, res, next) => {
    try {
        const conferences = await Conference.find({ createdBy: req.user._id })
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

        // Verify chair ownership
        if (submission.conference.createdBy.toString() !== req.user._id.toString()) {
            return responses.forbidden(res, 'Access denied: You do not manage this conference');
        }

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

        // Verify the chair owns this conference
        const conference = await Conference.findOne({
            _id: conferenceId,
            createdBy: req.user._id
        });

        if (!conference) {
            return responses.forbidden(res, 'Access denied: You do not manage this conference');
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

        // Find submission and populate conference to check ownership
        const submission = await Submission.findById(id).populate('conference');

        if (!submission) {
            return responses.notFound(res, 'Submission not found');
        }

        if (submission.conference.createdBy.toString() !== req.user._id.toString()) {
            return responses.forbidden(res, 'Access denied: You do not manage this conference');
        }

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
