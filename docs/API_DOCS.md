# GAISS API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://gaiss-api.render.com/api
```

---

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

### Response Format

#### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

#### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

## Endpoints

### 🔐 Authentication

#### POST /auth/signup
Register new user

**Request**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Response** (201)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Validation Rules**
- Email must be valid and unique
- Password minimum 8 characters
- Password must contain uppercase, lowercase, number

---

#### POST /auth/login
Login user

**Request**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (200)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors**
- `401`: Invalid credentials
- `404`: User not found

---

#### GET /auth/profile
Get current user profile

**Auth**: Required  
**Method**: GET  
**Response** (200)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

#### POST /auth/refresh-token
Refresh access token

**Request**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response** (200)
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

#### POST /auth/logout
Logout user

**Auth**: Required  
**Response** (200)
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 💬 Chat

#### POST /chat
Send message to AI

**Auth**: Required  
**Request**
```json
{
  "conversationId": "uuid",
  "message": "How do I join the internship?",
  "stream": true
}
```

**Response** (200) - With Streaming
```
data: {"type":"start","conversationId":"uuid"}\n\n
data: {"type":"chunk","content":"To join..."}\n\n
data: {"type":"chunk","content":" the internship..."}\n\n
data: {"type":"end","messageId":"uuid","tokensUsed":150}\n\n
```

**Response** (200) - Without Streaming
```json
{
  "success": true,
  "data": {
    "messageId": "uuid",
    "conversationId": "uuid",
    "response": "To join the Gryork internship...",
    "tokensUsed": 150,
    "sources": [
      {
        "documentId": "uuid",
        "title": "Internship Program.pdf",
        "similarity": 0.95
      }
    ]
  }
}
```

---

#### GET /chat/history
Get user's conversations

**Auth**: Required  
**Query Parameters**
- `limit`: Number of conversations (default: 20, max: 100)
- `offset`: Pagination offset (default: 0)
- `search`: Search conversation titles

**Response** (200)
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "uuid",
        "title": "Internship Questions",
        "summary": "Asked about joining internship program",
        "messageCount": 5,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 42,
    "limit": 20,
    "offset": 0
  }
}
```

---

#### GET /chat/:conversationId
Get full conversation

**Auth**: Required  
**Response** (200)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Internship Questions",
    "createdAt": "2024-01-15T10:30:00Z",
    "messages": [
      {
        "id": "uuid",
        "role": "user",
        "content": "How do I join the internship?",
        "createdAt": "2024-01-15T10:30:00Z"
      },
      {
        "id": "uuid",
        "role": "assistant",
        "content": "To join the Gryork internship...",
        "sources": [...],
        "createdAt": "2024-01-15T10:31:00Z"
      }
    ]
  }
}
```

---

#### POST /chat/:messageId/feedback
Rate a response

**Auth**: Required  
**Request**
```json
{
  "feedback": "positive",
  "comment": "Very helpful answer"
}
```

**Response** (200)
```json
{
  "success": true,
  "message": "Feedback recorded"
}
```

**Valid Feedback**
- `positive`
- `negative`
- `neutral`

---

### 📄 Documents

#### POST /documents/upload
Upload document

**Auth**: Required (Admin)  
**Content-Type**: multipart/form-data  
**Fields**
- `file`: Document file (PDF, DOCX, TXT, MD)
- `title`: Document title (optional)

**Response** (202)
```json
{
  "success": true,
  "data": {
    "documentId": "uuid",
    "title": "Internship Program.pdf",
    "status": "processing",
    "message": "Document uploaded. Processing in background."
  }
}
```

**Constraints**
- Max file size: 10MB
- Allowed types: pdf, docx, txt, md
- Processing time: typically 2-5 minutes

---

#### GET /documents
List documents

**Auth**: Required (Admin)  
**Query Parameters**
- `limit`: Results per page (default: 20)
- `offset`: Pagination offset
- `status`: Filter by status (processing, ready, error)
- `search`: Search by title

**Response** (200)
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "uuid",
        "title": "Internship Program.pdf",
        "fileSize": 2048576,
        "fileType": "pdf",
        "status": "ready",
        "chunkCount": 45,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 12,
    "limit": 20,
    "offset": 0
  }
}
```

---

#### GET /documents/:documentId
Get document details

