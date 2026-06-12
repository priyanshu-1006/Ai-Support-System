import express from 'express';
import { getUsers, updateUserRole, getAnalyticsOverview, getModelUsage } from '../controllers/admin.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);

router.get('/users', getUsers);
router.put('/users/:userId', updateUserRole);
router.get('/analytics/overview', getAnalyticsOverview);
router.get('/analytics/models', getModelUsage);

export default router;
