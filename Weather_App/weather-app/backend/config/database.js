const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("❌ Database connection error:", error.message)
    // Don't exit process, continue without database
    console.log("⚠️  Continuing without database...")
  }
}

module.exports = connectDB
