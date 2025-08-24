const AuthService = require("../services/authService")

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const user = await AuthService.verifyToken(token)
    req.user = user // Attach user to request object
    next()
  } catch (error) {
    res.status(401).json({ message: "Invalid token" })
  }
}
