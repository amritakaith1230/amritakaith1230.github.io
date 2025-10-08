"use client"

import type React from "react"
import type { Difficulty } from "../types/game"

interface DifficultySelectorProps {
  onStart: (difficulty: Difficulty) => void
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ onStart }) => {
  const difficulties = [
    {
      level: "easy" as Difficulty,
      name: "Easy",
      description: "3×4 Grid (12 cards)",
      color: "from-green-500 to-emerald-600",
      icon: "😊",
    },
    {
      level: "medium" as Difficulty,
      name: "Medium",
      description: "4×4 Grid (16 cards)",
      color: "from-yellow-500 to-orange-600",
      icon: "🤔",
    },
    {
      level: "hard" as Difficulty,
      name: "Hard",
      description: "6×6 Grid (36 cards)",
      color: "from-red-500 to-pink-600",
      icon: "😤",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto mb-12">
      <h2 className="text-3xl font-bold text-center mb-8">Choose Difficulty</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {difficulties.map((diff) => (
          <button
            key={diff.level}
            onClick={() => onStart(diff.level)}
            className={`
              bg-gradient-to-br ${diff.color} p-6 rounded-2xl shadow-xl 
              transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
              text-white group
            `}
          >
            <div className="text-4xl mb-4">{diff.icon}</div>
            <h3 className="text-2xl font-bold mb-2">{diff.name}</h3>
            <p className="text-white/90">{diff.description}</p>
            <div className="mt-4 bg-white/20 rounded-lg py-2 px-4 group-hover:bg-white/30 transition-colors">
              Start Game
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default DifficultySelector
