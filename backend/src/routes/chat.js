import express from 'express';
import { getHistory, getConversation, sendMessage, deleteConversation } from '../controllers/chat.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all chat routes
router.use(authenticate);

router.post('/', sendMessage);
router.get('/history', getHistory);
router.get('/:conversationId', getConversation);
router.delete('/:conversationId', deleteConversation);

export default router;
