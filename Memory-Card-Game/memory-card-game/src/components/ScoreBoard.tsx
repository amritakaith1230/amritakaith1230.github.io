import type React from "react"
import type { Score } from "../types/game"

interface ScoreBoardProps {
  scores: Score[]
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ scores }) => {
  if (scores.length === 0) {
    return null
  }

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

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
      <h3 className="text-2xl font-bold text-center mb-6">🏆 High Scores</h3>
      <div className="space-y-3">
        {scores.slice(0, 5).map((score, index) => (
          <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="text-2xl">{index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🏅"}</div>
              <div>
                <div className="font-semibold">{score.score} points</div>
                <div className="text-sm text-gray-300">
                  {score.playerName || "Anonymous"} • {score.moves} moves • {formatTime(score.time)}
                </div>
              </div>
            </div>
            <div className={`capitalize font-semibold ${getDifficultyColor(score.difficulty)}`}>{score.difficulty}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScoreBoard
