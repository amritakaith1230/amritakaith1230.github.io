"use client"

import type React from "react"
import { useState, useEffect } from "react"
import SearchForm from "./components/SearchForm"
import WeatherCard from "./components/WeatherCard"
import ErrorMessage from "./components/ErrorMessage"
import { weatherService } from "./services/weatherService"
import type { WeatherData, WeatherError, SearchHistoryItem } from "./types/weather"
import "./App.css"

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])

  // Load search history on component mount
  useEffect(() => {
    loadSearchHistory()
  }, [])

  const loadSearchHistory = async () => {
    try {
      const history = await weatherService.getSearchHistory()
      setSearchHistory(history)
    } catch (error) {
      console.error("Failed to load search history:", error)
    }
  }

  const handleSearch = async (location: string) => {
    // Validate input before making API call
    if (!isValidInput(location)) {
      setError("No results found, please try another location.")
      setSuggestions([
        "Mumbai, Maharashtra, India",
        "Delhi, Delhi, India",
        "London, England, United Kingdom",
        "New York, New York, United States",
      ])
      return
    }

    setLoading(true)
    setError("")
    setSuggestions([])
    setWeatherData(null)

    try {
      const data = await weatherService.getWeather(location)
      setWeatherData(data)

      // Reload search history after successful search
      await loadSearchHistory()
    } catch (error: any) {
      console.error("Search error:", error)

      if (error.response?.data) {
        const errorData: WeatherError = error.response.data
        setError(errorData.error)
        if (errorData.suggestions) {
          setSuggestions(errorData.suggestions)
        }
      } else if (error.response?.status === 404) {
        setError("🌍 Location not found. Please check the spelling and try again.")
      } else if (error.response?.status === 401) {
        setError("🔑 API key issue. Please contact support.")
      } else {
        setError("⚠️ Failed to fetch weather data. Please try again later.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Input validation function
  const isValidInput = (input: string): boolean => {
    const trimmed = input.trim()

    // Check minimum length
    if (trimmed.length < 2) return false

    // Check if it contains only valid characters
    const validPattern = /^[a-zA-Z\s\-'.]+$/
    if (!validPattern.test(trimmed)) return false

    // Check vowel to consonant ratio
    const vowels = (trimmed.match(/[aeiouAEIOU]/g) || []).length
    const consonants = (trimmed.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length

    if (vowels === 0 || (consonants > 0 && vowels / consonants < 0.15)) return false

    // Check for repeated characters
    const repeatedPattern = /(.)\1{4,}/
    if (repeatedPattern.test(trimmed)) return false

    return true
  }

  return (
    <div className="App">
      {/* Animated Background */}
      <div className="background-animation">
        <div className="cloud cloud1"></div>
        <div className="cloud cloud2"></div>
        <div className="cloud cloud3"></div>
        <div className="floating-icon icon1">🌤️</div>
        <div className="floating-icon icon2">⛅</div>
        <div className="floating-icon icon3">🌧️</div>
      </div>

      <div className="container">
        {/* Header */}
        <header className="app-header">
          <div className="header-icon">🌍</div>
          <h1>Smart Weather Forecast</h1>
          <p>Get accurate weather data with intelligent search and suggestions</p>
          <div className="feature-badges">
            <span className="badge">🔍 Smart Search</span>
            <span className="badge">🌍 State Recognition</span>
            <span className="badge">📊 3-Day Forecast</span>
            <span className="badge">💾 Search History</span>
          </div>
        </header>

        {/* Search Form */}
        <SearchForm onSearch={handleSearch} loading={loading} error={error} suggestions={suggestions} />

        {/* Error Message */}
        {error && !suggestions.length && (
          <ErrorMessage
            message={error}
            onClose={() => setError("")}
            type={error.includes("No results found") ? "warning" : "error"}
          />
        )}

        {/* Weather Data */}
        {weatherData && <WeatherCard weatherData={weatherData} />}

        {/* Recent Searches */}
        {searchHistory.length > 0 && !loading && !weatherData && (
          <div className="recent-searches">
            <h3>🕒 Recent Searches</h3>
            <div className="recent-searches-grid">
              {searchHistory.slice(0, 6).map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(item.location.split(",")[0].trim())}
                  className="recent-search-item"
                  disabled={loading}
                >
                  <div className="recent-location">{item.location}</div>
                  <div className="recent-meta">
                    <span className="search-count">Searched {item.searchCount} times</span>
                    <span className="last-searched">{new Date(item.lastSearched).toLocaleDateString()}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading">
            <div className="weather-spinner">
              <div className="sun">☀️</div>
              <div className="cloud-loading">☁️</div>
            </div>
            <p>Fetching accurate weather data...</p>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
