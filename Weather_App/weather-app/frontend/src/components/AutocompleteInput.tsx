"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useDebounce } from "../hooks/useDebounce"
import { weatherService } from "../services/weatherService"
import type { AutocompleteOption } from "../types/weather"

interface AutocompleteInputProps {
  value: string
  onChange: (value: string) => void
  onSelect: (value: string) => void
  placeholder?: string
  disabled?: boolean
  suggestions?: string[]
  className?: string
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = "Enter city name...",
  disabled = false,
  suggestions = [],
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<AutocompleteOption[]>([])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const debouncedValue = useDebounce(value, 300)

  // Load suggestions when debounced value changes
  useEffect(() => {
    if (debouncedValue.length >= 2) {
      loadSuggestions(debouncedValue)
    } else if (debouncedValue.length === 0) {
      loadPopularSuggestions()
    } else {
      setOptions([])
      setIsOpen(false)
    }
  }, [debouncedValue])

  // Load suggestions from error response
  useEffect(() => {
    if (suggestions.length > 0) {
      const errorSuggestions: AutocompleteOption[] = suggestions.map((suggestion) => ({
        label: suggestion,
        value: suggestion,
        type: "suggestion",
      }))
      setOptions(errorSuggestions)
      setIsOpen(true)
    }
  }, [suggestions])

  const loadSuggestions = async (query: string) => {
    setIsLoading(true)
    try {
      const [suggestionResults, historyResults] = await Promise.all([
        weatherService.getLocationSuggestions(query),
        weatherService.getSearchHistory(),
      ])

      const suggestionOptions: AutocompleteOption[] = suggestionResults.map((suggestion) => ({
        label: suggestion,
        value: suggestion,
        type: "suggestion",
      }))

      const historyOptions: AutocompleteOption[] = historyResults
        .filter((item) => item.location.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3)
        .map((item) => ({
          label: `${item.location} (searched ${item.searchCount} times)`,
          value: item.location,
          type: "history",
        }))

      const allOptions = [...historyOptions, ...suggestionOptions]
      setOptions(allOptions.slice(0, 8))
      setIsOpen(allOptions.length > 0)
      setHighlightedIndex(-1)
    } catch (error) {
      console.error("Error loading suggestions:", error)
      setOptions([])
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const loadPopularSuggestions = async () => {
    try {
      const [suggestionResults, historyResults] = await Promise.all([
        weatherService.getLocationSuggestions(),
        weatherService.getSearchHistory(),
      ])

      const historyOptions: AutocompleteOption[] = historyResults.slice(0, 4).map((item) => ({
        label: `${item.location} (recent)`,
        value: item.location,
        type: "history",
      }))

      const popularOptions: AutocompleteOption[] = suggestionResults.slice(0, 4).map((suggestion) => ({
        label: suggestion,
        value: suggestion,
        type: "popular",
      }))

      const allOptions = [...historyOptions, ...popularOptions]
      setOptions(allOptions.slice(0, 6))
    } catch (error) {
      console.error("Error loading popular suggestions:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setHighlightedIndex(-1)
  }

  const handleInputFocus = () => {
    if (options.length > 0) {
      setIsOpen(true)
    } else if (value.length === 0) {
      loadPopularSuggestions()
      setIsOpen(true)
    }
  }

  const handleInputBlur = () => {
    // Delay hiding to allow clicks on options
    setTimeout(() => setIsOpen(false), 200)
  }

  const handleOptionClick = (option: AutocompleteOption) => {
    // Extract city name from formatted suggestion
    const cityName = option.value.split(",")[0].trim()
    onChange(cityName)
    onSelect(cityName)
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1))
        break
      case "Enter":
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          handleOptionClick(options[highlightedIndex])
        } else if (value.trim()) {
          onSelect(value.trim())
          setIsOpen(false)
        }
        break
      case "Escape":
        setIsOpen(false)
        setHighlightedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const getOptionIcon = (type: AutocompleteOption["type"]) => {
    switch (type) {
      case "history":
        return "🕒"
      case "popular":
        return "⭐"
      case "suggestion":
        return "📍"
      default:
        return "📍"
    }
  }

  return (
    <div className={`autocomplete-container ${className}`}>
      <div className="input-wrapper">
        <span className="input-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="location-input"
          autoComplete="off"
        />
        {isLoading && (
          <div className="loading-indicator">
            <div className="spinner-small"></div>
          </div>
        )}
      </div>

      {isOpen && options.length > 0 && (
        <ul ref={listRef} className="autocomplete-dropdown">
          {options.map((option, index) => (
            <li
              key={`${option.type}-${index}`}
              className={`autocomplete-option ${index === highlightedIndex ? "highlighted" : ""}`}
              onClick={() => handleOptionClick(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <span className="option-icon">{getOptionIcon(option.type)}</span>
              <span className="option-text">{option.label}</span>
              <span className={`option-type ${option.type}`}>
                {option.type === "history" ? "Recent" : option.type === "popular" ? "Popular" : "Suggestion"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AutocompleteInput
