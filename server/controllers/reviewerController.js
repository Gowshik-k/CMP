const Review = require('../models/Review');
const Submission = require('../models/Submission');
const responses = require('../utils/responses');

// Get reviews assigned to the current reviewer
exports.getAssignedReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ reviewer: req.user._id })
            .populate({
                path: 'submission',
                populate: { path: 'conference', select: 'title' }
            })
            .sort({ assignedAt: -1 });

        return responses.success(res, reviews);
    } catch (error) {
        next(error);
    }
};

// Submit a review (Score & Feedback)
exports.submitReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const { score, feedback } = req.body;

        if (!score || score < 1 || score > 5) {
            return responses.badRequest(res, 'Invalid score. Must be between 1 and 5');
        }

        const review = await Review.findById(reviewId);
        if (!review) return responses.notFound(res, 'Review not found');

        // Verify authenticity
        if (review.reviewer.toString() !== req.user._id.toString()) {
            return responses.forbidden(res, 'Access denied: This review is not assigned to you');
        }

        review.score = score;
        review.feedback = feedback;
        review.status = 'Completed';
        review.completedAt = Date.now();

        await review.save();

        // Optional: Trigger a status update on the submission itself if needed
        // For now, we'll keep them separate so the chair can make the final decision.

        return responses.success(res, review, 'Review submitted successfully');
    } catch (error) {
        next(error);
    }
};
