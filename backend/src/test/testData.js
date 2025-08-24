// Test data for user testing
const testUsers = [
  {
    username: "testuser1",
    email: "test1@example.com",
    password: "password123",
    role: "user",
  },
  {
    username: "testuser2",
    email: "test2@example.com",
    password: "password456",
    role: "user",
  },
  {
    username: "adminuser",
    email: "admin@example.com",
    password: "adminpass",
    role: "admin",
  },
  {
    username: "moderator",
    email: "moderator@example.com",
    password: "modpass",
    role: "user",
  },
]

const invalidUsers = [
  {
    username: "",
    email: "emptyusername@example.com",
    password: "password123",
  },
  {
    username: "noemail",
    email: "",
    password: "password123",
  },
  {
    username: "nopassword",
    email: "nopassword@example.com",
    password: "",
  },
  {
    username: "invalidemail",
    email: "invalid-email-format",
    password: "password123",
  },
  {
    username: "invalidrole",
    email: "invalidrole@example.com",
    password: "password123",
    role: "invalid_role",
  },
]

module.exports = {
  testUsers,
  invalidUsers,
}
