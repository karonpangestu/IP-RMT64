// Test-specific app setup
require("dotenv").config()
const express = require("express")
const cors = require("cors")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Only include auth routes for user testing
app.use("/api/auth", require("../routes/auth"))

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: err.message || "Something went wrong!" })
})

module.exports = app
