const express = require("express")
const { getWeather, getLocationSuggestions, getSearchHistory } = require("../controllers/weatherController")

const router = express.Router()

router.post("/", getWeather)
router.get("/suggestions", async (req, res) => {
  try {
    const { query } = req.query
    const { getLocationSuggestions } = require("../controllers/weatherController")
    const suggestions = await getLocationSuggestions(query)
    res.json({ suggestions })
  } catch (error) {
    console.error("Suggestions error:", error)
    res.json({ suggestions: [] })
  }
})
router.get("/history", getSearchHistory)

module.exports = router
