import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

import authRoutes from './routes/auth.js';

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Gryork AI Support System Backend API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);

// We can mount our RAG endpoints here later
// app.post('/api/chat', chatController);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
