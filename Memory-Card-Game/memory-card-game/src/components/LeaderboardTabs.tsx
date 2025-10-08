"use client"

import type React from "react"
import { useState } from "react"
import type { Score, Player } from "../types/game"
import { searchScores, searchPlayers } from "../utils/playerStorage"

interface LeaderboardTabsProps {
  scores: Score[]
  currentPlayer: Player
}

const LeaderboardTabs: React.FC<LeaderboardTabsProps> = ({ scores, currentPlayer }) => {
  const [activeTab, setActiveTab] = useState<"individual" | "total">("individual")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getDifficultyColor = (difficulty: string) => {
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

  // Get filtered and searched data
  const filteredScores = searchScores(searchQuery, selectedDifficulty)
  const totalScoresLeaderboard = searchPlayers(searchQuery)

  const difficulties = [
    { value: "all", label: "All Levels", color: "from-blue-500 to-purple-600" },
    { value: "easy", label: "Easy", color: "from-green-500 to-emerald-600" },
    { value: "medium", label: "Medium", color: "from-yellow-500 to-orange-600" },
    { value: "hard", label: "Hard", color: "from-red-500 to-pink-600" },
  ]

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
      {/* Tab Headers */}
      <div className="flex mb-6 bg-white/5 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("individual")}
          className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
            activeTab === "individual" ? "bg-yellow-500 text-white font-semibold" : "text-gray-300 hover:text-white"
          }`}
        >
          🏆 Best Games
        </button>
        <button
          onClick={() => setActiveTab("total")}
          className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
            activeTab === "total" ? "bg-yellow-500 text-white font-semibold" : "text-gray-300 hover:text-white"
          }`}
        >
          👑 Total Points
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search players..."
            className="w-full px-4 py-3 pl-10 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</div>
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Difficulty Filter for Individual Games */}
      {activeTab === "individual" && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Filter by Difficulty:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff.value}
                onClick={() => setSelectedDifficulty(diff.value)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedDifficulty === diff.value
                    ? `bg-gradient-to-r ${diff.color} text-white`
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === "individual" ? (
        /* Individual Game Scores */
        <div>
          <h3 className="text-2xl font-bold text-center mb-6">
            🏆 Best Individual Games
            {selectedDifficulty !== "all" && (
              <span className={`text-lg ml-2 capitalize ${getDifficultyColor(selectedDifficulty)}`}>
                ({selectedDifficulty})
              </span>
            )}
            {searchQuery && <span className="text-lg ml-2 text-yellow-400">- "{searchQuery}"</span>}
          </h3>

          {filteredScores.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🎮</div>
              <p className="text-gray-300">
                {searchQuery ? `No results found for "${searchQuery}"` : "No games played yet!"}
              </p>
              {searchQuery && (
                <button onClick={clearSearch} className="text-yellow-400 hover:text-yellow-300 underline mt-2">
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto space-y-3">
              {filteredScores.map((score, index) => (
                <div
                  key={`${score.playerName}-${score.date}-${index}`}
                  className={`flex items-center justify-between rounded-lg p-4 transition-all duration-200 ${
                    score.playerName === currentPlayer.username
                      ? "bg-yellow-500/20 border border-yellow-500/30"
                      : "bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{score.score} points</div>
                      <div className="text-sm text-gray-300">
                        {score.playerName} • {score.moves} moves • {formatTime(score.time)}
                      </div>
                      <div className="text-xs text-gray-400">{new Date(score.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className={`capitalize font-semibold ${getDifficultyColor(score.difficulty)}`}>
                    {score.difficulty}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Total Points Leaderboard */
        <div>
          <h3 className="text-2xl font-bold text-center mb-6">
            👑 Total Points Leaderboard
            {searchQuery && <span className="text-lg ml-2 text-yellow-400">- "{searchQuery}"</span>}
          </h3>

          {totalScoresLeaderboard.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">👑</div>
              <p className="text-gray-300">
                {searchQuery ? `No players found for "${searchQuery}"` : "No players yet!"}
              </p>
              {searchQuery && (
                <button onClick={clearSearch} className="text-yellow-400 hover:text-yellow-300 underline mt-2">
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto space-y-3">
              {totalScoresLeaderboard.map((player, index) => (
                <div
                  key={player.username}
                  className={`flex items-center justify-between rounded-lg p-4 transition-all duration-200 ${
                    player.username === currentPlayer.username
                      ? "bg-purple-500/20 border border-purple-500/30"
                      : "bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">
                      {index === 0 ? "👑" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-purple-300">
                        {player.totalPoints.toLocaleString()} points
                      </div>
                      <div className="text-sm text-gray-300">
                        {player.username} • {player.gamesPlayed} games played
                      </div>
                      <div className="text-xs text-gray-400">
                        Joined: {new Date(player.joinDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-300">
                      Avg: {player.gamesPlayed > 0 ? Math.round(player.totalPoints / player.gamesPlayed) : 0}
                    </div>
                    <div className="text-xs text-gray-400">per game</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default LeaderboardTabs
