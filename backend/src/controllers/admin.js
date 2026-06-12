import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const role = req.query.role;
        const search = req.query.search;

        const where = {};
        if (role) {
            where.role = role;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }

        const users = await prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true,
            }
        });

        res.json({ data: { users } });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!['user', 'admin', 'super_admin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role },
            select: { id: true, email: true, name: true, role: true }
        });

        res.json({ success: true, data: updatedUser });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ error: 'Failed to update user role' });
    }
};

export const getAnalyticsOverview = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const activeUsers = await prisma.user.count({ where: { isActive: true } });
        const totalConversations = await prisma.conversation.count();

        // Calculate a dummy avg response time for now
        const avgResponseTime = 1.2;

        res.json({
            data: {
                totalUsers,
                activeUsers,
                totalConversations,
                avgResponseTime
            }
        });
    } catch (error) {
        console.error('Error fetching analytics overview:', error);
        res.status(500).json({ error: 'Failed to fetch analytics overview' });
    }
};

export const getModelUsage = async (req, res) => {
    try {
        // Group by modelUsed from messages
        const usageStats = await prisma.message.groupBy({
            by: ['modelUsed'],
            _count: {
                id: true
            },
            _sum: {
                tokensUsed: true
            },
            where: {
                role: 'assistant',
                modelUsed: { not: null }
            }
        });

        const formattedUsage = usageStats.reduce((acc, stat) => {
            acc[stat.modelUsed] = {
                usageCount: stat._count.id,
                tokensUsed: stat._sum.tokensUsed || 0
            };
            return acc;
        }, {});

        res.json({ data: formattedUsage });
    } catch (error) {
        console.error('Error fetching model usage:', error);
        res.status(500).json({ error: 'Failed to fetch model usage' });
    }
};
