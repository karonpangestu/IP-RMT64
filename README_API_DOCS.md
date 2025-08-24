# API Documentation Guide

This repository contains comprehensive API documentation for the Podcast Summarizer application. Below you'll find everything you need to understand, test, and integrate with the API.

## 📚 Documentation Files

### 1. `API_DOCUMENTATION.md` - Complete API Reference

- **What it contains**: Full API specification with all endpoints, request/response formats, data models, and error handling
- **Best for**: Developers who need complete API understanding, system architects, and technical documentation
- **Use when**: Implementing new features, debugging issues, or understanding the complete API structure

### 2. `API_EXAMPLES.md` - Practical Usage Examples

- **What it contains**: Code examples in multiple languages, frontend integration patterns, error handling, and performance tips
- **Best for**: Frontend developers, mobile developers, and anyone implementing API integrations
- **Use when**: Building client applications, learning how to use specific endpoints, or implementing error handling

### 3. `Podcast_Summarizer_API.postman_collection.json` - Postman Collection

- **What it contains**: Ready-to-use Postman collection with all API endpoints, authentication, and test scripts
- **Best for**: API testing, development, and debugging
- **Use when**: Testing API endpoints, debugging issues, or demonstrating API functionality

## 🚀 Quick Start

### For Developers

1. **Read the overview** in `API_DOCUMENTATION.md` to understand the API structure
2. **Import the Postman collection** to test endpoints immediately
3. **Use the examples** in `API_EXAMPLES.md` for implementation guidance

### For Testers

1. **Import the Postman collection** into Postman
2. **Set up environment variables** (base URL, test credentials)
3. **Run the collection** to test all endpoints

### For Product Managers

1. **Review the API overview** to understand capabilities
2. **Check the data models** to understand data structure
3. **Review error handling** to understand user experience

## 🔧 Setting Up Postman Collection

### Step 1: Import Collection

1. Open Postman
2. Click "Import" button
3. Select the `Podcast_Summarizer_API.postman_collection.json` file
4. The collection will appear in your Postman sidebar

### Step 2: Configure Environment

1. Click the "Environment" dropdown in the top right
2. Click "Add" to create a new environment
3. Set the following variables:
   - `base_url`: `http://localhost:3000/api` (or your server URL)
   - `user_email`: Your test email
   - `user_password`: Your test password
   - `auth_token`: Leave empty (will be auto-filled)
   - `episode_id`: Leave empty (will be auto-filled)

### Step 3: Test the API

1. **Start with Authentication**: Run "Register User" or "Login User"
2. **Check the Console**: The token will be automatically saved
3. **Test Episodes**: Create, read, update, and delete episodes
4. **Monitor Variables**: Watch how `auth_token` and `episode_id` are automatically managed

## 📖 How to Use Each Documentation File

### API_DOCUMENTATION.md

```markdown
# Structure

- Overview and base URL
- Authentication endpoints
- Episode management endpoints
- Data models and schemas
- Error handling and status codes
- Environment variables
- Security features

# Best Practices

- Read the overview first
- Check validation rules for each endpoint
- Understand the data models
- Review error handling patterns
```

### API_EXAMPLES.md

```markdown
# Structure

- Quick start examples (cURL and JavaScript)
- Frontend integration patterns
- Error handling examples
- Testing examples
- Performance optimization tips

# Best Practices

- Start with the quick start examples
- Copy and modify the code snippets
- Use the React hooks for frontend integration
- Implement the error handling patterns
```

### Postman Collection

```markdown
# Features

- Pre-configured requests with proper headers
- Automatic token management
- Test scripts for validation
- Environment variable management
- Example requests for common use cases

# Workflow

1. Register/Login to get token
2. Token is automatically saved
3. Use token for authenticated requests
4. Episode ID is automatically captured
5. Test all CRUD operations
```

## 🧪 Testing Workflow

### 1. Authentication Flow

```bash
# 1. Register a new user
POST /api/auth/register
Body: { "username": "testuser", "email": "test@example.com", "password": "password123" }

# 2. Login to get token
POST /api/auth/login
Body: { "email": "test@example.com", "password": "password123" }

# 3. Use token in subsequent requests
Authorization: Bearer <your-jwt-token>
```

### 2. Episode Management Flow

```bash
# 1. Create episode
POST /api/episodes
Body: { "title": "Test Episode", "sourceUrl": "https://youtube.com/watch?v=example" }

# 2. Get episode by ID
GET /api/episodes/{episode_id}

# 3. Update episode title
PUT /api/episodes/{episode_id}
Body: { "title": "Updated Title" }

# 4. Delete episode
DELETE /api/episodes/{episode_id}
```

## 🔍 Common Use Cases

### Frontend Integration

- **User Authentication**: Use the authentication context pattern
- **Episode Management**: Use the episode service class
- **Error Handling**: Implement the global error handler
- **Caching**: Use the caching implementation for performance

### Mobile App Integration

- **API Calls**: Use the fetch examples with proper headers
- **Token Management**: Implement secure token storage
- **Offline Support**: Cache responses for offline access

### Third-party Integration

- **Webhook Support**: Monitor episode status changes
- **API Keys**: Use JWT tokens for authentication
- **Rate Limiting**: Implement client-side rate limiting

## 🚨 Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check if token is valid and included in headers
2. **400 Bad Request**: Validate request body against schema requirements
3. **404 Not Found**: Verify the endpoint URL and resource ID
4. **500 Server Error**: Check server logs and database connection

### Debug Steps

1. **Check Postman Console**: Look for variable updates and test results
2. **Verify Environment Variables**: Ensure base_url and tokens are set
3. **Check Request Headers**: Ensure Content-Type and Authorization are correct
4. **Validate Request Body**: Check JSON format and required fields

## 📝 Contributing to Documentation

### Adding New Endpoints

1. Update `API_DOCUMENTATION.md` with endpoint details
2. Add examples to `API_EXAMPLES.md`
3. Create Postman request in the collection
4. Add test scripts for validation

### Updating Examples

1. Test all code examples before updating
2. Ensure examples work with current API version
3. Add new use cases and patterns
4. Update error handling examples

## 🔗 Additional Resources

### API Status

- **Base URL**: `http://localhost:3000/api` (development)
- **Authentication**: JWT Bearer tokens
- **Rate Limiting**: Not currently implemented
- **CORS**: Enabled for development

### Support

- **Documentation Issues**: Create an issue in the repository
- **API Problems**: Check server logs and database status
- **Feature Requests**: Submit through repository issues

### Versioning

- **Current Version**: 1.0.0
- **API Changes**: Documented in changelog
- **Breaking Changes**: Will be versioned appropriately

---

**Happy coding! 🚀**

This documentation should give you everything you need to successfully integrate with the Podcast Summarizer API. If you have questions or need clarification, please refer to the troubleshooting section or create an issue in the repository.


