import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  databaseUrl: process.env.DATABASE_URL,
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    expire: process.env.JWT_EXPIRE || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d',
  },
  
  // AI Providers
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY,
  },
  selectedAiProvider: process.env.SELECTED_AI_PROVIDER || 'gemini',
  
  // Embedding
  embedding: {
    model: process.env.EMBEDDING_MODEL || 'nomic-embed-text-v1',
  },
  
  // Storage
  cloudinary: {
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  },
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // File Upload
  fileUpload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB default
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'pdf,docx,txt,md').split(','),
  },
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
};

export default config;