**Auth**: Required (Admin)  
**Response** (200)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Internship Program.pdf",
    "fileSize": 2048576,
    "status": "ready",
    "chunkCount": 45,
    "uploadedBy": "john@example.com",
    "createdAt": "2024-01-15T10:30:00Z",
    "chunks": [
      {
        "id": "uuid",
        "content": "First 100 characters of chunk...",
        "chunkIndex": 0
      }
    ]
  }
}
```

---

#### DELETE /documents/:documentId
Delete document

**Auth**: Required (Admin)  
**Response** (200)
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

---

### 👥 Admin - Users

#### GET /admin/users
List all users

**Auth**: Required (Admin)  
**Query Parameters**
- `limit`: Results per page (default: 20)
- `offset`: Pagination offset
- `role`: Filter by role (user, admin)
- `search`: Search by name/email

**Response** (200)
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "email": "john@example.com",
        "name": "John Doe",
        "role": "user",
        "isActive": true,
        "lastLogin": "2024-01-15T10:30:00Z",
        "createdAt": "2024-01-10T08:00:00Z"
      }
    ],
    "total": 152,
    "limit": 20,
    "offset": 0
  }
}
```

---

#### PUT /admin/users/:userId
Update user role

**Auth**: Required (Super Admin)  
**Request**
```json
{
  "role": "admin"
}
```

**Response** (200)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "role": "admin"
  }
}
```

---

### 📊 Analytics

#### GET /admin/analytics/overview
Get analytics overview

**Auth**: Required (Admin)  
**Query Parameters**
- `startDate`: Start date (YYYY-MM-DD)
- `endDate`: End date (YYYY-MM-DD)

**Response** (200)
```json
{
  "success": true,
  "data": {
    "totalUsers": 152,
    "activeUsers": 89,
    "totalConversations": 1234,
    "totalMessages": 5678,
    "avgResponseTime": 2.5,
    "totalDocuments": 12,
    "tokensUsedToday": 45000
  }
}
```

---

#### GET /admin/analytics/conversations
Get conversation metrics

**Auth**: Required (Admin)  
**Query Parameters**
- `startDate`: Start date
- `endDate`: End date
- `granularity`: daily, weekly, monthly

**Response** (200)
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-15",
      "count": 89,
      "averageMessageCount": 5.2
    }
  ]
}
```

---

#### GET /admin/analytics/questions
Get most asked questions

**Auth**: Required (Admin)  
**Query Parameters**
- `limit`: Number of results (default: 10)
- `days`: Last N days (default: 30)

**Response** (200)
```json
{
  "success": true,
  "data": [
    {
      "question": "How do I join the internship?",
      "count": 45,
      "averageFeedback": 0.85
    }
  ]
}
```

---

#### GET /admin/analytics/models
Get AI model usage

**Auth**: Required (Admin)  
**Response** (200)
```json
{
  "success": true,
  "data": {
    "gemini-2.5-flash": {
      "usageCount": 1200,
      "tokensUsed": 150000,
      "averageResponseTime": 2.3
    },
    "groq-llama": {
      "usageCount": 450,
      "tokensUsed": 45000,
      "averageResponseTime": 1.8
    }
  }
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 202 | Accepted (async processing) |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 500 | Server Error |

---

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_CREDENTIALS` | Email or password is incorrect |
| `EMAIL_EXISTS` | Email already registered |
| `VALIDATION_ERROR` | Input validation failed |
| `UNAUTHORIZED` | Missing or invalid token |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `FILE_TOO_LARGE` | Uploaded file exceeds size limit |
| `INVALID_FILE_TYPE` | File type not supported |
| `RATE_LIMITED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

---

## Rate Limiting

- **General**: 100 requests per minute per user
- **Auth**: 5 requests per minute per IP
- **Chat**: 30 requests per minute per user
- **Upload**: 5 requests per minute per user

Response header:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642261200
```

---

## Pagination

All list endpoints support pagination:

**Query Parameters**
- `limit`: Items per page (default: 20, max: 100)
- `offset`: Number of items to skip (default: 0)

**Response**
```json
{
  "data": [...],
  "total": 1000,
  "limit": 20,
  "offset": 0
}
```

---

## Filtering

**Supported Operations**
- `eq`: Equals
- `ne`: Not equals
- `gt`: Greater than
- `gte`: Greater than or equal
- `lt`: Less than
- `lte`: Less than or equal
- `in`: In array
- `contains`: String contains

**Example**
```
GET /admin/users?filter=role:eq:admin&filter=createdAt:gte:2024-01-01
```

---

## Webhooks (Future)

Webhook support coming in Phase 2+

- Document processing complete
- New user signup
- Error notifications

---

## Changelog

### v1.0 (June 2024)
- Initial API release
- Auth endpoints
- Chat endpoints
- Document upload
- Analytics endpoints

