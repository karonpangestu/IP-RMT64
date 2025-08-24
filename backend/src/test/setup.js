// Test setup file
require("dotenv").config()

// Set test environment
process.env.NODE_ENV = "test"

// Increase timeout for database operations
jest.setTimeout(10000)
