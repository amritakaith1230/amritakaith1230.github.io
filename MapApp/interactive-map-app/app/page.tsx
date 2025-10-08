"use client"

import { useState, useEffect, useRef, type KeyboardEvent } from "react"
import dynamic from "next/dynamic"
import { Search, MapPin, Filter, Navigation, Layers, Sun, Moon, Share, Route, Cloud, Compass, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import { getLocationImageByCategory } from "@/lib/image-service"

// Dynamic import to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("./components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 dark:border-blue-500 mx-auto mb-6"></div>
        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Loading Interactive Map...</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Please wait while we prepare your experience</p>
      </div>
    </div>
  ),
})

export interface Location {
  id: number
  name: string
  category: string
  lat: number
  lng: number
  description: string
  image: string
  address: string
  rating: number
  distance?: number
}

export interface SearchResult {
  display_name: string
  lat: string
  lon: string
  place_id: string
  type: string
  importance?: number
  category?: string
}

export interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
}

const locations: Location[] = [
  {
    id: 1,
    name: "Red Fort (Lal Qila)",
    category: "Historical",
    lat: 28.6562,
    lng: 77.241,
    description: "A historic fortified palace of the Mughal emperors, UNESCO World Heritage Site.",
    image: "/placeholder.svg?height=200&width=300",
    address: "Netaji Subhash Marg, Lal Qila, Chandni Chowk, New Delhi",
    rating: 4.5,
  },
  {
    id: 2,
    name: "India Gate",
    category: "Monument",
    lat: 28.6129,
    lng: 77.2295,
    description: "War memorial dedicated to Indian soldiers who died in World War I.",
    image: "/placeholder.svg?height=200&width=300",
    address: "Rajpath, India Gate, New Delhi",
    rating: 4.6,
  },
  {
    id: 3,
    name: "Lotus Temple",
    category: "Religious",
    lat: 28.5535,
    lng: 77.2588,
    description: "Bahá'í House of Worship known for its flowerlike shape and architectural beauty.",
    image: "/placeholder.svg?height=200&width=300",
    address: "Lotus Temple Rd, Bahapur, Shambhu Dayal Bagh, Kalkaji, New Delhi",
    rating: 4.4,
  },
  {
    id: 4,
    name: "Connaught Place",
    category: "Shopping",
    lat: 28.6315,
    lng: 77.2167,
    description: "One of the largest commercial and financial centers in New Delhi.",
    image: "/placeholder.svg?height=200&width=300",
    address: "Connaught Place, New Delhi",
    rating: 4.2,
  },
  {
    id: 5,
    name: "Humayun's Tomb",
    category: "Historical",
    lat: 28.5933,
    lng: 77.2507,
    description: "Tomb of the Mughal Emperor Humayun, UNESCO World Heritage Site.",
    image: "/placeholder.svg?height=200&width=300",
    address: "Mathura Rd, Nizamuddin, New Delhi",
    rating: 4.3,
  },
  {
    id: 6,
    name: "Qutub Minar",
    category: "Historical",
    lat: 28.5245,
    lng: 77.1855,
    description: "A minaret and victory tower, part of the Qutb complex, UNESCO World Heritage Site.",
    image: "/placeholder.svg?height=200&width=300",
    address: "Seth Sarai, Mehrauli, New Delhi",
    rating: 4.4,
  },
  {
    id: 7,
    name: "Chandni Chowk",
    category: "Shopping",
    lat: 28.6506,
    lng: 77.2334,
    description: "One of the oldest and busiest markets in Old Delhi.",
    image: "/placeholder.svg?height=200&width=300",
    address: "Chandni Chowk, New Delhi",
    rating: 4.1,
  },
]

const categories = ["All", "Historical", "Monument", "Religious", "Shopping"]

