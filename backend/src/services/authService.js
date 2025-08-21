const { OAuth2Client } = require("google-auth-library")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { User } = require("../db")

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

class AuthService {
  static async verifyGoogleToken(token) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      })
      return ticket.getPayload()
    } catch (error) {
      throw new Error("Invalid Google token")
    }
  }

  static generateJWT(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    )
  }

  static async registerUser(userData) {
    try {
      // Check if user exists
      const existingUser = await User.findOne({
        where: { email: userData.email },
      })

      if (existingUser) {
        throw new Error("Email already registered")
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10)

      // Create user
      const user = await User.create({
        ...userData,
        password: hashedPassword,
        role: "user", // Default role
      })

      // Generate JWT
      const token = this.generateJWT(user)

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      }
    } catch (error) {
      throw error
    }
  }

  static async loginWithGoogle(googleToken) {
    try {
      // Verify Google token
      const payload = await this.verifyGoogleToken(googleToken)

      // Find or create user
      const [user] = await User.findOrCreate({
        where: { email: payload.email },
        defaults: {
          username: payload.name,
          email: payload.email,
          password: await bcrypt.hash(Math.random().toString(36), 10), // Random secure password
          role: "user",
        },
      })

      // Generate JWT
      const token = this.generateJWT(user)

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      }
    } catch (error) {
      throw error
    }
  }

  static async loginWithEmail(email, password) {
    try {
      // Find user
      const user = await User.findOne({ where: { email } })
      if (!user) {
        throw new Error("Invalid credentials")
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        throw new Error("Invalid credentials")
      }

      // Generate JWT
      const token = this.generateJWT(user)

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      }
    } catch (error) {
      throw error
    }
  }

  static async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findByPk(decoded.id)

      if (!user) {
        throw new Error("User not found")
      }

      return user
    } catch (error) {
      throw new Error("Invalid token")
    }
  }
}

module.exports = AuthService
