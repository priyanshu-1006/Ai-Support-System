import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const generateTokens = (user) => {
    const payload = { userId: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
    // In a real app you'd want a separate refresh token logic, but we'll mock it for now.
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
    return { token, refreshToken };
};

export const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Email, password, and name are required' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'user', // default role
            }
        });

        const { token, refreshToken } = generateTokens(user);

        res.status(201).json({
            data: {
                user: { id: user.id, email: user.email, name: user.name, role: user.role },
                token,
                refreshToken
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

        const { token, refreshToken } = generateTokens(user);

        res.json({
            data: {
                user: { id: user.id, email: user.email, name: user.name, role: user.role },
                token,
                refreshToken
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getProfile = async (req, res) => {
    try {
        // req.user is set by auth middleware
        res.json({ data: req.user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const logout = async (req, res) => {
    // In a stateless JWT setup, logout is handled client-side by deleting the token.
    // If you have a token blacklist, you would add it here.
    res.json({ message: 'Logged out successfully' });
};
