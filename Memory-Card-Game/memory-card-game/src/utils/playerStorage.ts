import type { Player, Score, GameRecord } from "../types/game"
import { hashPassword } from "./auth"

const PLAYERS_KEY = "memory-game-players"
const SCORES_KEY = "memory-game-scores"
const CURRENT_USER_KEY = "memory-game-current-user"

// Session management
export const saveCurrentUser = (username: string): void => {
  localStorage.setItem(CURRENT_USER_KEY, username)
}

export const getCurrentUser = (): string | null => {
  return localStorage.getItem(CURRENT_USER_KEY)
}

export const clearCurrentUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY)
}

// Clear all data function
export const clearAllData = (): void => {
  try {
    localStorage.removeItem(PLAYERS_KEY)
    localStorage.removeItem(SCORES_KEY)
    localStorage.removeItem(CURRENT_USER_KEY)
    console.log("All game data cleared successfully!")
  } catch (error) {
    console.error("Error clearing data:", error)
  }
}

// Initialize fresh data
export const initializeFreshData = (): void => {
  clearAllData()
  localStorage.setItem(PLAYERS_KEY, JSON.stringify([]))
  localStorage.setItem(SCORES_KEY, JSON.stringify([]))
}

// Migration function to handle old data
export const migrateOldPlayerData = (): void => {
  try {
    const players = getAllPlayers()
    let needsUpdate = false

    const updatedPlayers = players.map((player) => {
      const updatedPlayer = { ...player }

      // Add missing properties for backward compatibility
      if (!updatedPlayer.email) {
        updatedPlayer.email = ""
        needsUpdate = true
      }
      if (!updatedPlayer.password) {
        updatedPlayer.password = ""
        needsUpdate = true
      }
      if (!updatedPlayer.gameHistory) {
        updatedPlayer.gameHistory = []
        needsUpdate = true
      }
      if (typeof updatedPlayer.gamesPlayed !== "number") {
        updatedPlayer.gamesPlayed = 0
        needsUpdate = true
      }
      if (typeof updatedPlayer.totalPoints !== "number") {
        updatedPlayer.totalPoints = 0
        needsUpdate = true
      }

      return updatedPlayer
    })

    if (needsUpdate) {
      localStorage.setItem(PLAYERS_KEY, JSON.stringify(updatedPlayers))
    }
  } catch (error) {
    console.error("Error migrating player data:", error)
  }
}

export const getAllPlayers = (): Player[] => {
  try {
    const stored = localStorage.getItem(PLAYERS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error loading players:", error)
    return []
  }
}

export const getPlayer = (username: string): Player | null => {
  try {
    const players = getAllPlayers()
    return players.find((p) => p.username && p.username.toLowerCase() === username.toLowerCase()) || null
  } catch (error) {
    console.error("Error getting player:", error)
    return null
  }
}

export const getPlayerByEmail = (email: string): Player | null => {
  try {
    if (!email || !email.trim()) return null
    const players = getAllPlayers()
    return players.find((p) => p.email && p.email.toLowerCase() === email.toLowerCase()) || null
  } catch (error) {
    console.error("Error getting player by email:", error)
    return null
  }
}

export const createPlayer = async (username: string, email: string, password: string): Promise<Player> => {
  try {
    const hashedPassword = await hashPassword(password)

    const newPlayer: Player = {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      totalPoints: 0,
      gamesPlayed: 0,
      joinDate: new Date().toISOString(),
      lastPlayed: new Date().toISOString(),
      gameHistory: [],
    }

    const players = getAllPlayers()
    players.push(newPlayer)
    localStorage.setItem(PLAYERS_KEY, JSON.stringify(players))

    return newPlayer
  } catch (error) {
    console.error("Error creating player:", error)
    throw new Error("Failed to create player account")
  }
}

export const authenticatePlayer = async (emailOrUsername: string, password: string): Promise<Player | null> => {
  try {
    if (!emailOrUsername || !password) return null

    const players = getAllPlayers()
    const hashedPassword = await hashPassword(password)
    const input = emailOrUsername.toLowerCase().trim()

    const player = players.find((p) => {
      if (!p.username || !p.password) return false

      const usernameMatch = p.username.toLowerCase() === input
      const emailMatch = p.email && p.email.toLowerCase() === input
      const passwordMatch = p.password === hashedPassword

      return (usernameMatch || emailMatch) && passwordMatch
    })

    if (player) {
      // Update last played
      player.lastPlayed = new Date().toISOString()
      const updatedPlayers = players.map((p) => (p.username === player.username ? player : p))
      localStorage.setItem(PLAYERS_KEY, JSON.stringify(updatedPlayers))

      // Save current user session
      saveCurrentUser(player.username)

      return player
    }

    return null
  } catch (error) {
    console.error("Error authenticating player:", error)
    return null
  }
}

// FIXED: This function now properly adds game data without double-counting
export const addGameToPlayer = (username: string, gameRecord: GameRecord): Player => {
  try {
    const players = getAllPlayers()
    const playerIndex = players.findIndex((p) => p.username === username)

    if (playerIndex !== -1) {
      // Add the EXACT game score to total points (only once)
      players[playerIndex].totalPoints += gameRecord.score

      // Increment games played by exactly 1 (only once)
      players[playerIndex].gamesPlayed += 1

      // Add to game history
      if (!players[playerIndex].gameHistory) {
        players[playerIndex].gameHistory = []
      }
      players[playerIndex].gameHistory.push(gameRecord)

      // Update last played
      players[playerIndex].lastPlayed = new Date().toISOString()

      // Save updated players array
      localStorage.setItem(PLAYERS_KEY, JSON.stringify(players))

      console.log(
        `Added game for ${username}: Score ${gameRecord.score}, Total: ${players[playerIndex].totalPoints}, Games: ${players[playerIndex].gamesPlayed}`,
      )

      return players[playerIndex]
    }

    throw new Error("Player not found")
  } catch (error) {
    console.error("Error adding game to player:", error)
    throw error
  }
}

export const getPlayerTotalScores = (): Player[] => {
  try {
    return getAllPlayers()
      .filter((p) => p.email && p.password && p.totalPoints > 0)
      .sort((a, b) => b.totalPoints - a.totalPoints)
  } catch (error) {
    console.error("Error getting player total scores:", error)
    return []
  }
}

// FIXED: Enhanced score functions - now only saves score once and updates player once
export const saveScore = (newScore: Score): Score[] => {
  try {
    // Save to scores leaderboard
    const existingScores = getHighScores()
    const updatedScores = [...existingScores, newScore].sort((a, b) => b.score - a.score)
    localStorage.setItem(SCORES_KEY, JSON.stringify(updatedScores))

    // Create game record for player history
    const gameRecord: GameRecord = {
      score: newScore.score,
      moves: newScore.moves,
      time: newScore.time,
      difficulty: newScore.difficulty,
      date: newScore.date,
    }

    // Add game to player's history (this will update total points and games played)
    addGameToPlayer(newScore.playerName, gameRecord)

    console.log(`Saved score: ${newScore.score} for ${newScore.playerName}`)

    return updatedScores
  } catch (error) {
    console.error("Error saving score:", error)
    return getHighScores()
  }
}

export const getHighScores = (): Score[] => {
  try {
    const stored = localStorage.getItem(SCORES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error loading scores:", error)
    return []
  }
}

export const getScoresByDifficulty = (difficulty?: string): Score[] => {
  try {
    const allScores = getHighScores()
    if (!difficulty || difficulty === "all") {
      return allScores
    }
    return allScores.filter((score) => score.difficulty === difficulty)
  } catch (error) {
    console.error("Error filtering scores by difficulty:", error)
    return []
  }
}

// Enhanced search functions
export const searchScores = (query: string, difficulty?: string): Score[] => {
  try {
    const scores = getScoresByDifficulty(difficulty)
    if (!query.trim()) return scores

    const searchTerm = query.toLowerCase().trim()

    return scores.filter((score) => {
      // Search in player name
      const nameMatch = score.playerName.toLowerCase().includes(searchTerm)

      // Search in score (convert to string)
      const scoreMatch = score.score.toString().includes(searchTerm)

      // Search in moves (convert to string)
      const movesMatch = score.moves.toString().includes(searchTerm)

      // Search in time (convert to string)
      const timeMatch = score.time.toString().includes(searchTerm)

      // Search in difficulty
      const difficultyMatch = score.difficulty.toLowerCase().includes(searchTerm)

      // Search in date (format: DD/MM/YYYY)
      const date = new Date(score.date)
      const formattedDate = date.toLocaleDateString()
      const dateMatch = formattedDate.includes(searchTerm)

      // Search in day/month/year separately
      const day = date.getDate().toString()
      const month = (date.getMonth() + 1).toString()
      const year = date.getFullYear().toString()
      const dayMatch = day.includes(searchTerm)
      const monthMatch = month.includes(searchTerm)
      const yearMatch = year.includes(searchTerm)

      return (
        nameMatch ||
        scoreMatch ||
        movesMatch ||
        timeMatch ||
        difficultyMatch ||
        dateMatch ||
        dayMatch ||
        monthMatch ||
        yearMatch
      )
    })
  } catch (error) {
    console.error("Error searching scores:", error)
    return []
  }
}

export const searchPlayers = (query: string): Player[] => {
  try {
    const players = getPlayerTotalScores()
    if (!query.trim()) return players

    const searchTerm = query.toLowerCase().trim()

    return players.filter((player) => {
      // Search in username
      const nameMatch = player.username.toLowerCase().includes(searchTerm)

      // Search in total points
      const pointsMatch = player.totalPoints.toString().includes(searchTerm)

      // Search in games played
      const gamesMatch = player.gamesPlayed.toString().includes(searchTerm)

      // Search in join date
      const joinDate = new Date(player.joinDate)
      const formattedJoinDate = joinDate.toLocaleDateString()
      const joinDateMatch = formattedJoinDate.includes(searchTerm)

      // Search in last played date
      const lastDate = new Date(player.lastPlayed)
      const formattedLastDate = lastDate.toLocaleDateString()
      const lastDateMatch = formattedLastDate.includes(searchTerm)

      return nameMatch || pointsMatch || gamesMatch || joinDateMatch || lastDateMatch
    })
  } catch (error) {
    console.error("Error searching players:", error)
    return []
  }
}
