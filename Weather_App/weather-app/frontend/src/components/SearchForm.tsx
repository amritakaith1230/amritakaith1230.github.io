"use client"

import type React from "react"
import { useState } from "react"
import AutocompleteInput from "./AutocompleteInput"

interface SearchFormProps {
  onSearch: (location: string) => void
  loading: boolean
  error?: string
  suggestions?: string[]
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, loading, error, suggestions }) => {
  const [location, setLocation] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (location.trim()) {
      onSearch(location.trim())
    }
  }

  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation)
    onSearch(selectedLocation)
  }

  const popularCities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Pune",
    "London",
    "New York",
    "Tokyo",
    "Paris",
    "Sydney",
    "Dubai",
  ]

  return (
    <div className="search-form">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <AutocompleteInput
            value={location}
            onChange={setLocation}
            onSelect={handleLocationSelect}
            placeholder="Enter city name (e.g., Mumbai, London, Tokyo)"
            disabled={loading}
            suggestions={suggestions}
            className="search-autocomplete"
          />

          <button type="submit" disabled={loading || !location.trim()} className="search-button">
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Searching...
              </>
            ) : (
              <>
                <span>🌤️</span>
                Get Weather
              </>
            )}
          </button>
        </div>
      </form>

      {/* Popular Cities Quick Access */}
      <div className="popular-cities">
        <span className="popular-label">Quick access:</span>
        {popularCities.map((city) => (
          <button key={city} onClick={() => handleLocationSelect(city)} className="city-tag" disabled={loading}>
            {city}
          </button>
        ))}
      </div>

      {/* Error Suggestions */}
      {error && suggestions && suggestions.length > 0 && (
        <div className="error-suggestions">
          <p className="error-suggestions-title">Did you mean:</p>
          <div className="error-suggestions-list">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleLocationSelect(suggestion.split(",")[0].trim())}
                className="error-suggestion-item"
                disabled={loading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchForm
