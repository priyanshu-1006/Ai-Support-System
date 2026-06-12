import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const listDocuments = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const status = req.query.status;
        const search = req.query.search;

        const where = {};
        if (status) {
            where.status = status;
        }
        if (search) {
            where.title = { contains: search, mode: 'insensitive' };
        }

        const documents = await prisma.document.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });

        res.json({ data: { documents } });
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
};

export const deleteDocument = async (req, res) => {
    try {
        const { documentId } = req.params;

        await prisma.document.delete({
            where: { id: documentId }
        });

        res.json({ success: true, message: 'Document deleted' });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ error: 'Failed to delete document' });
    }
};
