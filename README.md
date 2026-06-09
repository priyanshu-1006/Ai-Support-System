# GAISS - Gryork AI Support System

> An AI-powered support platform providing intelligent responses using RAG (Retrieval-Augmented Generation)

## 📋 Project Structure

```
SupportSystem/
├── frontend/           # React + Vite frontend
├── backend/            # Express.js backend
├── docs/               # Documentation
├── PRD.md              # Product Requirements Document
└── IMPLEMENTATION_PLAN.md  # Implementation roadmap
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Installation

```bash
# Install all dependencies
npm run install-all

# Or install individually
cd frontend && npm install
cd ../backend && npm install
```

### Setup Environment
Copy `.env.example` files to `.env` in both frontend and backend directories.

See [ENV_SETUP.md](./docs/ENV_SETUP.md) for configuration details.

### Running Locally

```bash
# Run both frontend and backend
npm run dev

# Or run separately
npm run dev:frontend  # http://localhost:5173
npm run dev:backend   # http://localhost:5000
```

## 📚 Documentation

- [Product Requirements Document](./PRD.md)
- [Implementation Plan](./IMPLEMENTATION_PLAN.md)
- [Environment Setup Guide](./docs/ENV_SETUP.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)
- [API Documentation](./docs/API_DOCS.md)

## 🏗️ Architecture

### Frontend Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **UI Library**: ShadCN UI
- **Styling**: TailwindCSS v3
- **State Management**: React Query
- **HTTP Client**: Axios
- **Form Validation**: React Hook Form + Zod

### Backend Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Vector DB**: PGVector
- **ORM**: Prisma
- **Auth**: JWT + bcrypt
- **File Upload**: Multer
- **AI**: Gemini / Groq

## 📖 Core Features

### Phase 1: Authentication
- JWT-based authentication
- Login/Signup/Forgot Password
- Token refresh mechanism

### Phase 2: Chat Interface
- Real-time messaging
- Streaming responses
- Markdown & code rendering

### Phase 3: Database Setup
- PostgreSQL + PGVector
- Prisma migrations
- Schema initialization

### Phase 4: RAG Pipeline
- Embedding generation
- Vector similarity search
- Context retrieval

### Phase 5: Knowledge Base
- Document upload (PDF, DOCX, TXT, MD)
- Automatic chunking
- Embedding generation

### Phase 6: Admin Dashboard
- Knowledge base management
- User analytics
- System monitoring

### Phase 7: Analytics
- Query metrics
- Response performance
- User engagement tracking

### Phase 8: Deployment
- Production hardening
- CI/CD setup
- Monitoring & logging

## 🔐 Security

- JWT Authentication
- Role-Based Access Control (RBAC)
- Rate Limiting
- Input Validation
- File upload validation
- CORS configuration
- Helmet.js headers
- bcrypt password hashing

## 📊 Database

**Primary**: PostgreSQL  
**Vector Store**: PGVector  
**ORM**: Prisma

Key tables:
- `users` - User accounts
- `documents` - Uploaded documents
- `document_chunks` - Chunked text with embeddings
- `conversations` - Chat sessions
- `messages` - Chat messages

## 🌐 API Endpoints

See [API_DOCS.md](./docs/API_DOCS.md) for complete API reference.

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/profile`

### Chat
- `POST /api/chat` - Send message
- `GET /api/chat/history` - Get conversations
- `GET /api/chat/:conversationId` - Get conversation

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - List documents
- `DELETE /api/documents/:id` - Delete document

### Admin
- `GET /api/admin/analytics` - Get analytics

## 🔄 AI Providers

### Supported Models

**Gemini**
- Gemini 2.5 Flash
- Gemini 2.5 Pro

**Groq**
- Llama 4
- DeepSeek
- Qwen

Switchable from admin panel.

## 🎯 Development Phases

| Phase | Focus | Duration |
|-------|-------|----------|
| 1 | Setup + Auth | Week 1 |
| 2 | Chat UI + AI | Week 2 |
| 3 | Database | Week 1 |
| 4 | RAG Pipeline | Week 2 |
| 5 | Knowledge Base | Week 2 |
| 6 | Admin Dashboard | Week 2 |
| 7 | Analytics | Week 1 |
| 8 | Deployment | Week 1 |

## 🚢 Deployment Targets

- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Render (PostgreSQL)
- **Storage**: Cloudinary / Supabase

## 📈 Future Enhancements

### Phase 2+
- Voice chat
- Multilingual support
- WhatsApp/Telegram integration
- Discord bot
- Auto email responses

## 📝 License

MIT

## 👥 Team

- **Product**: Requirements & Vision
- **Backend**: API & RAG Implementation
- **Frontend**: UI & UX
- **DevOps**: Deployment & Infrastructure

---

For more details, see [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
