import express from 'express';
import { signup, login, getProfile, logout } from '../controllers/auth.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.post('/logout', logout);

// We mock the refresh token endpoint for now since the frontend calls it but we use long-lived tokens
router.post('/refresh-token', (req, res) => res.json({ message: 'Tokens are long-lived, mock refresh successful' }));

export default router;
