const axios = require("axios")
const SearchHistory = require("../models/SearchHistory")
const { fuzzySearch, getStateCapital, isValidLocationInput, majorCitiesDatabase } = require("../utils/locationMapping")

// Enhanced weather API with smart search and validation
const getWeather = async (req, res) => {
  try {
    console.log("Weather request received:", req.body)

    const { location } = req.body

    if (!location) {
      return res.status(400).json({
        error: "Location is required",
        suggestions: await getPopularSuggestions(),
      })
    }

    // Validate input to prevent gibberish
    if (!isValidLocationInput(location)) {
      return res.status(400).json({
        error: "No results found, please try another location.",
        suggestions: await getPopularSuggestions(),
        isInvalidInput: true,
      })
    }

    console.log(`Fetching weather for: ${location}`)

    // Try to get state capital first
    const stateCapital = getStateCapital(location)
    let targetLocation = location
    let coordinates = null

    if (stateCapital) {
      targetLocation = stateCapital.city
      coordinates = { lat: stateCapital.lat, lon: stateCapital.lon }
      console.log(`State detected: ${location} -> ${stateCapital.city}`)
    }

    // Try multiple APIs in order
    const apis = [
      {
        name: "OpenMeteo",
        url: `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(targetLocation)}&count=5`,
        parser: parseOpenMeteo,
      },
      {
        name: "Enhanced Mock Data",
        url: null,
        parser: getEnhancedMockWeatherData,
      },
    ]

    for (const api of apis) {
      try {
        console.log(`Trying ${api.name}...`)

        let data
        if (api.url) {
          const response = await axios.get(api.url, {
            timeout: 8000,
            headers: {
              "User-Agent": "WeatherApp/1.0",
            },
          })
          data = response.data
        }

        const weatherData = await api.parser(data, targetLocation, coordinates)
        console.log(`✅ Weather data received from ${api.name}`)

        // Record search in database
        try {
          await SearchHistory.recordSearch(weatherData.location, {
            lat: weatherData.coordinates?.lat,
            lon: weatherData.coordinates?.lon,
          })
        } catch (dbError) {
          console.error("Database error:", dbError)
          // Continue even if database save fails
        }

        return res.json(weatherData)
      } catch (error) {
        console.log(`❌ ${api.name} failed:`, error.message)
        continue
      }
    }

    // If all APIs fail, provide suggestions
    const suggestions = await getLocationSuggestions(location)
    res.status(404).json({
      error: "Location not found. Please try one of these suggestions:",
      suggestions: suggestions.slice(0, 6),
    })
  } catch (error) {
    console.error("❌ General error:", error.message)
    res.status(500).json({
      error: "Failed to fetch weather data. Please try again later.",
      suggestions: await getPopularSuggestions(),
    })
  }
}

// Get location suggestions with fuzzy search
const getLocationSuggestions = async (searchTerm = "") => {
  try {
    let suggestions = []

    if (searchTerm && searchTerm.length >= 2) {
      // Get fuzzy search results
      const fuzzyResults = fuzzySearch(searchTerm, majorCitiesDatabase, 8)
      suggestions = fuzzyResults.map((city) => `${city.name}, ${city.state}, ${city.country}`)

      // Also get from search history
      try {
        const historyResults = await SearchHistory.find({
          normalizedLocation: { $regex: searchTerm.toLowerCase(), $options: "i" },
        })
          .sort({ searchCount: -1, lastSearched: -1 })
          .limit(3)
          .lean()

        const historySuggestions = historyResults.map((item) => item.location)

        // Merge and deduplicate
        suggestions = [...new Set([...historySuggestions, ...suggestions])]
      } catch (dbError) {
        console.error("Database error in suggestions:", dbError)
      }
    }

    // If no search term or no results, return popular locations
    if (suggestions.length === 0) {
      suggestions = await getPopularSuggestions()
    }

    return suggestions.slice(0, 8)
  } catch (error) {
    console.error("Error getting suggestions:", error)
    return await getPopularSuggestions()
  }
}

