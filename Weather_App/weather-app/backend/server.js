const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const { connectToDatabase } = require("./libs/mongodb")
const weatherRoutes = require("./routes/weatherRoutes")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  }),
)
app.use(express.json())

// Database connection
connectToDatabase().catch(console.error)

// Routes
app.use("/api/weather", weatherRoutes)

app.get("/", (req, res) => {
  res.json({
    message: "Enhanced Weather App API is running!",
    features: [
      "Smart Search with Fuzzy Matching",
      "State Recognition",
      "MongoDB Integration",
      "Search History",
      "Auto-suggestions",
    ],
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err)
  res.status(500).json({ error: "Something went wrong!" })
})

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
  console.log(`📡 API URL: http://localhost:${PORT}`)
  console.log(`🌟 Enhanced features: Smart Search, State Recognition, MongoDB Integration`)
})

