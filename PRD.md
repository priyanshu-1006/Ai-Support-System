# Product Requirements Document (PRD)

# Gryork AI Custom Support System

## 1. Project Overview

### Product Name

**Gryork AI Support System (GAISS)**

### Vision

Build an AI-powered support platform that can answer user queries using Gryork's internal knowledge base, documents, FAQs, policies, courses, training materials, project documentation, and announcements.

The system should provide:

* Human-like AI responses
* Context-aware conversations
* RAG-powered knowledge retrieval
* Admin knowledge management
* Analytics Dashboard
* Multi-organization support in future

---

# 2. Problem Statement

Current support systems suffer from:

* Repeated questions
* Manual support workload
* Delayed responses
* Scattered documentation
* Difficult onboarding

The AI Support System should become:

> "One place where users can ask anything related to Gryork and instantly receive accurate answers."

---

# 3. User Roles

## User

Can:

* Login/Register
* Chat with AI
* View previous conversations
* Search knowledge base
* Rate responses

---

## Admin

Can:

* Upload documents
* Manage knowledge base
* Monitor conversations
* View analytics
* Configure AI settings

---

## Super Admin

Can:

* Manage organizations
* Manage admins
* Control AI providers
* Manage system settings

---

# 4. Core Features

---

## Module 1: Authentication

### Features

* JWT Authentication
* Login
* Signup
* Forgot Password
* Reset Password
* Refresh Token

### Tech

Backend:

* ExpressJS
* JWT
* bcrypt

Frontend:

* ReactJS
* React Router

---

## Module 2: AI Chat Interface

### Features

ChatGPT-like UI

* Real-time messaging
* Streaming responses
* Typing indicators
* Markdown rendering
* Code block rendering
* Copy response
* Regenerate response
* Feedback buttons

### Screens

* Chat Page
* Conversation History

---

## Module 3: RAG Engine

Most important module.

---

### Workflow

User Query

↓

Embedding Generation

↓

PGVector Similarity Search

↓

Top K Documents

↓

Context Construction

↓

LLM

↓

Final Response

---

### Example

User:

"How do I join Gryork internship program?"

System:

1. Search knowledge base
2. Retrieve internship documents
3. Build prompt
4. Gemini/Groq generates answer

---

## Module 4: Knowledge Base

### Upload Sources

* PDF
* DOCX
* TXT
* Markdown
* Website URLs

Future:

* YouTube transcripts
* Notion
* Google Drive

---

### Document Processing

Pipeline:

Upload

↓

Extract Text

↓

Chunking

↓

Embedding

↓

Store in PGVector

---

### Libraries

* LangChain
* PDF Parser
* Mammoth

---

# 5. AI Architecture

## AI Provider Layer

Create provider abstraction.

### Supported

#### Gemini

Model:

* Gemini 2.5 Flash
* Gemini 2.5 Pro

#### Groq

Models:

* Llama 4
* DeepSeek
* Qwen

Switchable from admin panel.

---

## Embedding Layer

### Embedding Model

Nomic Embeddings

Example:

```
nomic-embed-text-v1
```

Benefits:

* Fast
* Open Source
* Good retrieval accuracy

---

## Vector Database

### PostgreSQL + PGVector

Hosted on Render

Tables:

```sql
documents
document_chunks
embeddings
conversations
messages
users
```

---

# 6. RAG Pipeline

## Step 1

User asks question

```text
How can I register for training?
```

---

## Step 2

Generate embedding

```js
embedding = nomic.embed(question)
```

---

## Step 3

Vector Search

```sql
SELECT *
FROM document_chunks
ORDER BY embedding <=> query_embedding
LIMIT 5;
```

---

## Step 4

Retrieve Context

```text
Chunk 1
Chunk 2
Chunk 3
```

---

## Step 5

Prompt Building

```text
You are Gryork Support Assistant.

Use only provided context.

Context:
....

Question:
....
```

---

## Step 6

Send to Gemini/Groq

---

## Step 7

Return Response

---

# 7. Conversation Memory

Store:

```sql
conversations
```

```sql
messages
```

Features:

* Session memory
* Previous chats
* Context continuation

Example:

User:
"What about fees?"

AI knows previous topic.

---

# 8. Admin Dashboard

---

## Knowledge Base Management

Features:

* Upload document
* Delete document
* Re-index document
* View chunks

---

## AI Monitoring

Features:

* Total Queries
* Failed Queries
* Response Time
* Token Usage

---

## User Management

Features:

* Total Users
* Active Users
* Chat History

---

## Analytics

Charts:

* Daily Conversations
* Popular Questions
* AI Accuracy Rating

---

# 9. Frontend Architecture

## Stack

ReactJS

TailwindCSS v3

ShadCN UI

React Query

Axios

Framer Motion

React Markdown

React Hook Form

Zod

---

## Folder Structure

```text
src/

components/
ui/
chat/
admin/

pages/

Login
Signup
Dashboard
Chat
KnowledgeBase
Analytics

hooks/

api/

services/

contexts/

layouts/

utils/
```

---

# 10. Backend Architecture

## Stack

ExpressJS

PostgreSQL

PGVector

Prisma ORM

JWT

Multer

LangChain

---

## Folder Structure

```text
backend/

src/

controllers/

routes/

services/

middlewares/

utils/

config/

rag/

embeddings/

providers/

gemini/

groq/

database/
```

---

# 11. Database Schema

## Users

```sql
id
name
email
password
role
created_at
```

---

## Documents

```sql
id
title
file_path
uploaded_by
created_at
```

---

## Chunks

```sql
id
document_id
content
embedding
metadata
```

---

## Conversations

```sql
id
user_id
title
created_at
```

---

## Messages

```sql
id
conversation_id
role
content
created_at
```

---

# 12. APIs

## Auth

```http
POST /api/auth/signup
POST /api/auth/login
GET /api/auth/profile
```

---

## Chat

```http
POST /api/chat
GET /api/chat/history
GET /api/chat/:conversationId
```

---

## Documents

```http
POST /api/documents/upload
GET /api/documents
DELETE /api/documents/:id
```

---

## Analytics

```http
GET /api/admin/analytics
```

---

# 13. UI Pages

### Landing Page

* Hero Section
* Features
* FAQ
* Login

---

### Chat Page

* Sidebar
* Chat Area
* AI Responses

---

### Admin Dashboard

* Overview
* Documents
* Users
* Analytics

---

# 14. Security

### Features

* JWT Authentication
* Role Based Access Control
* Rate Limiting
* Helmet
* CORS
* Input Validation
* File Validation

---

# 15. Future Enhancements

### Phase 2

* Voice Chat
* Multilingual Support
* OCR Upload
* WhatsApp Integration
* Telegram Bot
* Discord Bot

---

### Phase 3

* Agentic Workflows
* Tool Calling
* Ticket Creation
* Human Handoff
* Auto Email Responses

---

# Recommended Final Tech Stack

### Frontend

* ReactJS
* Vite
* TailwindCSS v3 (config-based)
* ShadCN UI
* Framer Motion
* React Query
* Axios
* React Markdown

### Backend

* ExpressJS
* PostgreSQL (Render)
* Prisma ORM
* PGVector
* Multer
* JWT
* bcrypt
* LangChain

### AI

* Gemini 2.5 Flash / Pro
* Groq (Llama / DeepSeek / Qwen)
* Nomic Embeddings

### Infrastructure

* Frontend → Vercel
* Backend → Render
* PostgreSQL + PGVector → Render
* Storage → Cloudinary / Supabase Storage

### Development Phases

**Phase 1:** Project Setup + Authentication
**Phase 2:** Chat UI + AI Integration
**Phase 3:** PostgreSQL + PGVector Setup
**Phase 4:** RAG Pipeline Implementation
**Phase 5:** Knowledge Base Upload System
**Phase 6:** Admin Dashboard
**Phase 7:** Analytics & Monitoring
**Phase 8:** Deployment & Production Hardening

This architecture is scalable enough to support not only Gryork but later multiple organizations, colleges, support portals, and AI-powered knowledge assistants from the same codebase.
