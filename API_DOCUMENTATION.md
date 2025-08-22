# Podcast Summarizer API Documentation

## Overview

The Podcast Summarizer API is a RESTful service that allows users to create, manage, and analyze podcast episodes. The API provides authentication, episode management, and AI-powered transcript analysis using Google's Gemini AI.

**Base URL:** `http://localhost:3000/api` (or your configured domain)

## Table of Contents

1. [Authentication](#authentication)
2. [Episodes](#episodes)
3. [Data Models](#data-models)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [Environment Variables](#environment-variables)

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Register User

**POST** `/auth/register`

Creates a new user account.

**Request Body:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201):**

```json
{
  "token": "jwt-token-string",
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "role": "user"
  }
}
```

**Validation Rules:**

- `username`: Required, 3-255 characters
- `email`: Required, valid email format, must be unique
- `password`: Required, will be hashed with bcrypt

### Login

**POST** `/auth/login`

Authenticates user with email and password.

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**

```json
{
  "token": "jwt-token-string",
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "role": "user"
  }
}
```

### Google Sign-In

**POST** `/auth/google`

Authenticates user with Google OAuth credential.

**Request Body:**

```json
{
  "credential": "google-oauth-credential-string"
}
```

**Response (200):**

```json
{
  "token": "jwt-token-string",
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "role": "user"
  }
}
```

### Verify Token

**POST** `/auth/verify`

Verifies the validity of a JWT token.

**Request Body:**

```json
{
  "token": "jwt-token-string"
}
```

**Response (200):**

```json
{
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "role": "user"
  }
}
```

## Episodes

### Get Video Metadata

**GET** `/episodes/metadata`

Retrieves metadata for a YouTube video URL (no authentication required).

**Query Parameters:**

- `url` (required): YouTube video URL

**Response (200):**

```json
{
  "title": "string",
  "description": "string",
  "duration": "string",
  "thumbnail": "string"
}
```

**Example:**

```
GET /api/episodes/metadata?url=https://www.youtube.com/watch?v=example
```

### Get All Episodes

**GET** `/episodes`

Retrieves paginated list of episodes with optional search functionality.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `search` (optional): Search term for episode titles
- `limit`: Fixed at 15 episodes per page

**Response (200):**

```json
{
  "episodes": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "sourceUrl": "string",
      "status": "processing|completed|failed",
      "summary": "string",
      "businessIdeas": ["array"],
      "frameworks": ["array"],
      "founderStories": ["array"],
      "aiAnalysis": "object",
      "createdAt": "timestamp",
      "updatedAt": "timestamp",
      "user": {
        "id": "uuid",
        "username": "string",
        "email": "string"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 75,
    "hasMore": true
  }
}
```

**Example:**

```
GET /api/episodes?page=1&search=business
```

### Get Episode by ID

**GET** `/episodes/:id`

Retrieves a specific episode by its ID.

**Path Parameters:**

- `id`: Episode UUID

**Response (200):**

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "sourceUrl": "string",
  "transcript": "string",
  "status": "processing|completed|failed",
  "summary": "string",
  "businessIdeas": ["array"],
  "frameworks": ["array"],
  "founderStories": ["array"],
  "aiAnalysis": "object",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string"
  }
}
```

### Create Episode

**POST** `/episodes`

Creates a new episode and processes it with AI analysis (requires authentication).

**Request Body:**

```json
{
  "title": "string",
  "sourceUrl": "string",
  "description": "string"
}
```

**Validation Rules:**

- `title`: Required, 3-255 characters
- `sourceUrl`: Required, must be a valid YouTube URL
- `description`: Optional

**Response (201):**

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "sourceUrl": "string",
  "status": "processing|completed|failed",
  "summary": "string",
  "businessIdeas": ["array"],
  "frameworks": ["array"],
  "founderStories": ["array"],
  "aiAnalysis": "object",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string"
  }
}
```

**Notes:**

