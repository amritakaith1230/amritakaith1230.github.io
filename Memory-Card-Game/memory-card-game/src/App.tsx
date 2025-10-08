"use client"

import type React from "react"
import { useState, useEffect } from "react"
import GameBoard from "./components/GameBoard"
import GameStats from "./components/GameStats"
import DifficultySelector from "./components/DifficultySelector"
import LeaderboardTabs from "./components/LeaderboardTabs"
import type { Card, GameState, Difficulty, Score, Player } from "./types/game"
import { generateCards, shuffleArray } from "./utils/gameUtils"
import { saveScore, getHighScores, getPlayer, getCurrentUser, clearCurrentUser } from "./utils/playerStorage"
import LoginScreen from "./components/LoginScreen"
import { playSound } from "./utils/soundUtils"
import SoundToggle from "./components/SoundToggle"

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>("menu")
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [isGameComplete, setIsGameComplete] = useState(false)
  const [highScores, setHighScores] = useState<Score[]>([])
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on app load
  useEffect(() => {
    const checkExistingSession = () => {
      const savedUsername = getCurrentUser()
      if (savedUsername) {
        const player = getPlayer(savedUsername)
        if (player) {
          setCurrentPlayer(player)
          setIsLoggedIn(true)
        } else {
          // Clear invalid session
          clearCurrentUser()
        }
      }
      setIsLoading(false)
    }

    checkExistingSession()
  }, [])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameState === "playing" && !isGameComplete) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameState, isGameComplete])

  // Load high scores on mount
  useEffect(() => {
    setHighScores(getHighScores())
  }, [])

  // FIXED: Check for game completion - now only calculates and saves score once
  useEffect(() => {
    const totalPairs = cards.length / 2
    if (matchedPairs.length === totalPairs && totalPairs > 0 && currentPlayer && !isGameComplete) {
      setIsGameComplete(true)
      setGameState("completed")

      // Play congratulations sound
      playSound("congratulations")

      // Calculate score only once
      const calculatedScore = Math.max(1000 - moves * 10 - time, 100)

      console.log(`Game completed! Score: ${calculatedScore}, Moves: ${moves}, Time: ${time}`)

      const newScore: Score = {
        score: calculatedScore,
        moves,
        time,
        difficulty,
        date: new Date().toISOString(),
        playerName: currentPlayer.username,
      }

      // Save score and update leaderboards (this will also update player stats)
      const updatedScores = saveScore(newScore)
      setHighScores(updatedScores)

      // Get updated player data after score is saved
      setTimeout(() => {
        const updatedPlayer = getPlayer(currentPlayer.username)
        if (updatedPlayer) {
          setCurrentPlayer(updatedPlayer)
          console.log(`Updated player stats: Points: ${updatedPlayer.totalPoints}, Games: ${updatedPlayer.gamesPlayed}`)
        }
      }, 100)
    }
  }, [matchedPairs, cards.length, moves, time, difficulty, currentPlayer, isGameComplete])

  const startNewGame = (selectedDifficulty: Difficulty) => {
    const newCards = generateCards(selectedDifficulty)
    setCards(shuffleArray(newCards))
    setFlippedCards([])
    setMatchedPairs([])
    setMoves(0)
    setTime(0)
    setIsGameComplete(false)
    setDifficulty(selectedDifficulty)
    setGameState("playing")
  }

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedPairs.includes(cards[index].id)) {
      return
    }

    const newFlippedCards = [...flippedCards, index]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1)

      const [firstIndex, secondIndex] = newFlippedCards
      const firstCard = cards[firstIndex]
      const secondCard = cards[secondIndex]

      if (firstCard.id === secondCard.id) {
        // Match found - play success sound
        setTimeout(() => {
          playSound("success")
          setMatchedPairs((prev) => [...prev, firstCard.id])
          setFlippedCards([])
        }, 1000)
      } else {
        // No match - play wrong sound
        setTimeout(() => {
          playSound("wrong")
          setFlippedCards([])
        }, 1500)
      }
    }
  }

  const resetGame = () => {
    setGameState("menu")
    setCards([])
    setFlippedCards([])
    setMatchedPairs([])
    setMoves(0)
    setTime(0)
    setIsGameComplete(false)
  }

  const handleLogin = (player: Player) => {
    setCurrentPlayer(player)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    clearCurrentUser()
    setCurrentPlayer(null)
    setIsLoggedIn(false)
    resetGame()
  }

  // Show loading screen while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎮</div>
          <div className="text-2xl font-bold">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <SoundToggle />
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Memory Card Game
          </h1>
          <p className="text-lg text-gray-300">Test your memory and match all the pairs!</p>
          {isLoggedIn && currentPlayer && (
            <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 inline-block">
              <span className="text-yellow-300">🎮 {currentPlayer.username}</span>
              <span className="text-purple-300 ml-4">👑 {currentPlayer.totalPoints.toLocaleString()} pts</span>
              <span className="text-cyan-300 ml-4">🎯 {currentPlayer.gamesPlayed} games</span>
            </div>
          )}
        </header>

        {!isLoggedIn && <LoginScreen onLogin={handleLogin} />}

        {isLoggedIn && currentPlayer && gameState === "menu" && (
          <div className="max-w-6xl mx-auto">
            <DifficultySelector onStart={startNewGame} />
            <LeaderboardTabs scores={highScores} currentPlayer={currentPlayer} />
          </div>
        )}

        {isLoggedIn && currentPlayer && (gameState === "playing" || gameState === "completed") && (
          <div className="max-w-6xl mx-auto">
            <GameStats
              moves={moves}
              time={time}
              difficulty={difficulty}
              onNewGame={resetGame}
              isGameComplete={isGameComplete}
              currentPlayer={currentPlayer}
            />

            <GameBoard
              cards={cards}
              flippedCards={flippedCards}
              matchedPairs={matchedPairs}
              onCardClick={handleCardClick}
              difficulty={difficulty}
            />

            {isGameComplete && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-2xl text-center max-w-md mx-4">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-bold mb-4 text-green-600">Congratulations {currentPlayer.username}!</h2>
                  <p className="text-lg mb-4">You completed the game!</p>
                  <div className="space-y-2 mb-6">
                    <p>
                      <span className="font-semibold">Score:</span> {Math.max(1000 - moves * 10 - time, 100)}
                    </p>
                    <p>
                      <span className="font-semibold">Moves:</span> {moves}
                    </p>
                    <p>
                      <span className="font-semibold">Time:</span> {Math.floor(time / 60)}:
                      {(time % 60).toString().padStart(2, "0")}
                    </p>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={resetGame}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                    >
                      Play Again
                    </button>
                    <button
                      onClick={handleLogout}
                      className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
