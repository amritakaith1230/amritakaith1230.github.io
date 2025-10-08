export interface Card {
  id: number
  emoji: string
}

export type Difficulty = "easy" | "medium" | "hard"

export type GameState = "menu" | "playing" | "completed"

export interface Player {
  username: string
  email: string
  password: string // This will be hashed
  totalPoints: number
  gamesPlayed: number
  joinDate: string
  lastPlayed: string
  gameHistory: GameRecord[]
}

export interface GameRecord {
  score: number
  moves: number
  time: number
  difficulty: Difficulty
  date: string
}

export interface Score {
  score: number
  moves: number
  time: number
  difficulty: Difficulty
  date: string
  playerName: string
}
