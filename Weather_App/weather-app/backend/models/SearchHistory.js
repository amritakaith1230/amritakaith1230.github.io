const mongoose = require("mongoose")

const SearchHistorySchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
    trim: true,
  },
  normalizedLocation: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  coordinates: {
    lat: Number,
    lon: Number,
  },
  searchCount: {
    type: Number,
    default: 1,
  },
  lastSearched: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Create indexes for better performance
SearchHistorySchema.index({ normalizedLocation: 1 })
SearchHistorySchema.index({ lastSearched: -1 })
SearchHistorySchema.index({ searchCount: -1 })

// Update search count and timestamp when location is searched again
SearchHistorySchema.statics.recordSearch = async function (location, coordinates = null) {
  try {
    const normalizedLocation = location.toLowerCase().trim()

    const existingSearch = await this.findOne({ normalizedLocation })

    if (existingSearch) {
      existingSearch.searchCount += 1
      existingSearch.lastSearched = new Date()
      if (coordinates) {
        existingSearch.coordinates = coordinates
      }
      return await existingSearch.save()
    } else {
      return await this.create({
        location,
        normalizedLocation,
        coordinates,
      })
    }
  } catch (error) {
    console.error("Database error in recordSearch:", error)
    return null
  }
}

module.exports = mongoose.models.SearchHistory || mongoose.model("SearchHistory", SearchHistorySchema)
