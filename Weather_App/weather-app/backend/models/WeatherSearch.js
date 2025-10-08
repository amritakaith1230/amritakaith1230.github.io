const mongoose = require('mongoose');

const weatherSearchSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  searchedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WeatherSearch', weatherSearchSchema);