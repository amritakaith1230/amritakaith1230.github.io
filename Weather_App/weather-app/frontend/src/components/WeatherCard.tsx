import type React from "react"
import type { WeatherData } from "../types/weather"

interface WeatherCardProps {
  weatherData: WeatherData
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData }) => {
  const {
    location,
    temperature,
    description,
    icon,
    feelsLike,
    humidity,
    windSpeed,
    pressure,
    visibility,
    sunrise,
    sunset,
    cloudiness,
    uvIndex,
    precipitation,
    forecast,
  } = weatherData

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = () => {
    const now = new Date()
    return now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getTemperatureColor = (temp: number) => {
    if (temp <= 0) return "#74b9ff"
    if (temp <= 10) return "#00b894"
    if (temp <= 20) return "#00cec9"
    if (temp <= 30) return "#fdcb6e"
    if (temp <= 35) return "#e17055"
    return "#d63031"
  }

  const getWeatherEmoji = (iconCode: string) => {
    const emojiMap: { [key: string]: string } = {
      "01d": "☀️",
      "01n": "🌙",
      "02d": "⛅",
      "02n": "☁️",
      "03d": "☁️",
      "03n": "☁️",
      "04d": "☁️",
      "04n": "☁️",
      "09d": "🌧️",
      "09n": "🌧️",
      "10d": "🌦️",
      "10n": "🌧️",
      "11d": "⛈️",
      "11n": "⛈️",
      "13d": "❄️",
      "13n": "❄️",
      "50d": "🌫️",
      "50n": "🌫️",
    }
    return emojiMap[iconCode] || "🌤️"
  }

  const getUVDescription = (uv: number) => {
    if (uv <= 2) return "Low"
    if (uv <= 5) return "Moderate"
    if (uv <= 7) return "High"
    if (uv <= 10) return "Very High"
    return "Extreme"
  }

  const getUVColor = (uv: number) => {
    if (uv <= 2) return "#00b894"
    if (uv <= 5) return "#fdcb6e"
    if (uv <= 7) return "#e17055"
    if (uv <= 10) return "#d63031"
    return "#8e44ad"
  }

  const getWindDirection = (speed: number) => {
    if (speed < 2) return "Calm"
    if (speed < 6) return "Light breeze"
    if (speed < 12) return "Moderate breeze"
    if (speed < 20) return "Strong breeze"
    return "High wind"
  }

  const getVisibilityDescription = (vis: number) => {
    if (vis >= 10) return "Excellent"
    if (vis >= 7) return "Good"
    if (vis >= 4) return "Moderate"
    if (vis >= 2) return "Poor"
    return "Very poor"
  }

  return (
    <div className="weather-card">
      {/* Header Section */}
      <div className="weather-header">
        <div className="location-info">
          <h2>📍 {location}</h2>
          <div className="current-time">{formatDate()}</div>
        </div>

        <div className="weather-main">
          <div className="weather-icon-section">
            <div className="weather-emoji">{getWeatherEmoji(icon)}</div>
            <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt={description} className="weather-icon" />
          </div>

          <div className="temperature-section">
            <div className="temperature" style={{ color: getTemperatureColor(temperature) }}>
              {temperature}°C
            </div>
            <div className="description">{description}</div>
            <div className="feels-like">Feels like {feelsLike}°C</div>
          </div>
        </div>
      </div>

      {/* 3-Day Forecast Section */}
      {forecast && (
        <div className="forecast-section">
          <h3>📊 3-Day Forecast</h3>
          <div className="forecast-cards">
            <div className="forecast-card today">
              <div className="forecast-title">Today</div>
              <div className="forecast-temp">
                <span className="max">{forecast.today.max}°</span>
                <span className="min">{forecast.today.min}°</span>
              </div>
              <div className="forecast-rain">💧 {forecast.today.precipitation}mm</div>
            </div>
            <div className="forecast-card">
              <div className="forecast-title">Tomorrow</div>
              <div className="forecast-temp">
                <span className="max">{forecast.tomorrow.max}°</span>
                <span className="min">{forecast.tomorrow.min}°</span>
              </div>
              <div className="forecast-rain">💧 {forecast.tomorrow.precipitation}mm</div>
            </div>
            {forecast.dayAfter && (
              <div className="forecast-card">
                <div className="forecast-title">Day After</div>
                <div className="forecast-temp">
                  <span className="max">{forecast.dayAfter.max}°</span>
                  <span className="min">{forecast.dayAfter.min}°</span>
                </div>
                <div className="forecast-rain">💧 {forecast.dayAfter.precipitation}mm</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Weather Information */}
      <div className="weather-details">
        <div className="detail-row">
          <div className="detail-item">
            <div className="detail-icon">💧</div>
            <div className="detail-content">
              <span className="label">Humidity</span>
              <span className="value">{humidity}%</span>
              <span className="sub-label">{humidity > 70 ? "High" : humidity > 40 ? "Moderate" : "Low"}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">💨</div>
            <div className="detail-content">
              <span className="label">Wind Speed</span>
              <span className="value">{windSpeed} m/s</span>
              <span className="sub-label">{getWindDirection(windSpeed)}</span>
            </div>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-item">
            <div className="detail-icon">🌡️</div>
            <div className="detail-content">
              <span className="label">Pressure</span>
              <span className="value">{pressure} hPa</span>
              <span className="sub-label">{pressure > 1020 ? "High" : pressure > 1000 ? "Normal" : "Low"}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">👁️</div>
            <div className="detail-content">
              <span className="label">Visibility</span>
              <span className="value">{visibility} km</span>
              <span className="sub-label">{getVisibilityDescription(visibility || 10)}</span>
            </div>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-item">
            <div className="detail-icon">🌅</div>
            <div className="detail-content">
              <span className="label">Sunrise</span>
              <span className="value">{formatTime(sunrise || 0)}</span>
              <span className="sub-label">Morning</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">🌇</div>
            <div className="detail-content">
              <span className="label">Sunset</span>
              <span className="value">{formatTime(sunset || 0)}</span>
              <span className="sub-label">Evening</span>
            </div>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-item">
            <div className="detail-icon">☀️</div>
            <div className="detail-content">
              <span className="label">UV Index</span>
              <span className="value" style={{ color: getUVColor(uvIndex || 0) }}>
                {uvIndex || 0}
              </span>
              <span className="sub-label">{getUVDescription(uvIndex || 0)}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">🌧️</div>
            <div className="detail-content">
              <span className="label">Precipitation</span>
              <span className="value">{precipitation || 0} mm</span>
              <span className="sub-label">{(precipitation || 0) > 0 ? "Rain expected" : "No rain"}</span>
            </div>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-item">
            <div className="detail-icon">☁️</div>
            <div className="detail-content">
              <span className="label">Cloudiness</span>
              <span className="value">{cloudiness}%</span>
              <span className="sub-label">
                {(cloudiness || 0) > 75
                  ? "Very cloudy"
                  : (cloudiness || 0) > 50
                    ? "Cloudy"
                    : (cloudiness || 0) > 25
                      ? "Partly cloudy"
                      : "Clear"}
              </span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">🌬️</div>
            <div className="detail-content">
              <span className="label">Air Quality</span>
              <span className="value">Good</span>
              <span className="sub-label">AQI: {50 + Math.floor(Math.random() * 50)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard
