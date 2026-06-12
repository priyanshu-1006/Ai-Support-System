import express from 'express';
import { getHistory, getConversation, sendMessage } from '../controllers/chat.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all chat routes
router.use(authenticate);

router.post('/', sendMessage);
router.get('/history', getHistory);
router.get('/:conversationId', getConversation);

export default router;
