# Smart Weather App (MERN)

An advanced weather application with smart search, fuzzy location suggestions, state-to-city recognition, search history powered by MongoDB, and a modern responsive UI.

## ✨ Features

- 🔍 Smart Search
  - Gibberish input detection with friendly error messages
  - Fuzzy suggestions and real-time autocomplete (e.g., "bull" → "Bullhead City", "Bulawayo")
  - Fetch weather only on valid selection or Enter
- 🌍 State & City Recognition
  - State-level queries map to capital or a prominent city (e.g., "Maharashtra" → "Mumbai")
  - Multiple city options for states spanning multiple climate zones
- 💾 MongoDB Integration
  - Saves recent searches with timestamps and counts
  - Auto-suggests from your own history
- 📊 Weather Details
  - Current conditions, 3-day forecast, UV index, precipitation, sunrise/sunset, feels-like
- 🎨 Modern UI/UX
  - Responsive, accessible design with pleasant colors and subtle animations
- 🛠 Clean Architecture
  - Modular backend controllers/utils and typed frontend services/components

---

## 🧱 Tech Stack

- Backend: Node.js, Express, Axios, Mongoose (MongoDB)
- Frontend: React (Vite/CRA-like structure), TypeScript
- Weather data: Open‑Meteo API (geocoding + forecast) with enhanced parsing
- Styling: Custom CSS with animations

---

## Requirements

- Node.js 18+ (LTS recommended)
- npm 9+ (or pnpm/yarn)
- A Firebase project with Firestore and Authentication enabled
- Vercel account (optional but recommended)

## Quick Start

1. Clone and install dependencies:
   \`\`\`bash
   cd weather-app
   npm install
   \`\`\`

2. Start the frontent and backend server:
   \`\`\`bash
   cd frontend
   npm run dev
   \`\`\`
   \`\`\`bash
   cd backend
   npm run dev
   \`\`\`
   App will run at http://localhost:3000
