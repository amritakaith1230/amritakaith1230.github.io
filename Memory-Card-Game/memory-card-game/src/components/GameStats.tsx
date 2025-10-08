"use client"

import type React from "react"
import type { Difficulty, Player } from "../types/game"

interface GameStatsProps {
  moves: number
  time: number
  difficulty: Difficulty
  onNewGame: () => void
  isGameComplete: boolean
  currentPlayer: Player
}

const GameStats: React.FC<GameStatsProps> = ({ moves, time, difficulty, onNewGame, isGameComplete, currentPlayer }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getDifficultyColor = () => {
    switch (difficulty) {
      case "easy":
        return "text-green-400"
      case "medium":
        return "text-yellow-400"
      case "hard":
        return "text-red-400"
      default:
        return "text-blue-400"
    }
  }

  const averageScore =
    currentPlayer.gamesPlayed > 0 ? Math.round(currentPlayer.totalPoints / currentPlayer.gamesPlayed) : 0

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-300">{currentPlayer.username}</div>
            <div className="text-sm text-gray-300">Player</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-purple-300">{currentPlayer.totalPoints.toLocaleString()}</div>
            <div className="text-sm text-gray-300">Total Points</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-300">{currentPlayer.gamesPlayed}</div>
            <div className="text-sm text-gray-300">Games Played</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-pink-300">{averageScore}</div>
            <div className="text-sm text-gray-300">Avg Score</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-blue-300">{moves}</div>
            <div className="text-sm text-gray-300">Current Moves</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-300">{formatTime(time)}</div>
            <div className="text-sm text-gray-300">Current Time</div>
          </div>

          <div className="text-center">
            <div className={`text-2xl font-bold capitalize ${getDifficultyColor()}`}>{difficulty}</div>
            <div className="text-sm text-gray-300">Difficulty</div>
          </div>
        </div>

        <button
          onClick={onNewGame}
          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
        >
          New Game
        </button>
      </div>
    </div>
  )
}

export default GameStats
