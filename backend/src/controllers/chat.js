import { PrismaClient } from '@prisma/client';
import { runRagPipeline } from '../rag/chain.js';

const prisma = new PrismaClient();

export const getHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;

        const conversations = await prisma.conversation.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            take: limit,
            skip: offset,
        });

        res.json({ data: conversations });
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
};

export const getConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.id;

        const conversation = await prisma.conversation.findFirst({
            where: { id: conversationId, userId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        res.json({ data: conversation });
    } catch (error) {
        console.error('Error fetching conversation:', error);
        res.status(500).json({ error: 'Failed to fetch conversation' });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { conversationId, message, stream } = req.body;
        const userId = req.user.id;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        let convId = conversationId;

        // If it's a new conversation
        if (!convId || convId === 'new') {
            const newConv = await prisma.conversation.create({
                data: {
                    userId,
                    title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
                }
            });
            convId = newConv.id;
        } else {
            // Verify ownership
            const conv = await prisma.conversation.findFirst({
                where: { id: convId, userId }
            });
            if (!conv) {
                return res.status(404).json({ error: 'Conversation not found' });
            }
        }

        // Save user message
        const userMsg = await prisma.message.create({
            data: {
                convId,
                role: 'user',
                content: message,
            }
        });

        // Update conversation message count and updatedAt
        await prisma.conversation.update({
            where: { id: convId },
            data: {
                msgCount: { increment: 1 },
                updatedAt: new Date(),
            }
        });

        // Run the RAG pipeline
        const ragResult = await runRagPipeline(message);

        // Save assistant message
        const assistantMsg = await prisma.message.create({
            data: {
                convId,
                role: 'assistant',
                content: ragResult.answer,
                sources: ragResult.sources,
                modelUsed: 'gemini-1.5-pro'
            }
        });

        await prisma.conversation.update({
            where: { id: convId },
            data: {
                msgCount: { increment: 1 },
                updatedAt: new Date(),
            }
        });

        // For now we don't handle actual SSE streaming in this simple controller, 
        // we just return the complete message to satisfy the client immediately.
        res.json({ data: assistantMsg });

    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

export const deleteConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.id;

        const conversation = await prisma.conversation.findFirst({
            where: { id: conversationId, userId }
        });

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        await prisma.conversation.delete({
            where: { id: conversationId }
        });

        res.json({ success: true, message: 'Conversation deleted' });
    } catch (error) {
        console.error('Error deleting conversation:', error);
        res.status(500).json({ error: 'Failed to delete conversation' });
    }
};
