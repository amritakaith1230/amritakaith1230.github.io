"use client"

import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, LayersControl, ZoomControl } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Layers, Route } from "lucide-react" // Import Layers and Route components
import type { Location } from "../page"

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

// Custom icons for different categories with improved design
const createCustomIcon = (category: string) => {
  const configs: { [key: string]: { color: string; emoji: string } } = {
    Historical: { color: "#8B4513", emoji: "🏛️" },
    Monument: { color: "#4169E1", emoji: "🗿" },
    Religious: { color: "#FFD700", emoji: "🕉️" },
    Shopping: { color: "#32CD32", emoji: "🛍️" },
    "Search Result": { color: "#FF6B6B", emoji: "📍" },
    City: { color: "#9C27B0", emoji: "🏙️" },
    Village: { color: "#FF9800", emoji: "🏡" },
    Natural: { color: "#4CAF50", emoji: "🌳" },
    Building: { color: "#795548", emoji: "🏢" },
    Place: { color: "#607D8B", emoji: "📌" },
    default: { color: "#FF6B6B", emoji: "📍" },
  }

  const config = configs[category] || configs.default

  return L.divIcon({
    html: `
      <div class="marker-container">
        <div class="marker-icon" style="
          background: linear-gradient(45deg, ${config.color}, ${config.color}dd);
          width: 40px;
          height: 40px;
          border-radius: 50% 50% 50% 0;
          border: 3px solid white;
          transform: rotate(-45deg);
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        ">
          <div style="
            transform: rotate(45deg);
            font-size: 18px;
            filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.5));
          ">
            ${config.emoji}
          </div>
        </div>
        <div class="marker-shadow"></div>
      </div>
    `,
    className: "custom-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  })
}

// Enhanced user location icon with pulse animation
const userLocationIcon = L.divIcon({
  html: `
    <div class="user-location-container">
      <div class="user-location-dot"></div>
      <div class="user-location-pulse"></div>
    </div>
  `,
  className: "user-location-marker",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
})

// Route point icons
const routeStartIcon = L.divIcon({
  html: `
    <div class="route-marker route-start">A</div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

const routeEndIcon = L.divIcon({
  html: `
    <div class="route-marker route-end">B</div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

interface MapComponentProps {
  locations: Location[]
  selectedLocation: Location | null
  onLocationSelect: (location: Location) => void
  userLocation: { lat: number; lng: number } | null
  mapType: string
  mapTypes: Array<{ id: string; name: string; url: string }>
  darkMode: boolean
  showWeather: boolean
  routingMode: boolean
  routeStart: { lat: number; lng: number } | null
  routeEnd: { lat: number; lng: number } | null
  onRoutePointSet: (point: { lat: number; lng: number }, isStart: boolean) => void
  onMapLoaded?: () => void
}

// Component to handle map updates and interactions
function MapUpdater({
  selectedLocation,
  userLocation,
  routingMode,
  onRoutePointSet,
  routeStart,
  routeEnd,
  onMapLoaded,
}: {
  selectedLocation: Location | null
  userLocation: { lat: number; lng: number } | null
  routingMode: boolean
  onRoutePointSet: (point: { lat: number; lng: number }, isStart: boolean) => void
  routeStart: { lat: number; lng: number } | null
  routeEnd: { lat: number; lng: number } | null
  onMapLoaded?: () => void
}) {
  const map = useMap()

  useEffect(() => {
    if (onMapLoaded) {
      onMapLoaded()
    }
  }, [onMapLoaded])

  useEffect(() => {
    if (selectedLocation) {
      map.flyTo([selectedLocation.lat, selectedLocation.lng], 15, {
        animate: true,
        duration: 1.5,
      })
    }
  }, [selectedLocation, map])

  useEffect(() => {
    if (userLocation) {
      map.flyTo([userLocation.lat, userLocation.lng], 15, {
        animate: true,
        duration: 1.5,
      })
    }
  }, [userLocation, map])

  useEffect(() => {
    if (routingMode) {
      const handleMapClick = (e: L.LeafletMouseEvent) => {
        const point = { lat: e.latlng.lat, lng: e.latlng.lng }
        if (!routeStart) {
          onRoutePointSet(point, true)
        } else if (!routeEnd) {
          onRoutePointSet(point, false)
        } else {
          // Reset and start new route
          onRoutePointSet(point, true)
          onRoutePointSet({ lat: 0, lng: 0 }, false) // Clear end point
        }
      }

      map.on("click", handleMapClick)

      return () => {
        map.off("click", handleMapClick)
      }
    }
  }, [routingMode, routeStart, routeEnd, map, onRoutePointSet])

  return null
}

// Weather overlay component
function WeatherOverlay({ showWeather }: { showWeather: boolean }) {
  const map = useMap()

  useEffect(() => {
    if (showWeather) {
      // Add weather layer (example with OpenWeatherMap)
      const weatherLayer = L.tileLayer(
        "https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY",
        {
          attribution: "Weather data © OpenWeatherMap",
          opacity: 0.6,
        },
      )

      // For demo purposes, we'll show a simple overlay
      // In real app, you'd use actual weather API

      return () => {
        // Clean up weather layer
      }
    }
  }, [showWeather, map])

  return null
}

export default function MapComponent({
  locations,
  selectedLocation,
  onLocationSelect,
  userLocation,
  mapType,
  mapTypes,
  darkMode,
  showWeather,
  routingMode,
  routeStart,
  routeEnd,
  onRoutePointSet,
  onMapLoaded,
}: MapComponentProps) {
  const mapRef = useRef<L.Map>(null)
  const [routePath, setRoutePath] = useState<[number, number][]>([])

  // Calculate route when both points are set
  useEffect(() => {
    if (routeStart && routeEnd) {
      // Simple straight line for demo - replace with actual routing API
      setRoutePath([
        [routeStart.lat, routeStart.lng],
        [routeEnd.lat, routeEnd.lng],
      ])
    } else {
      setRoutePath([])
    }
  }, [routeStart, routeEnd])

  const currentMapType = mapTypes.find((type) => type.id === mapType)

  return (
    <div className="h-[600px] w-full relative">
      <MapContainer
        center={userLocation ? [userLocation.lat, userLocation.lng] : [28.6139, 77.209]}
        zoom={userLocation ? 15 : 11}
        className="h-full w-full rounded-lg"
        ref={mapRef}
        zoomControl={false}
        attributionControl={true}
      >
        <ZoomControl position="bottomright" />

        <LayersControl position="topright">
          {/* Base Layers */}
          {mapTypes.map((type) => (
            <LayersControl.BaseLayer key={type.id} name={type.name} checked={mapType === type.id}>
              <TileLayer
                attribution={
                  type.id === "satellite"
                    ? "&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }
                url={type.url}
                maxZoom={18}
              />
            </LayersControl.BaseLayer>
          ))}

          {/* Overlay Layers */}
          {showWeather && (
            <LayersControl.Overlay name="Weather" checked={showWeather}>
              <TileLayer
                attribution="Weather data simulation"
                url="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                opacity={0.3}
              />
            </LayersControl.Overlay>
          )}
        </LayersControl>

        <MapUpdater
          selectedLocation={selectedLocation}
          userLocation={userLocation}
          routingMode={routingMode}
          onRoutePointSet={onRoutePointSet}
          routeStart={routeStart}
          routeEnd={routeEnd}
          onMapLoaded={onMapLoaded}
        />

        <WeatherOverlay showWeather={showWeather} />

        {/* Location markers */}
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={createCustomIcon(location.category)}
            eventHandlers={{
              click: () => onLocationSelect(location),
            }}
          >
            <Popup className="custom-popup" maxWidth={300}>
              <div className="p-3 min-w-[250px]">
                <img
                  src={location.image || "/placeholder.svg?height=200&width=400&text=No+Image"}
                  alt={location.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className="font-bold text-lg mb-2">{location.name}</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{location.category}</span>
                  {location.rating > 0 && (
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="text-sm">{location.rating}/5</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{location.description}</p>
                <div className="text-xs text-gray-500 border-t pt-2">📍 {location.address}</div>
                {location.distance && <div className="text-xs text-blue-600 mt-1">🚗 {location.distance} km away</div>}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* User location marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
            <Popup>
              <div className="text-center p-3">
                <h3 className="font-bold text-lg">📍 Your Location</h3>
                <p className="text-sm text-gray-600 mt-1">You are here!</p>
                <p className="text-xs text-gray-500 mt-2">
                  Lat: {userLocation.lat.toFixed(6)}
                  <br />
                  Lng: {userLocation.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route markers */}
        {routingMode && routeStart && (
          <Marker position={[routeStart.lat, routeStart.lng]} icon={routeStartIcon}>
            <Popup>
              <div className="text-center p-2">
                <h4 className="font-bold">🟢 Route Start</h4>
              </div>
            </Popup>
          </Marker>
        )}

        {routingMode && routeEnd && (
          <Marker position={[routeEnd.lat, routeEnd.lng]} icon={routeEndIcon}>
            <Popup>
              <div className="text-center p-2">
                <h4 className="font-bold">🔴 Route End</h4>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route line */}
        {routePath.length > 0 && (
          <Polyline
            positions={routePath}
            pathOptions={{
              color: "#3B82F6",
              weight: 5,
              opacity: 0.8,
              dashArray: "10, 10",
              lineCap: "round",
            }}
          />
        )}
      </MapContainer>

      {/* Enhanced Legend */}
      <div
        className={`absolute bottom-4 left-4 ${
          darkMode ? "bg-gray-800/90 text-white" : "bg-white/90"
        } p-4 rounded-lg shadow-lg z-[1000] max-w-xs backdrop-blur-sm border border-white/20`}
      >
        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">🗺️ Map Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏛️</span>
            <span>Historical Sites</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🗿</span>
            <span>Monuments</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🕉️</span>
            <span>Religious Places</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🛍️</span>
            <span>Shopping Areas</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🏙️</span>
            <span>Cities</span>
          </div>
          {userLocation && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span>Your Location</span>
            </div>
          )}
          {routingMode && (
            <>
              <div className="border-t pt-2 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold">
                    A
                  </div>
                  <span>Route Start</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold">
                    B
                  </div>
                  <span>Route End</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Map Type Info */}
      <div
        className={`absolute top-4 left-4 ${
          darkMode ? "bg-gray-800/90 text-white" : "bg-white/90"
        } px-3 py-2 rounded-lg shadow-lg z-[1000] backdrop-blur-sm border border-white/20`}
      >
        <div className="text-sm font-medium flex items-center gap-2">
          <Layers className="h-4 w-4" />
          {currentMapType?.name || "Streets"} View
        </div>
      </div>

      {/* Routing Instructions */}
      {routingMode && (
        <div
          className={`absolute top-4 right-4 ${
            darkMode ? "bg-gray-800/90 text-white" : "bg-white/90"
          } p-3 rounded-lg shadow-lg z-[1000] max-w-xs backdrop-blur-sm border border-white/20`}
        >
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Route className="h-4 w-4" />
            Route Planning
          </h4>
          <div className="text-xs space-y-1">
            <div>1. Click on map for start point (A)</div>
            <div>2. Click again for end point (B)</div>
            <div className="text-gray-500">Click again to reset route</div>
          </div>
        </div>
      )}
    </div>
  )
}
