# Memory Card Game

A modern, responsive memory card game built with React, TypeScript, and Tailwind CSS.

## Features

- 🎮 Three difficulty levels (Easy, Medium, Hard)
- 👤 User login system with gaming usernames
- 🔊 Sound effects for matches, mismatches, and game completion
- 🏆 High score tracking with player names
- ⏱️ Timer and move counter
- 🎨 Beautiful animations and transitions
- 📱 Fully responsive design
- 🎯 Score system based on moves and time
- 🎉 Congratulations screen with game statistics
- 🔇 Sound toggle option

## How to Play

1. **Enter your gaming username** on the login screen
2. Choose your difficulty level:

   - **Easy**: 3×4 grid (12 cards)
   - **Medium**: 4×4 grid (16 cards)
   - **Hard**: 6×6 grid (36 cards)

3. Click on cards to flip them and reveal the hidden emoji
4. Try to find matching pairs of cards
5. **Listen for audio feedback**:
   - ✅ Success sound when cards match
   - ❌ Wrong sound when cards don't match
   - 🎉 Celebration sound when you complete the game
6. When two cards match, they stay face up
7. If they don't match, they flip back face down
8. Complete the game by matching all pairs
9. Try to achieve the highest score with fewer moves and less time!

## Scoring System

Your score is calculated based on:

- Base score: 1000 points
- Move penalty: -10 points per move
- Time penalty: -1 point per second
- Minimum score: 100 points

## Installation and Setup

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Commands to Run the Project

1. **Clone or create the project:**
   \`\`\`bash
   mkdir memory-card-game
   cd memory-card-game
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Build for production:**
   \`\`\`bash
   npm run build
   \`\`\`

5. **Preview production build:**
   \`\`\`bash
   npm run preview
   \`\`\`

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Local Storage** - For persisting high scores

## Game Features

### Advanced Features Implemented:

- ✅ Multiple difficulty levels
- ✅ Scoring system based on performance
- ✅ High score tracking
- ✅ Responsive design for all devices
- ✅ Smooth animations and transitions
- ✅ Modern UI with gradient backgrounds
- ✅ Card flip animations with 3D effects
- ✅ Game completion celebration

### New Features Added:

- ✅ User authentication with gaming usernames
- ✅ Sound effects system with Web Audio API
- ✅ Player name tracking in high scores
- ✅ Sound toggle functionality
- ✅ Enhanced congratulations with player name
- ✅ Persistent username storage

### Technical Highlights:

- Component-based architecture
- TypeScript for type safety
- Custom hooks for game logic
- Local storage integration
- Responsive grid layouts
- CSS animations and transitions
- Modern React patterns (hooks, functional components)

## Browser Support

This game works on all modern browsers including:

- Chrome (recommended)
- Firefox
- Safari
- Edge
