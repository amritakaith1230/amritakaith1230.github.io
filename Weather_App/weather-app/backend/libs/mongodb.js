const mongoose = require("mongoose")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/weather-app"

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB Connected Successfully")
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error("❌ MongoDB Connection Error:", e)
    // Continue without database for demo purposes
    console.log("⚠️ Continuing without database...")
  }

  return cached.conn
}

module.exports = { connectToDatabase }