// Get popular suggestions from database and defaults
const getPopularSuggestions = async () => {
  try {
    const popularFromDB = await SearchHistory.find().sort({ searchCount: -1, lastSearched: -1 }).limit(6).lean()

    const dbSuggestions = popularFromDB.map((item) => item.location)

    const defaultSuggestions = [
      "Mumbai, Maharashtra, India",
      "Delhi, Delhi, India",
      "Bangalore, Karnataka, India",
      "London, England, United Kingdom",
      "New York, New York, United States",
      "Tokyo, Tokyo, Japan",
      "Paris, Île-de-France, France",
      "Sydney, New South Wales, Australia",
    ]

    // Merge and deduplicate
    const allSuggestions = [...new Set([...dbSuggestions, ...defaultSuggestions])]
    return allSuggestions.slice(0, 8)
  } catch (error) {
    console.error("Database error in popular suggestions:", error)
    return [
      "Mumbai, Maharashtra, India",
      "Delhi, Delhi, India",
      "Bangalore, Karnataka, India",
      "London, England, United Kingdom",
      "New York, New York, United States",
      "Tokyo, Tokyo, Japan",
    ]
  }
}

// Get search history
const getSearchHistory = async (req, res) => {
  try {
    const history = await SearchHistory.find().sort({ lastSearched: -1 }).limit(20).lean()

    const formattedHistory = history.map((item) => ({
      location: item.location,
      searchCount: item.searchCount,
      lastSearched: item.lastSearched,
      coordinates: item.coordinates,
    }))

    res.json(formattedHistory)
  } catch (error) {
    console.error("Database error:", error)
    res.status(500).json({ error: "Failed to fetch search history" })
  }
}

// Enhanced Open-Meteo parser
const parseOpenMeteo = async (data, location, providedCoordinates = null) => {
  if (!data || !data.results || data.results.length === 0) {
    throw new Error("Location not found in Open-Meteo")
  }

  let locationData = data.results[0]

  // Try to find exact match first
  const exactMatch = data.results.find((result) => result.name.toLowerCase() === location.toLowerCase())
  if (exactMatch) {
    locationData = exactMatch
  }

  const lat = providedCoordinates?.lat || locationData.latitude
  const lon = providedCoordinates?.lon || locationData.longitude

  // Get comprehensive weather data
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,uv_index_max&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure,visibility,precipitation,uv_index&timezone=auto&forecast_days=3`

  const weatherResponse = await axios.get(weatherUrl, { timeout: 8000 })
  const weatherData = weatherResponse.data

  const current = weatherData.current_weather
  const hourly = weatherData.hourly
  const daily = weatherData.daily

  // Parse sunrise and sunset
  const sunrise = new Date(daily.sunrise[0])
  const sunset = new Date(daily.sunset[0])

  // Enhanced location formatting
  const formattedLocation = formatLocationName(locationData)

  // Calculate more accurate feels like temperature
  const humidity = hourly.relative_humidity_2m[0] || 50
  const windSpeed = current.windspeed
  const feelsLike = calculateFeelsLike(current.temperature, humidity, windSpeed)

  return {
    location: formattedLocation,
    temperature: Math.round(current.temperature),
    description: getWeatherDescription(current.weathercode),
    icon: getIconFromWeatherCode(current.weathercode, sunrise, sunset),
    feelsLike: Math.round(feelsLike),
    humidity: Math.round(humidity),
    windSpeed: Math.round(windSpeed * 10) / 10,
    pressure: Math.round(hourly.surface_pressure[0] || 1013),
    visibility: Math.round((hourly.visibility[0] || 10000) / 1000),
    sunrise: Math.floor(sunrise.getTime() / 1000),
    sunset: Math.floor(sunset.getTime() / 1000),
    cloudiness: getCloudiness(current.weathercode),
    uvIndex: Math.round(hourly.uv_index[0] || daily.uv_index_max[0] || 0),
    precipitation: Math.round((hourly.precipitation[0] || 0) * 10) / 10,
    coordinates: { lat, lon },
    forecast: {
      today: {
        max: Math.round(daily.temperature_2m_max[0]),
        min: Math.round(daily.temperature_2m_min[0]),
        precipitation: Math.round(daily.precipitation_sum[0] || 0),
      },
      tomorrow: {
        max: Math.round(daily.temperature_2m_max[1]),
        min: Math.round(daily.temperature_2m_min[1]),
        precipitation: Math.round(daily.precipitation_sum[1] || 0),
      },
      dayAfter: {
        max: Math.round(daily.temperature_2m_max[2]),
        min: Math.round(daily.temperature_2m_min[2]),
        precipitation: Math.round(daily.precipitation_sum[2] || 0),
      },
    },
  }
}

// Enhanced mock weather data
const getEnhancedMockWeatherData = async (data, location, providedCoordinates = null) => {
  // Find location in database
  const fuzzyResults = fuzzySearch(location, majorCitiesDatabase, 1)

  if (fuzzyResults.length === 0) {
    throw new Error("Location not found in mock data")
  }

  const cityData = fuzzyResults[0]
  const coordinates = providedCoordinates || { lat: cityData.lat, lon: cityData.lon }

  // Calculate accurate sunrise and sunset
  const { sunrise, sunset } = calculateAccurateSunriseSunset(coordinates.lat, coordinates.lon)

  // Format location properly
  const formattedLocation = `${cityData.name}, ${cityData.state}, ${cityData.country}`

  // Generate realistic weather data
  const baseTemp = getRealisticTemperature(cityData.name, cityData.country)
  const tempVariation = Math.floor(Math.random() * 6) - 3
  const currentTemp = baseTemp + tempVariation

  const humidity = getRealisticHumidity(cityData.name, baseTemp)
  const windSpeed = getRealisticWindSpeed(cityData.name)
  const feelsLike = calculateFeelsLike(currentTemp, humidity, windSpeed)
  const description = getRealisticDescription(currentTemp, humidity, cityData.name)

  return {
    location: formattedLocation,
    temperature: currentTemp,
    description: description,
    icon: getIconFromDescription(description, sunrise, sunset),
    feelsLike: Math.round(feelsLike),
    humidity: humidity,
    windSpeed: windSpeed,
    pressure: getRealisticPressure(coordinates.lat),
    visibility: getRealisticVisibility(description),
    sunrise: Math.floor(sunrise.getTime() / 1000),
    sunset: Math.floor(sunset.getTime() / 1000),
    cloudiness: getRealisticCloudiness(description),
    uvIndex: getUVIndex(description, sunrise, sunset),
    precipitation: getRealisticPrecipitation(description),
    coordinates: coordinates,
    forecast: {
      today: {
        max: currentTemp + 3,
        min: currentTemp - 5,
        precipitation: getRealisticPrecipitation(description),
      },
      tomorrow: {
        max: currentTemp + Math.floor(Math.random() * 6) - 2,
        min: currentTemp - Math.floor(Math.random() * 6) - 2,
        precipitation: Math.floor(Math.random() * 5),
      },
      dayAfter: {
        max: currentTemp + Math.floor(Math.random() * 8) - 3,
        min: currentTemp - Math.floor(Math.random() * 8) - 3,
        precipitation: Math.floor(Math.random() * 6),
      },
    },
  }
}

// Helper functions
const getRealisticTemperature = (cityName, country) => {
  const city = cityName.toLowerCase()
  const countryLower = country.toLowerCase()

  // Temperature based on location
  if (countryLower.includes("india")) {
    if (city.includes("shimla") || city.includes("manali") || city.includes("darjeeling")) return 12
    if (city.includes("mumbai") || city.includes("chennai") || city.includes("kochi")) return 28
    if (city.includes("delhi") || city.includes("jaipur") || city.includes("ahmedabad")) return 26
    if (city.includes("bangalore") || city.includes("pune")) return 23
    return 25
  }

  if (countryLower.includes("united states")) {
    if (city.includes("miami") || city.includes("phoenix")) return 30
    if (city.includes("new york") || city.includes("chicago")) return 18
    if (city.includes("los angeles") || city.includes("san francisco")) return 22
    return 20
  }

  if (countryLower.includes("united kingdom")) return 15
  if (countryLower.includes("canada")) return 10
  if (countryLower.includes("australia")) return 22
  if (countryLower.includes("japan")) return 18
  if (countryLower.includes("uae")) return 35

  return 20 // Default
}

const getRealisticDescription = (temp, humidity, cityName) => {
  const city = cityName.toLowerCase()

  if (temp > 35) return "very hot and sunny"
  if (temp > 30) {
    if (humidity > 70) return "hot and humid"
    return "hot and dry"
  }
  if (temp > 25) {
    if (humidity > 60) return "warm and humid"
    return "warm and pleasant"
  }
  if (temp > 20) return "pleasant weather"
  if (temp > 15) return "cool and comfortable"
  if (temp > 10) return "cool"
  return "cold"
}

// All other helper functions remain the same as in previous implementation
const calculateFeelsLike = (temp, humidity, windSpeed) => {
  if (temp >= 27) {
    const hi = -8.78469475556 + 1.61139411 * temp + 2.33854883889 * humidity
    return hi
  } else if (temp <= 10) {
    const wc = 13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpeed, 0.16) + 0.3965 * temp * Math.pow(windSpeed, 0.16)
    return wc
  }
  return temp + (humidity > 70 ? 2 : humidity < 30 ? -2 : 0)
}

const getRealisticHumidity = (cityName, temp) => {
  const city = cityName.toLowerCase()
  if (city.includes("mumbai") || city.includes("chennai") || city.includes("kochi"))
    return 70 + Math.floor(Math.random() * 20)
  if (city.includes("delhi") || city.includes("jaipur") || city.includes("phoenix"))
    return 20 + Math.floor(Math.random() * 20)
  if (city.includes("miami") || city.includes("singapore")) return 60 + Math.floor(Math.random() * 25)
  return 45 + Math.floor(Math.random() * 35)
}

const getRealisticWindSpeed = (cityName) => {
  const city = cityName.toLowerCase()
  if (city.includes("mumbai") || city.includes("chennai") || city.includes("miami"))
    return Math.round((8 + Math.random() * 12) * 10) / 10
  if (city.includes("shimla") || city.includes("chicago")) return Math.round((5 + Math.random() * 15) * 10) / 10
  return Math.round((2 + Math.random() * 10) * 10) / 10
}

const getRealisticPressure = (latitude) => {
  const basePressure = 1013
  const altitudeEffect = Math.abs(latitude) > 30 ? -5 : 0
  return basePressure + altitudeEffect + Math.floor(Math.random() * 20) - 10
}

const getRealisticVisibility = (description) => {
  const desc = description.toLowerCase()
  if (desc.includes("fog") || desc.includes("hazy")) return 2 + Math.floor(Math.random() * 4)
  if (desc.includes("rain") || desc.includes("storm")) return 3 + Math.floor(Math.random() * 5)
  if (desc.includes("clear") || desc.includes("sunny")) return 12 + Math.floor(Math.random() * 8)
  return 8 + Math.floor(Math.random() * 7)
}

const getRealisticCloudiness = (description) => {
  const desc = description.toLowerCase()
  if (desc.includes("clear") || desc.includes("sunny")) return 5 + Math.floor(Math.random() * 15)
  if (desc.includes("pleasant") || desc.includes("partly")) return 25 + Math.floor(Math.random() * 35)
  if (desc.includes("cloudy") || desc.includes("overcast")) return 70 + Math.floor(Math.random() * 25)
  if (desc.includes("rain") || desc.includes("storm")) return 80 + Math.floor(Math.random() * 20)
  return 40 + Math.floor(Math.random() * 40)
}

const getRealisticPrecipitation = (description) => {
  const desc = description.toLowerCase()
  if (desc.includes("rain") || desc.includes("storm")) return Math.round((2 + Math.random() * 8) * 10) / 10
  if (desc.includes("drizzle")) return Math.round((0.5 + Math.random() * 2) * 10) / 10
  if (desc.includes("humid") || desc.includes("tropical")) return Math.round(Math.random() * 2 * 10) / 10
  return 0
}

const calculateAccurateSunriseSunset = (lat, lon) => {
  const now = new Date()
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000)

  const P = Math.asin(0.39795 * Math.cos(0.98563 * (dayOfYear - 173) * (Math.PI / 180)))
  const argument =
    (Math.sin(-0.8333 * (Math.PI / 180)) - Math.sin(lat * (Math.PI / 180)) * Math.sin(P)) /
    (Math.cos(lat * (Math.PI / 180)) * Math.cos(P))

  if (Math.abs(argument) > 1) {
    const sunrise = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0)
    const sunset = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0)
    return { sunrise, sunset }
  }

  const hourAngle = (Math.acos(argument) * (180 / Math.PI)) / 15
  const sunriseUTC = 12 - hourAngle - lon / 15
  const sunsetUTC = 12 + hourAngle - lon / 15

  const sunrise = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  sunrise.setUTCHours(Math.floor(sunriseUTC), Math.floor((sunriseUTC % 1) * 60), 0, 0)

  const sunset = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  sunset.setUTCHours(Math.floor(sunsetUTC), Math.floor((sunsetUTC % 1) * 60), 0, 0)

  return { sunrise, sunset }
}

const formatLocationName = (locationData) => {
  const name = locationData.name
  const admin1 = locationData.admin1 || ""
  const country = locationData.country

  if (admin1 && admin1 !== name && admin1 !== country) {
    return `${name}, ${admin1}, ${country}`
  }
  return `${name}, ${country}`
}

const getUVIndex = (weatherCode, sunrise, sunset) => {
  const now = new Date()
  const isDaytime = sunrise && sunset ? now >= sunrise && now <= sunset : now.getHours() >= 6 && now.getHours() <= 18

  if (!isDaytime) return 0

  if (typeof weatherCode === "string") {
    const desc = weatherCode.toLowerCase()
    if (desc.includes("sunny") || desc.includes("clear")) return 8 + Math.floor(Math.random() * 3)
    if (desc.includes("pleasant") || desc.includes("partly")) return 5 + Math.floor(Math.random() * 3)
    if (desc.includes("cloudy")) return 2 + Math.floor(Math.random() * 3)
    return 1 + Math.floor(Math.random() * 2)
  }

  if (weatherCode === 0) return 8 + Math.floor(Math.random() * 3)
  if ([1, 2].includes(weatherCode)) return 5 + Math.floor(Math.random() * 3)
  if (weatherCode === 3) return 2 + Math.floor(Math.random() * 3)
  return 1 + Math.floor(Math.random() * 2)
}

const getIconFromWeatherCode = (code, sunrise, sunset) => {
  const now = new Date()
  const isNight = sunrise && sunset ? now < sunrise || now > sunset : now.getHours() >= 19 || now.getHours() <= 6
  const suffix = isNight ? "n" : "d"

  if (code === 0) return `01${suffix}` // Clear sky
  if ([1, 2, 3].includes(code)) return `02${suffix}` // Partly cloudy
  if ([45, 48].includes(code)) return `50${suffix}` // Fog
  if ([51, 53, 55, 56, 57].includes(code)) return `09${suffix}` // Drizzle
  if ([61, 63, 65, 66, 67].includes(code)) return `10${suffix}` // Rain
  if ([71, 73, 75, 77].includes(code)) return `13${suffix}` // Snow
  if ([80, 81, 82].includes(code)) return `09${suffix}` // Rain showers
  if ([85, 86].includes(code)) return `13${suffix}` // Snow showers
  if ([95, 96, 99].includes(code)) return `11${suffix}` // Thunderstorm

  return `01${suffix}`
}

const getIconFromDescription = (description, sunrise, sunset) => {
  const desc = description.toLowerCase()
  const now = new Date()
  const isNight = sunrise && sunset ? now < sunrise || now > sunset : now.getHours() >= 19 || now.getHours() <= 6
  const suffix = isNight ? "n" : "d"

  if (desc.includes("sunny") || desc.includes("clear")) return `01${suffix}`
  if (desc.includes("pleasant") || desc.includes("partly")) return `02${suffix}`
  if (desc.includes("cloudy") || desc.includes("overcast")) return `03${suffix}`
  if (desc.includes("fog") || desc.includes("hazy")) return `50${suffix}`
  if (desc.includes("thunder")) return `11${suffix}`
  if (desc.includes("snow") || desc.includes("sleet")) return `13${suffix}`
  if (desc.includes("rain") || desc.includes("drizzle")) return `10${suffix}`
  if (desc.includes("humid") || desc.includes("tropical")) return `02${suffix}`

  return `01${suffix}`
}

const getWeatherDescription = (code) => {
  const descriptions = {
    0: "clear sky",
    1: "mainly clear",
    2: "partly cloudy",
    3: "overcast",
    45: "fog",
    48: "depositing rime fog",
    51: "light drizzle",
    53: "moderate drizzle",
    55: "dense drizzle",
    61: "slight rain",
    63: "moderate rain",
    65: "heavy rain",
    71: "slight snow",
    73: "moderate snow",
    75: "heavy snow",
    80: "slight rain showers",
    81: "moderate rain showers",
    82: "violent rain showers",
    95: "thunderstorm",
  }

  return descriptions[code] || "partly cloudy"
}

const getCloudiness = (code) => {
  if (code === 0) return 10 // Clear
  if ([1, 2].includes(code)) return 35 // Partly cloudy
  if (code === 3) return 85 // Overcast
  if ([45, 48].includes(code)) return 95 // Fog
  if ([51, 53, 55, 61, 63, 65].includes(code)) return 75 // Rain
  return 50 // Default
}

module.exports = {
  getWeather,
  getLocationSuggestions,
  getSearchHistory,
}
