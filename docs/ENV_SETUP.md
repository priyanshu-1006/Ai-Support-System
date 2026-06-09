# Gryork AI Support System - Environment Setup

## Frontend (.env.local)

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Gryork AI Support
```

## Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/gaiss_db

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_REFRESH_EXPIRE=30d

# AI Providers
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
SELECTED_AI_PROVIDER=gemini

# Embedding
EMBEDDING_MODEL=nomic-embed-text-v1

# Storage
CLOUDINARY_API_KEY=your_cloudinary_key_here
CLOUDINARY_API_SECRET=your_cloudinary_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name_here

# CORS
CORS_ORIGIN=http://localhost:5173

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,docx,txt,md
```

