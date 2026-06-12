import express from 'express';
import { listDocuments, deleteDocument } from '../controllers/documents.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware
router.use(authenticate);

// Documents can be viewed and managed by admin and super_admin
// Depending on requirements, users might also upload documents, but standard setup restricts deletes/listing all to admins.
// For now, we will allow any authenticated user to list and delete as the frontend calls these endpoints.
// To be safe, we'll enforce admin role if needed, but since the issue is just missing endpoints, we'll implement them.

router.get('/', listDocuments);
router.delete('/:documentId', requireAdmin, deleteDocument);

export default router;
