const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/database")
const transactionRoutes = require("./routes/transactions")

// Load environment variables
dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/transactions", transactionRoutes)

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "🎉 Welcome to Expense Tracker API!",
    version: "1.0.0",
    endpoints: {
      transactions: "/api/transactions",
      summary: "/api/transactions/summary",
    },
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Expense Tracker API is ready!`)
  console.log(`🌐 Visit: http://localhost:${PORT}`)
})
