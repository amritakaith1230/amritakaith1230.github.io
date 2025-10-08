// Professional image service with category-based placeholders
export function getLocationImageByCategory(category: string): string {
  const imageMap: { [key: string]: string } = {
    Historical: "/placeholder.svg?height=200&width=400&text=Historical+Site&bg=8B4513&color=white",
    Monument: "/placeholder.svg?height=200&width=400&text=Monument&bg=4169E1&color=white",
    Religious: "/placeholder.svg?height=200&width=400&text=Religious+Place&bg=FFD700&color=black",
    Shopping: "/placeholder.svg?height=200&width=400&text=Shopping+Area&bg=32CD32&color=white",
    City: "/placeholder.svg?height=200&width=400&text=City&bg=9C27B0&color=white",
    Village: "/placeholder.svg?height=200&width=400&text=Village&bg=FF9800&color=white",
    Natural: "/placeholder.svg?height=200&width=400&text=Natural+Area&bg=4CAF50&color=white",
    Building: "/placeholder.svg?height=200&width=400&text=Building&bg=795548&color=white",
    Place: "/placeholder.svg?height=200&width=400&text=Place&bg=607D8B&color=white",
    default: "/placeholder.svg?height=200&width=400&text=Location&bg=6B7280&color=white",
  }

  return imageMap[category] || imageMap.default
}

// Function to get weather icon based on condition
export function getWeatherIcon(condition: string): string {
  const weatherIcons: { [key: string]: string } = {
    Sunny: "☀️",
    Cloudy: "☁️",
    Rainy: "🌧️",
    Clear: "🌤️",
    Snow: "❄️",
    Thunderstorm: "⛈️",
    Fog: "🌫️",
    Windy: "💨",
  }

  return weatherIcons[condition] || "🌤️"
}

// Function to generate location description based on type
export function generateLocationDescription(name: string, type: string): string {
  const descriptions: { [key: string]: string } = {
    city: `${name} is a major city known for its cultural heritage, modern infrastructure, and vibrant community.`,
    village: `${name} is a charming village that offers a glimpse into traditional Indian rural life and culture.`,
    administrative: `${name} is an important administrative center that plays a key role in regional governance.`,
    natural: `${name} is a beautiful natural location perfect for nature lovers and outdoor enthusiasts.`,
    historic: `${name} is a historic site that holds significant cultural and historical importance.`,
    building: `${name} is a notable building that represents architectural excellence and cultural significance.`,
  }

  return descriptions[type] || `${name} is an interesting location worth exploring.`
}

// Function to create professional placeholder images
export function createPlaceholderImage(
  text: string,
  width = 400,
  height = 200,
  bgColor = "6B7280",
  textColor = "white",
): string {
  const encodedText = encodeURIComponent(text)
  return `/placeholder.svg?height=${height}&width=${width}&text=${encodedText}&bg=${bgColor}&color=${textColor}`
}
