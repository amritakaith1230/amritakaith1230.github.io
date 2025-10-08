import type { Score } from "../types/game"

const STORAGE_KEY = "memory-game-scores"

export const saveScore = (newScore: Score): Score[] => {
  const existingScores = getHighScores()
  const updatedScores = [...existingScores, newScore].sort((a, b) => b.score - a.score).slice(0, 10) // Keep only top 10 scores

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScores))
  return updatedScores
}

export const getHighScores = (): Score[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error loading scores:", error)
    return []
  }
}

export const clearScores = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}
