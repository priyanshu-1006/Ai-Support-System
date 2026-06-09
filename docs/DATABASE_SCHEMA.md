# GAISS Database Schema

## Overview
PostgreSQL + PGVector database schema for the AI Support System

## Tables

### users
User accounts and authentication

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin', 'super_admin') DEFAULT 'user',
  avatar_url VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### documents
Uploaded documents

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT,
  file_type VARCHAR(50),
  uploaded_by UUID NOT NULL REFERENCES users(id),
  status ENUM('processing', 'ready', 'error') DEFAULT 'processing',
  error_message TEXT,
  chunk_count INT DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX idx_documents_status ON documents(status);
```

### document_chunks
Text chunks from documents with embeddings

```sql
CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  chunk_index INT NOT NULL,
  embedding vector(768), -- Nomic embeddings are 768 dimensions
  metadata JSONB, -- {source_page, section, etc}
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX idx_document_chunks_embedding ON document_chunks USING hnsw (embedding vector_cosine_ops);
```

### conversations
Chat sessions

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  summary TEXT,
  message_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at DESC);
```

### messages
Chat messages

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role ENUM('user', 'assistant') NOT NULL,
  content TEXT NOT NULL,
  tokens_used INT,
  model_used VARCHAR(100),
  sources JSONB, -- References to document chunks
  feedback ENUM('positive', 'negative', 'neutral'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_role ON messages(role);
```

### api_logs
API request logging for analytics

```sql
CREATE TABLE api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  method VARCHAR(10) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  status_code INT,
  response_time_ms INT,
  tokens_used INT,
  ai_provider VARCHAR(50),
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_api_logs_user_id ON api_logs(user_id);
CREATE INDEX idx_api_logs_endpoint ON api_logs(endpoint);
CREATE INDEX idx_api_logs_created_at ON api_logs(created_at DESC);
```

### analytics_aggregates
Pre-aggregated analytics data

```sql
CREATE TABLE analytics_aggregates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  metric_type VARCHAR(100) NOT NULL,
  metric_value JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_date ON analytics_aggregates(date);
CREATE INDEX idx_analytics_type ON analytics_aggregates(metric_type);
```

---

## Prisma Schema (schema.prisma)

```prisma
// Database connection
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// User model
model User {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email     String   @unique
  password  String
  name      String
  role      Role     @default(user)
  avatarUrl String?  @db.VarChar(255)
  isActive  Boolean  @default(true)
  lastLogin DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  conversations Conversation[]
  documents     Document[]

  @@index([email])
  @@index([role])
}

enum Role {
  user
  admin
  super_admin
}

// Document model
model Document {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  title       String
  filePath    String   @db.VarChar(500)
  fileSize    BigInt?
  fileType    String?  @db.VarChar(50)
  uploadedBy  String   @db.Uuid
  status      DocStatus @default(processing)
  errorMsg    String?
  chunkCount  Int      @default(0)
  metadata    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  uploader User              @relation(fields: [uploadedBy], references: [id])
  chunks   DocumentChunk[]

  @@index([uploadedBy])
  @@index([status])
}

enum DocStatus {
  processing
  ready
  error
}

// Document chunk with vector embedding
model DocumentChunk {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  docId     String   @db.Uuid
  content   String   @db.Text
  chunkIdx  Int
  embedding Unsupported("vector(768)")?
  metadata  Json?
  createdAt DateTime @default(now())

  document Document @relation(fields: [docId], references: [id], onDelete: Cascade)

  @@index([docId])
}

// Conversation model
model Conversation {
  id       String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId   String   @db.Uuid
  title    String?
  summary  String?
  msgCount Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  messages Message[]

  @@index([userId])
  @@index([createdAt])
}

// Message model
model Message {
  id         String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  convId     String   @db.Uuid
  role       MessageRole
  content    String   @db.Text
  tokensUsed Int?
  modelUsed  String?  @db.VarChar(100)
  sources    Json?
  feedback   Feedback?
  createdAt  DateTime @default(now())

  conversation Conversation @relation(fields: [convId], references: [id], onDelete: Cascade)

  @@index([convId])
  @@index([role])
}

enum MessageRole {
  user
  assistant
}

enum Feedback {
  positive
  negative
  neutral
}

// API Logs
model ApiLog {
  id         String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId     String?  @db.Uuid
  method     String   @db.VarChar(10)
  endpoint   String   @db.VarChar(255)
  statusCode Int?
  respTime   Int? // milliseconds
  tokensUsed Int?
  aiProvider String?  @db.VarChar(50)
  errorMsg   String?
  createdAt  DateTime @default(now())

  @@index([userId])
  @@index([endpoint])
  @@index([createdAt])
}
```

---

## Vector Search Examples

### Basic Similarity Search
```sql
-- Find top 5 most similar chunks to a query embedding
SELECT 
  id, 
  document_id, 
  content,
  1 - (embedding <=> query_embedding) AS similarity
FROM document_chunks
ORDER BY embedding <=> query_embedding
LIMIT 5;
```

### Filtered Vector Search
```sql
-- Search within specific documents
SELECT 
  dc.id, 
  dc.content,
  1 - (dc.embedding <=> query_embedding) AS similarity
FROM document_chunks dc
WHERE dc.document_id = 'doc-123'
ORDER BY dc.embedding <=> query_embedding
LIMIT 5;
```

---

## Key Design Decisions

1. **UUID Primary Keys**: Better for distributed systems and avoiding ID leaks
2. **Enum Types**: Constrain status/role values at database level
3. **JSONB Metadata**: Flexible schema for future extensions
4. **Vector(768)**: Matches Nomic embedding dimension
5. **Cascade Deletes**: Clean up chunks when document is deleted
6. **Indexes**: Optimized for common query patterns
7. **Timestamps**: Track created/updated times for auditing

---

## Migrations

Initial schema creation:
```bash
npx prisma migrate dev --name init
```

---

## Backup Strategy

1. **Daily Backups** on Render PostgreSQL
2. **Point-in-time Recovery** enabled
3. **Test restores** monthly
4. **Archive old data** quarterly

