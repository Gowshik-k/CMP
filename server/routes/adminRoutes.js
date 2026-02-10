const router = require('express').Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All routes here require authentication and Admin role
router.use(authMiddleware);
router.use(roleMiddleware('Admin'));

router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.patch('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);
router.get('/stats', adminController.getStats);

module.exports = router;
