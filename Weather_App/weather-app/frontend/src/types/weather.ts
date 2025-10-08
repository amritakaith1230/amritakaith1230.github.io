export interface WeatherData {
  location: string
  temperature: number
  description: string
  icon: string
  feelsLike: number
  humidity: number
  windSpeed: number
  pressure: number
  visibility?: number
  sunrise?: number
  sunset?: number
  cloudiness?: number
  uvIndex?: number
  precipitation?: number
  coordinates?: {
    lat: number
    lon: number
  }
  forecast?: {
    today: {
      max: number
      min: number
      precipitation: number
    }
    tomorrow: {
      max: number
      min: number
      precipitation: number
    }
    dayAfter?: {
      max: number
      min: number
      precipitation: number
    }
  }
}

export interface SearchHistoryItem {
  location: string
  searchCount: number
  lastSearched: string
  coordinates?: {
    lat: number
    lon: number
  }
}

export interface LocationSuggestion {
  name: string
  country: string
  state?: string
}

export interface WeatherError {
  error: string
  suggestions?: string[]
  isInvalidInput?: boolean
}

export interface AutocompleteOption {
  label: string
  value: string
  type: "history" | "suggestion" | "popular"
}
