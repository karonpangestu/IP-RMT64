const { test, expect, describe, beforeAll, afterAll } = require("@jest/globals")
const supertest = require("supertest")
const app = require("../../test/testApp")
const { User } = require("../../db")
const bcrypt = require("bcryptjs")

// Test data
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
]

// Variables to store test data
let createdUsers = []
let userToken
let adminToken

// Setup before all tests
beforeAll(async () => {
  // Sync database for testing
  const { sequelize } = require("../../db")
  await sequelize.sync({ force: true })

  // Create test users
  for (const userData of testUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const user = await User.create({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
    })
    createdUsers.push(user)
  }
})

// Cleanup after all tests
afterAll(async () => {
  // Clean up test users
  if (createdUsers.length > 0) {
    await User.destroy({
      where: {
        id: createdUsers.map((user) => user.id),
      },
      force: true,
    })
  }

  // Close database connection
  const { sequelize } = require("../../db")
  await sequelize.close()
})

describe("User Model Tests", () => {
  test("should create a user with valid data", async () => {
    const userData = {
      username: "newuser",
      email: "newuser@example.com",
      password: "newpassword",
      role: "user",
    }

    const user = await User.create(userData)

    expect(user).toBeInstanceOf(User)
    expect(user.username).toBe(userData.username)
    expect(user.email).toBe(userData.email)
    expect(user.role).toBe(userData.role)
    expect(user.id).toBeDefined()
    expect(user.createdAt).toBeDefined()
    expect(user.updatedAt).toBeDefined()

    // Clean up
    await user.destroy({ force: true })
  })

  test("should fail to create user without username", async () => {
    const userData = {
      email: "nousername@example.com",
      password: "password123",
      role: "user",
    }

    await expect(User.create(userData)).rejects.toThrow()
  })

  test("should fail to create user without email", async () => {
    const userData = {
      username: "noemail",
      password: "password123",
      role: "user",
    }

    await expect(User.create(userData)).rejects.toThrow()
  })

  test("should fail to create user without password", async () => {
    const userData = {
      username: "nopassword",
      email: "nopassword@example.com",
      role: "user",
    }

    await expect(User.create(userData)).rejects.toThrow()
  })

  test("should fail to create user with invalid email format", async () => {
    const userData = {
      username: "invalidemail",
      email: "invalid-email",
      password: "password123",
      role: "user",
    }

    await expect(User.create(userData)).rejects.toThrow()
  })

  test("should fail to create user with invalid role", async () => {
    const userData = {
      username: "invalidrole",
      email: "invalidrole@example.com",
      password: "password123",
      role: "invalid_role",
    }

    await expect(User.create(userData)).rejects.toThrow()
  })

  test("should fail to create user with duplicate email", async () => {
    const userData = {
      username: "duplicate",
      email: testUsers[0].email, // Use existing email
      password: "password123",
      role: "user",
    }

    await expect(User.create(userData)).rejects.toThrow()
  })
})

describe("Authentication Routes", () => {
  describe("POST /api/auth/register", () => {
    test("should register new user successfully", async () => {
      const newUser = {
        username: "registeruser",
        email: "register@example.com",
        password: "registerpass",
      }

      const response = await supertest(app)
        .post("/api/auth/register")
        .send(newUser)

      expect(response.status).toBe(201)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty("token")
      expect(response.body).toHaveProperty("user")
      expect(response.body.user).toHaveProperty("id")
      expect(response.body.user).toHaveProperty("username", newUser.username)
      expect(response.body.user).toHaveProperty("email", newUser.email)
      expect(response.body.user).toHaveProperty("role", "user")
      expect(response.body.user).not.toHaveProperty("password")

      // Clean up
      await User.destroy({ where: { email: newUser.email }, force: true })
    })

    test("should fail to register user with existing email", async () => {
      const existingUser = {
        username: "existinguser",
        email: testUsers[0].email, // Use existing email
        password: "password123",
      }

      const response = await supertest(app)
        .post("/api/auth/register")
        .send(existingUser)

      expect(response.status).toBe(400)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty(
        "message",
        "Email already registered"
      )
    })

    test("should fail to register user with empty username", async () => {
      const invalidUser = {
        username: "",
        email: "emptyusername@example.com",
        password: "password123",
      }

      const response = await supertest(app)
        .post("/api/auth/register")
        .send(invalidUser)

      expect(response.status).toBe(400) // Will fail due to validation
    })

    test("should fail to register user with empty email", async () => {
      const invalidUser = {
        username: "emptyemail",
        email: "",
        password: "password123",
      }

      const response = await supertest(app)
        .post("/api/auth/register")
        .send(invalidUser)

      expect(response.status).toBe(400) // Will fail due to validation
    })

    test("should fail to register user with empty password", async () => {
      const invalidUser = {
        username: "emptypassword",
        email: "emptypassword@example.com",
        password: "",
      }

      const response = await supertest(app)
        .post("/api/auth/register")
        .send(invalidUser)

      expect(response.status).toBe(400) // Will fail due to validation
    })
  })

  describe("POST /api/auth/login", () => {
    test("should login user with valid credentials", async () => {
      const loginData = {
        email: testUsers[0].email,
        password: testUsers[0].password,
      }

      const response = await supertest(app)
        .post("/api/auth/login")
        .send(loginData)

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty("token")
      expect(response.body).toHaveProperty("user")
      expect(response.body.user).toHaveProperty("id")
      expect(response.body.user).toHaveProperty(
        "username",
        testUsers[0].username
      )
      expect(response.body.user).toHaveProperty("email", testUsers[0].email)
      expect(response.body.user).toHaveProperty("role", testUsers[0].role)
      expect(response.body.user).not.toHaveProperty("password")

      userToken = response.body.token
    })

    test("should fail to login with non-existent email", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: "password123",
      }

      const response = await supertest(app)
        .post("/api/auth/login")
        .send(loginData)

      expect(response.status).toBe(401)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty("message", "Invalid credentials")
    })

    test("should fail to login with wrong password", async () => {
      const loginData = {
        email: testUsers[0].email,
        password: "wrongpassword",
      }

      const response = await supertest(app)
        .post("/api/auth/login")
        .send(loginData)

      expect(response.status).toBe(401)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty("message", "Invalid credentials")
    })

    test("should fail to login with empty email", async () => {
      const loginData = {
        email: "",
        password: "password123",
      }

      const response = await supertest(app)
        .post("/api/auth/login")
        .send(loginData)

      expect(response.status).toBe(400)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty("message", "Email is required")
    })

    test("should fail to login with empty password", async () => {
      const loginData = {
        email: testUsers[0].email,
        password: "",
      }

      const response = await supertest(app)
        .post("/api/auth/login")
        .send(loginData)

      expect(response.status).toBe(400)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty("message", "Password is required")
    })
  })

  describe("POST /api/auth/verify", () => {
    test("should verify valid JWT token", async () => {
      const response = await supertest(app)
        .post("/api/auth/verify")
        .send({ token: userToken })

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty("user")
      expect(response.body.user).toHaveProperty("id")
      expect(response.body.user).toHaveProperty("username")
      expect(response.body.user).toHaveProperty("email")
      expect(response.body.user).toHaveProperty("role")
    })

    test("should fail to verify invalid token", async () => {
      const response = await supertest(app)
        .post("/api/auth/verify")
        .send({ token: "invalid_token" })

      expect(response.status).toBe(500) // Will fail due to invalid token
    })

    test("should fail to verify empty token", async () => {
      const response = await supertest(app)
        .post("/api/auth/verify")
        .send({ token: "" })

      expect(response.status).toBe(500) // Will fail due to empty token
    })

    test("should fail to verify without token", async () => {
      const response = await supertest(app).post("/api/auth/verify").send({})

      expect(response.status).toBe(500) // Will fail due to missing token
    })
  })

  describe("POST /api/auth/google", () => {
    test("should handle Google login with valid credential", async () => {
      // Mock Google credential (in real test, you'd need to mock the Google service)
      const mockCredential = "mock_google_credential"

      const response = await supertest(app)
        .post("/api/auth/google")
        .send({ credential: mockCredential })

      // This will likely fail due to invalid credential, but we're testing the route exists
      expect(response.status).toBe(500) // Expected to fail with mock credential
    })

    test("should fail Google login without credential", async () => {
      const response = await supertest(app).post("/api/auth/google").send({})

      expect(response.status).toBe(500) // Will fail due to missing credential
    })
  })
})

describe("User Data Validation", () => {
  test("should find user by email", async () => {
    const user = await User.findOne({ where: { email: testUsers[0].email } })

    expect(user).toBeInstanceOf(User)
    expect(user.email).toBe(testUsers[0].email)
    expect(user.username).toBe(testUsers[0].username)
  })

  test("should find user by primary key", async () => {
    const user = await User.findByPk(createdUsers[0].id)

    expect(user).toBeInstanceOf(User)
    expect(user.id).toBe(createdUsers[0].id)
    expect(user.email).toBe(createdUsers[0].email)
  })

  test("should update user information", async () => {
    const newUsername = "updatedusername"
    const user = await User.findByPk(createdUsers[0].id)

    await user.update({ username: newUsername })

    expect(user.username).toBe(newUsername)

    // Verify in database
    const updatedUser = await User.findByPk(createdUsers[0].id)
    expect(updatedUser.username).toBe(newUsername)
  })

  test("should delete user", async () => {
    const userToDelete = await User.create({
      username: "todelete",
      email: "todelete@example.com",
      password: "password123",
      role: "user",
    })

    const userId = userToDelete.id
    await userToDelete.destroy({ force: true })

    const deletedUser = await User.findByPk(userId)
    expect(deletedUser).toBeNull()
  })
})
