const router = require('express').Router();
const reviewerController = require('../controllers/reviewerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All routes here require authentication and Reviewer role
router.use(authMiddleware);
router.use(roleMiddleware(['Reviewer', 'Admin', 'Chair'])); // Chairs/Admins can play reviewer role too

router.get('/assigned', reviewerController.getAssignedReviews);
router.post('/submit/:reviewId', reviewerController.submitReview);

module.exports = router;