- Episode creation is asynchronous
- Initial status is "processing"
- AI analysis happens in background
- Status updates to "completed" or "failed"

### Update Episode

**PUT** `/episodes/:id`

Updates an episode's title (requires authentication, users can only edit their own episodes).

**Path Parameters:**

- `id`: Episode UUID

**Request Body:**

```json
{
  "title": "string"
}
```

**Validation Rules:**

- `title`: Required, 3-255 characters

**Response (200):**

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "sourceUrl": "string",
  "transcript": "string",
  "status": "string",
  "summary": "string",
  "businessIdeas": ["array"],
  "frameworks": ["array"],
  "founderStories": ["array"],
  "aiAnalysis": "object",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string"
  }
}
```

### Delete Episode

**DELETE** `/episodes/:id`

Deletes an episode (requires authentication, users can only delete their own episodes).

**Path Parameters:**

- `id`: Episode UUID

**Response (204):** No content

## Data Models

### User Model

```javascript
{
  id: "UUID (primary key)",
  username: "string (required)",
  email: "string (required, unique, validated)",
  password: "string (required, hashed)",
  role: "enum: 'user' | 'admin' (default: 'user')",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### Podcast/Episode Model

```javascript
{
  id: "UUID (primary key)",
  title: "string (required, 3-255 chars)",
  description: "text (optional)",
  sourceUrl: "string (required, YouTube URL validated)",
  transcript: "long text (AI-generated)",
  summary: "long text (AI-generated)",
  businessIdeas: "JSONB array (AI-generated)",
  frameworks: "JSONB array (AI-generated)",
  founderStories: "JSONB array (AI-generated)",
  aiAnalysis: "JSONB object (AI-generated)",
  status: "enum: 'processing' | 'completed' | 'failed'",
  userId: "UUID (foreign key to users.id)",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

## Error Handling

The API uses standard HTTP status codes and returns error messages in JSON format:

**Error Response Format:**

```json
{
  "message": "Error description",
  "status": "error",
  "code": "optional_error_code"
}
```

**Common Status Codes:**

- `200`: Success
- `201`: Created
- `204`: No Content (Delete operations)
- `400`: Bad Request (Validation errors)
- `401`: Unauthorized (Invalid/missing token)
- `403`: Forbidden (Insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

**Validation Errors:**

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title must be at least 3 characters long"
    }
  ]
}
```

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## Environment Variables

Required environment variables for the backend:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development|production|test

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=podcast_summarizer
DB_USER=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key

# Google AI (Gemini)
GOOGLE_API_KEY=your_gemini_api_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## AI Analysis Features

The API automatically processes episodes with the following AI-powered features:

1. **Transcript Generation**: Extracts transcript from YouTube videos
2. **Summary Generation**: Creates concise episode summaries
3. **Business Ideas Extraction**: Identifies business opportunities mentioned
4. **Framework Analysis**: Extracts business frameworks and methodologies
5. **Founder Stories**: Captures entrepreneurial narratives
6. **AI Analysis**: Comprehensive AI-generated insights

## Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Joi schema validation for all inputs
- **CORS**: Configurable cross-origin resource sharing
- **User Isolation**: Users can only access/modify their own episodes
- **SQL Injection Protection**: Sequelize ORM with parameterized queries

## Testing

The API includes comprehensive test coverage:

```bash
# Run tests
npm test

# Seed test data
npm run seed
```

## Dependencies

**Core Dependencies:**

- Express.js - Web framework
- Sequelize - ORM for database operations
- PostgreSQL - Database
- JWT - Authentication
- Bcrypt - Password hashing
- Joi - Input validation

**AI & Media Processing:**

- Google Gemini AI - Transcript analysis
- YouTube Transcript API - Video transcript extraction
- ytdl-core - YouTube video processing

**Development:**

- Jest - Testing framework
- Nodemon - Development server
- Supertest - API testing

## Support

For API support or questions, please refer to the project documentation or create an issue in the repository.
