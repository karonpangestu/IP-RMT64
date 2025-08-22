const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const AuthService = require("../services/authService")
const { User } = require("../db")

// Register new user
router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user", // Default role
    })

    // Generate JWT
    const token = AuthService.generateJWT(user)

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
})

// Google Sign-In login
router.post("/google", async (req, res, next) => {
  try {
    const { credential } = req.body
    const authData = await AuthService.loginWithGoogle(credential)
    res.json(authData)
  } catch (error) {
    next(error)
  }
})

// Regular email/password login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Generate JWT
    const token = AuthService.generateJWT(user)

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
})

// Verify JWT token
router.post("/verify", async (req, res, next) => {
  try {
    const { token } = req.body
    const user = await AuthService.verifyToken(token)
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
