const router = require('express').Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// All user routes require authentication
router.use(authMiddleware);

router.get('/dashboard', userController.getUserDashboardData);
router.get('/conferences', userController.getAllConferences);
router.post('/register', userController.registerForConference);
router.post('/submit', userController.submitPaper);

module.exports = router;