const mapTypes = [
  { id: "streets", name: "Streets", url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" },
  {
    id: "satellite",
    name: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  },
  { id: "terrain", name: "Terrain", url: "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg" },
  { id: "topo", name: "Topographic", url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" },
]

// Popular Indian cities with their coordinates for quick search
const popularCities = [
  { name: "Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
]

export default function InteractiveMap() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [filteredLocations, setFilteredLocations] = useState<Location[]>(locations)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [mapType, setMapType] = useState("streets")
  const [darkMode, setDarkMode] = useState(false)
  const [showWeather, setShowWeather] = useState(false)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [routingMode, setRoutingMode] = useState(false)
  const [routeStart, setRouteStart] = useState<{ lat: number; lng: number } | null>(null)
  const [routeEnd, setRouteEnd] = useState<{ lat: number; lng: number } | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [showPopularCities, setShowPopularCities] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Filter locations based on search and category
  useEffect(() => {
    let filtered = locations

    if (selectedCategory !== "All") {
      filtered = filtered.filter((location) => location.category === selectedCategory)
    }

    if (searchTerm && !showSearchResults) {
      filtered = filtered.filter(
        (location) =>
          location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Calculate distances if user location is available
    if (userLocation) {
      filtered = filtered.map((location) => ({
        ...location,
        distance: calculateDistance(userLocation.lat, userLocation.lng, location.lat, location.lng),
      }))
    }

    setFilteredLocations(filtered)
  }, [searchTerm, selectedCategory, userLocation, showSearchResults])

  // Handle click outside search container to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
        setShowPopularCities(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return Math.round(R * c * 100) / 100 // Round to 2 decimal places
  }

  // Search for any location using Nominatim API
  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in&addressdetails=1`,
      )
      const data = await response.json()

      // Add category based on type
      const enhancedData = data.map((item: any) => {
        let category = "Place"
        if (item.type === "city" || item.type === "administrative") {
          category = "City"
        } else if (item.type === "village" || item.type === "hamlet") {
          category = "Village"
        } else if (item.type === "natural" || item.type === "water") {
          category = "Natural"
        } else if (item.type === "building" || item.type === "historic") {
          category = "Building"
        }
        return { ...item, category }
      })

      setSearchResults(enhancedData)
      setShowSearchResults(true)
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Search Error",
        description: "Unable to search locations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  // Handle search input with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.length > 2) {
        searchLocation(searchTerm)
      } else {
        setSearchResults([])
        setShowSearchResults(false)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Get user's current location with better accuracy
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Getting Location",
      description: "Please wait while we find your location...",
    })

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setUserLocation(newLocation)
        toast({
          title: "Location Found",
          description: `Accuracy: ${Math.round(position.coords.accuracy)}m`,
        })

        // Get weather for current location
        if (showWeather) {
          getWeather(newLocation.lat, newLocation.lng)
        }
      },
      (error) => {
        console.error("Error getting location:", error)
        toast({
          title: "Location Error",
          description: "Unable to get your location. Please check permissions.",
          variant: "destructive",
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  // Get weather data (mock implementation - replace with real API)
  const getWeather = async (lat: number, lng: number) => {
    // Mock weather data - replace with real weather API
    const mockWeather: WeatherData = {
      temperature: Math.round(Math.random() * 20 + 20), // 20-40°C
      condition: ["Sunny", "Cloudy", "Rainy", "Clear"][Math.floor(Math.random() * 4)],
      humidity: Math.round(Math.random() * 40 + 40), // 40-80%
      windSpeed: Math.round(Math.random() * 20 + 5), // 5-25 km/h
    }
    setWeather(mockWeather)
  }

  // Share location
  const shareLocation = async (location: Location | null) => {
    if (!location) return

    const shareData = {
      title: location.name,
      text: `Check out ${location.name} - ${location.description}`,
      url: `${window.location.origin}?lat=${location.lat}&lng=${location.lng}`,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareData.url)
      toast({
        title: "Link Copied",
        description: "Location link copied to clipboard!",
      })
    }
  }

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location)
    setShowSearchResults(false)
  }

  const handleSearchResultSelect = async (result: SearchResult) => {
    setIsSearching(true)

    try {
      // Get image for the location based on category
      const imageUrl = getLocationImageByCategory(result.category || "Place")

      const newLocation: Location = {
        id: Date.now(),
        name: result.display_name.split(",")[0],
        category: result.category || "Place",
        lat: Number.parseFloat(result.lat),
        lng: Number.parseFloat(result.lon),
        description: result.display_name,
        image: imageUrl,
        address: result.display_name,
        rating: 0,
      }

      setSelectedLocation(newLocation)
      setSearchTerm(result.display_name.split(",")[0])
      setShowSearchResults(false)

      toast({
        title: "Location Found",
        description: `Showing ${newLocation.name} on the map`,
      })
    } catch (error) {
      console.error("Error processing search result:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchSubmit = () => {
    if (searchTerm.length > 2) {
      searchLocation(searchTerm)
    } else {
      toast({
        title: "Search Too Short",
        description: "Please enter at least 3 characters to search",
      })
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit()
    }
  }

  const handlePopularCitySelect = (city: { name: string; lat: number; lng: number }) => {
    const newLocation: Location = {
      id: Date.now(),
      name: city.name,
      category: "City",
      lat: city.lat,
      lng: city.lng,
      description: `${city.name} is one of the major cities in India.`,
      image: getLocationImageByCategory("City"),
      address: city.name + ", India",
      rating: 0,
    }

    setSelectedLocation(newLocation)
    setSearchTerm(city.name)
    setShowPopularCities(false)
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 p-4 ${darkMode ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-blue-50 to-indigo-100"}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className={`text-4xl font-bold mb-2 flex items-center justify-center gap-3 ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            <MapPin className={`${darkMode ? "text-blue-400" : "text-blue-600"} h-8 w-8`} />
            <span
              className={`${darkMode ? "bg-gradient-to-r from-blue-400 to-purple-400" : "bg-gradient-to-r from-blue-600 to-purple-600"} text-transparent bg-clip-text`}
            >
              Interactive Map Explorer
            </span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto mt-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Explore locations across India with detailed information and interactive features
          </p>
        </div>

        {/* Controls */}
        <Card
          className={`mb-6 overflow-visible ${
            darkMode
              ? "bg-gray-800/90 border-gray-700 backdrop-blur-sm shadow-xl"
              : "bg-white/90 backdrop-blur-sm shadow-lg border-t border-l border-white/20"
          }`}
        >
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 w-full" ref={searchContainerRef}>
                <div className="flex">
                  <div className="relative flex-1">
                    <Search
                      className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                        darkMode ? "text-blue-400" : "text-blue-500"
                      } h-5 w-5`}
                    />
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search any city, village, or landmark in India..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setShowPopularCities(true)}
                      className={cn(
                        "pl-12 pr-4 py-6 text-lg rounded-l-lg border-2 transition-all duration-300",
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                          : "border-gray-200 focus:border-blue-500",
                        "focus:ring-2 focus:ring-blue-500/20",
                      )}
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div
                          className={`animate-spin rounded-full h-5 w-5 border-b-2 ${darkMode ? "border-blue-400" : "border-blue-600"}`}
                        ></div>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleSearchSubmit}
                    className={cn(
                      "rounded-r-lg px-6 h-auto",
                      darkMode
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
                      "text-white font-medium text-lg",
                    )}
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </div>

                {/* Popular Cities */}
                {showPopularCities && searchTerm.length === 0 && (
                  <div
                    className={`absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto ${
                      darkMode
                        ? "bg-gray-800/95 border-gray-700 backdrop-blur-sm"
                        : "bg-white/95 border-gray-200 backdrop-blur-sm"
                    }`}
                  >
                    <div
                      className={`p-3 border-b flex justify-between items-center ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <h3 className={`font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Popular Cities</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPopularCities(false)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {popularCities.map((city) => (
                      <div
                        key={city.name}
                        className={`p-3 cursor-pointer hover:bg-opacity-80 border-b last:border-b-0 flex items-center ${
                          darkMode ? "hover:bg-gray-700 border-gray-700 text-white" : "hover:bg-blue-50 border-gray-200"
                        }`}
                        onClick={() => handlePopularCitySelect(city)}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            darkMode ? "bg-purple-900" : "bg-purple-100"
                          }`}
                        >
                          <span className="text-lg">🏙️</span>
                        </div>
                        <div>
                          <div className="font-medium">{city.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div
                    className={`absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto ${
                      darkMode
                        ? "bg-gray-800/95 border-gray-700 backdrop-blur-sm"
                        : "bg-white/95 border-gray-200 backdrop-blur-sm"
                    }`}
                  >
                    <div
                      className={`p-3 border-b flex justify-between items-center ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <h3 className={`font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Search Results</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSearchResults(false)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {searchResults.map((result) => (
                      <div
                        key={result.place_id}
                        className={`p-3 cursor-pointer hover:bg-opacity-80 border-b last:border-b-0 ${
                          darkMode ? "hover:bg-gray-700 border-gray-700 text-white" : "hover:bg-blue-50 border-gray-200"
                        }`}
                        onClick={() => handleSearchResultSelect(result)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{result.display_name.split(",")[0]}</div>
                          <Badge
                            variant="outline"
                            className={`ml-2 ${darkMode ? "border-gray-600 text-gray-300" : ""}`}
                          >
                            {result.category}
                          </Badge>
                        </div>
                        <div className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {result.display_name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Map Type */}
              <Select value={mapType} onValueChange={setMapType}>
                <SelectTrigger
                  className={`w-[140px] ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-gray-800"
                  }`}
                >
                  <Layers className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mapTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Controls */}
              <div className="flex gap-2">
                <Button
                  onClick={getCurrentLocation}
                  variant="outline"
                  size="sm"
                  className={`flex items-center gap-2 ${
                    darkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white bg-gray-800"
                      : "border-gray-200 hover:bg-blue-50 bg-white text-gray-700"
                  }`}
                >
                  <Navigation className="h-4 w-4" />
                  My Location
                </Button>

                <Button
                  onClick={() => setRoutingMode(!routingMode)}
                  variant={routingMode ? "default" : "outline"}
                  size="sm"
                  className={`flex items-center gap-2 ${
                    routingMode
                      ? darkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                      : darkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white bg-gray-800"
                        : "border-gray-200 hover:bg-blue-50 bg-white text-gray-700"
                  }`}
                >
                  <Route className="h-4 w-4" />
                  Route
                </Button>
              </div>

              {/* Weather Toggle */}
              <div className="flex items-center gap-2">
                <Cloud className={`h-4 w-4 ${darkMode ? "text-white" : ""}`} />
                <Switch checked={showWeather} onCheckedChange={setShowWeather} />
              </div>

              {/* Dark Mode Toggle */}
              <div className="flex items-center gap-2">
                {darkMode ? <Moon className="h-4 w-4 text-white" /> : <Sun className="h-4 w-4" />}
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-1 ${
                    selectedCategory === category
                      ? darkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                      : darkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white bg-gray-800"
                        : "border-gray-200 hover:bg-blue-50 bg-white text-gray-700"
                  }`}
                >
                  <Filter className="h-3 w-3" />
                  {category}
                </Button>
              ))}
            </div>

            {/* Results count and weather */}
            <div className="mt-4 flex justify-between items-center">
              <div className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Showing {filteredLocations.length} of {locations.length} locations
              </div>

              {weather && showWeather && (
                <div
                  className={`text-sm flex items-center gap-4 p-2 rounded-lg ${
                    darkMode ? "bg-gray-700 text-gray-300" : "bg-blue-50 text-gray-600"
                  }`}
                >
                  <span>🌡️ {weather.temperature}°C</span>
                  <span>💧 {weather.humidity}%</span>
                  <span>💨 {weather.windSpeed} km/h</span>
                  <span>{weather.condition}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Map and Info Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card
              className={`overflow-hidden rounded-xl shadow-xl ${
                darkMode ? "bg-gray-800 border-gray-700" : "border-white/20"
              }`}
            >
              <CardContent className="p-0">
                <MapComponent
                  locations={filteredLocations}
                  selectedLocation={selectedLocation}
                  onLocationSelect={handleLocationSelect}
                  userLocation={userLocation}
                  mapType={mapType}
                  mapTypes={mapTypes}
                  darkMode={darkMode}
                  showWeather={showWeather}
                  routingMode={routingMode}
                  routeStart={routeStart}
                  routeEnd={routeEnd}
                  onRoutePointSet={(point, isStart) => {
                    if (isStart) {
                      setRouteStart(point)
                    } else {
                      setRouteEnd(point)
                    }
                  }}
                  onMapLoaded={() => setIsMapLoaded(true)}
                />
              </CardContent>
            </Card>
          </div>

          {/* Info Panel */}
          <div className="space-y-4">
            {selectedLocation ? (
              <Card
                className={`overflow-hidden rounded-xl shadow-lg ${
                  darkMode ? "bg-gray-800 border-gray-700" : "bg-white/90 backdrop-blur-sm border-white/20"
                }`}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={selectedLocation.image || "/placeholder.svg?height=200&width=400&text=No+Image"}
                      alt={selectedLocation.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-2xl font-bold text-white drop-shadow-md">{selectedLocation.name}</h3>
                      <div className="flex items-center mt-1">
                        <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-none">
                          {selectedLocation.category}
                        </Badge>
                        {selectedLocation.distance && (
                          <Badge variant="outline" className="ml-2 text-white border-white/50">
                            {selectedLocation.distance} km away
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    {selectedLocation.rating > 0 && (
                      <div className="flex items-center mb-3">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>{i < Math.floor(selectedLocation.rating) ? "★" : "☆"}</span>
                          ))}
                        </div>
                        <span className={`ml-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                          {selectedLocation.rating}/5
                        </span>
                      </div>
                    )}

                    <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {selectedLocation.description}
                    </p>

                    <div
                      className={`text-sm p-3 rounded-lg ${
                        darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0 text-blue-500" />
                        <span>{selectedLocation.address}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`flex items-center gap-2 ${
                          darkMode
                            ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white bg-gray-800"
                            : "border-gray-200 hover:bg-blue-50 bg-white text-gray-700"
                        }`}
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(
                              `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`,
                            )
                            toast({
                              title: "Coordinates Copied",
                              description: "Location coordinates copied to clipboard",
                            })
                          }
                        }}
                      >
                        <span className="text-xs">
                          {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                        </span>
                      </Button>

                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => shareLocation(selectedLocation)}
                      >
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card
                className={`overflow-hidden rounded-xl shadow-lg ${
                  darkMode ? "bg-gray-800 border-gray-700" : "bg-white/90 backdrop-blur-sm border-white/20"
                }`}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      darkMode ? "bg-blue-900/30" : "bg-blue-100"
                    }`}
                  >
                    <MapPin className={`h-8 w-8 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Select a Location
                  </h3>
                  <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Search for any city or place in India, or click on any marker on the map to view details.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className={`${
                        darkMode
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white bg-gray-800"
                          : "hover:bg-blue-50 bg-white text-gray-700 border-gray-200"
                      }`}
                      onClick={() => setShowPopularCities(true)}
                    >
                      Popular Cities
                    </Button>
                    <Button
                      variant="outline"
                      className={`${
                        darkMode
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white bg-gray-800"
                          : "hover:bg-blue-50 bg-white text-gray-700 border-gray-200"
                      }`}
                      onClick={getCurrentLocation}
                    >
                      My Location
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card
              className={`overflow-hidden rounded-xl shadow-lg ${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-white/90 backdrop-blur-sm border-white/20"
              }`}
            >
              <CardContent className="p-6">
                <h3
                  className={`text-lg font-semibold mb-4 flex items-center ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  <Compass className="h-4 w-4 mr-2 text-blue-500" />
                  Explore Categories
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {categories.slice(1).map((category) => {
                    const count = locations.filter((loc) => loc.category === category).length
                    const emoji = getCategoryEmoji(category)
                    return (
                      <div
                        key={category}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                          darkMode
                            ? "bg-gray-700 hover:bg-gray-600 hover:shadow-lg hover:shadow-blue-900/20"
                            : "bg-gray-50 hover:bg-blue-50 hover:shadow-md hover:shadow-blue-100"
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        <div className="flex justify-between items-center">
                          <span
                            className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium flex items-center`}
                          >
                            <span className="mr-2 text-lg">{emoji}</span>
                            {category}
                          </span>
                          <Badge
                            variant="outline"
                            className={darkMode ? "border-gray-600 text-gray-300" : "border-gray-200"}
                          >
                            {count}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Routing Info */}
            {routingMode && (
              <Card
                className={`overflow-hidden rounded-xl shadow-lg ${
                  darkMode ? "bg-gray-800 border-gray-700" : "bg-white/90 backdrop-blur-sm border-white/20"
                }`}
              >
                <CardContent className="p-6">
                  <h3
                    className={`text-lg font-semibold mb-4 flex items-center ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    <Route className="h-4 w-4 mr-2 text-blue-500" />
                    Route Planning
                  </h3>
                  <div className="space-y-3">
                    <div
                      className={`p-3 rounded-lg ${
                        routeStart
                          ? darkMode
                            ? "bg-green-900/30 border border-green-800"
                            : "bg-green-50 border border-green-100"
                          : darkMode
                            ? "bg-gray-700"
                            : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                            routeStart ? "bg-green-500 text-white" : "bg-gray-300"
                          }`}
                        >
                          A
                        </div>
                        <div className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {routeStart ? "Start point set" : "Click on map to set start point"}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded-lg ${
                        routeEnd
                          ? darkMode
                            ? "bg-red-900/30 border border-red-800"
                            : "bg-red-50 border border-red-100"
                          : darkMode
                            ? "bg-gray-700"
                            : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                            routeEnd ? "bg-red-500 text-white" : "bg-gray-300"
                          }`}
                        >
                          B
                        </div>
                        <div className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {routeEnd ? "End point set" : "Click on map to set end point"}
                        </div>
                      </div>
                    </div>

                    {routeStart && routeEnd && (
                      <div
                        className={`mt-3 p-3 rounded-lg ${
                          darkMode ? "bg-blue-900/30 border border-blue-800" : "bg-blue-50 border border-blue-100"
                        }`}
                      >
                        <div className={`font-medium ${darkMode ? "text-blue-400" : "text-blue-700"}`}>
                          Distance: {calculateDistance(routeStart.lat, routeStart.lng, routeEnd.lat, routeEnd.lng)} km
                        </div>
                        <div className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Estimated travel time:{" "}
                          {Math.round(
                            calculateDistance(routeStart.lat, routeStart.lng, routeEnd.lat, routeEnd.lng) * 2,
                          )}{" "}
                          minutes
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

// Helper function to get emoji for category
function getCategoryEmoji(category: string): string {
  const emojiMap: { [key: string]: string } = {
    Historical: "🏛️",
    Monument: "🗿",
    Religious: "🕉️",
    Shopping: "🛍️",
    City: "🏙️",
    Village: "🏡",
    Natural: "🌳",
    Building: "🏢",
    Place: "📌",
  }

  return emojiMap[category] || "📍"
}
