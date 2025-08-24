require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { sequelize } = require("./db")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/episodes", require("./routes/episodes")) // This will handle all /api/episodes routes

// Error handler
app.use(require("./middleware/errorHandler"))

const PORT = process.env.PORT || 3000

// Only start server if not in test environment
if (process.env.NODE_ENV !== "test") {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Database connection established.")
      // Sync database in development
      if (process.env.NODE_ENV === "development") {
        return sequelize.sync({ alter: true })
      }
    })
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
      })
    })
    .catch((err) => {
      console.error("Unable to connect to database:", err)
    })
}

module.exports = app
