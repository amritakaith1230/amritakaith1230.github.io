import axios from "axios"
import type { WeatherData, SearchHistoryItem } from "../types/weather"

const API_BASE_URL = "https://amritakaith1230-github-io-3.onrender.com"

export const weatherService = {
  getWeather: async (location: string): Promise<WeatherData> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/weather`, { location })
      return response.data
    } catch (error: any) {
      console.error("Weather API error:", error.message)
      throw error
    }
  },

  getLocationSuggestions: async (query?: string): Promise<string[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/weather/suggestions`, {
        params: { query },
      })
      return response.data.suggestions || []
    } catch (error) {
      console.error("Suggestions API error:", error)
      return []
    }
  },

  getSearchHistory: async (): Promise<SearchHistoryItem[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/weather/history`)
      return response.data || []
    } catch (error) {
      console.error("Search history API error:", error)
      return []
    }
  },
}
