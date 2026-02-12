const router = require('express').Router();
const chairController = require('../controllers/chairController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All routes here require authentication and Chair role
router.use(authMiddleware);
router.use(roleMiddleware(['Chair', 'Admin'])); // Admins can also access chair views

router.get('/conferences', chairController.getManagedConferences);
router.get('/reviewers', chairController.getAvailableReviewers);
router.post('/assign', chairController.assignReviewer);
router.get('/conferences/:conferenceId/submissions', chairController.getConferenceSubmissions);
router.patch('/submissions/:id/status', chairController.updateSubmissionStatus);

module.exports = router;
