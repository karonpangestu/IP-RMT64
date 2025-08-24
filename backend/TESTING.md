# Testing Documentation

This document explains how to run tests for the Podcast Summarizer Backend application.

## Test Structure

The tests are organized into the following structure:

```
src/
├── __tests__/
│   └── users.test.js          # User model and authentication tests
├── test/
│   ├── setup.js               # Test setup and teardown
│   └── testData.js            # Test data fixtures
└── jest.config.js             # Jest configuration
```

## Running Tests

### Basic Test Commands

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with verbose output
npm run test:verbose
```

### Test Coverage

The tests are configured to achieve at least **90% coverage** across:

- Branches: 90%
- Functions: 90%
- Lines: 90%
- Statements: 90%

## Test Categories

### 1. User Model Tests

- ✅ User creation with valid data
- ✅ Validation failures (missing fields)
- ✅ Email format validation
- ✅ Role validation
- ✅ Duplicate email prevention
- ✅ Timestamps and UUID generation

### 2. Authentication Route Tests

- ✅ User registration (success and failure cases)
- ✅ User login (success and failure cases)
- ✅ JWT token verification
- ✅ Google OAuth handling
- ✅ Input validation and error handling

### 3. User Data Validation Tests

- ✅ User lookup by email and ID
- ✅ User information updates
- ✅ User deletion
- ✅ Database operations

## Test Data

The tests use predefined test data including:

- Valid test users (regular users and admin)
- Invalid user data for testing validation
- Test tokens for authentication testing

## Environment Setup

Tests automatically:

- Set `NODE_ENV=test`
- Create a fresh test database
- Clean up after each test run
- Handle database connections properly

## Dependencies

Required testing dependencies:

- `jest`: Test framework
- `supertest`: HTTP testing
- `bcryptjs`: Password hashing for test data

## Troubleshooting

### Common Issues

1. **Database Connection Errors**: Ensure your test database is accessible
2. **Timeout Errors**: Tests have a 10-second timeout for database operations
3. **Coverage Issues**: Check that all code paths are being tested

### Running Individual Tests

```bash
# Run only user tests
npm test -- users.test.js

# Run specific test file
npm test -- --testPathPattern=users.test.js
```

## Adding New Tests

When adding new tests:

1. Follow the existing test structure and naming conventions
2. Ensure proper cleanup in `afterAll` hooks
3. Test both success and failure scenarios
4. Maintain the 90% coverage threshold
5. Use descriptive test names that explain the expected behavior
