"use client"

import type React from "react"
import type { Card, Difficulty } from "../types/game"

interface GameBoardProps {
  cards: Card[]
  flippedCards: number[]
  matchedPairs: number[]
  onCardClick: (index: number) => void
  difficulty: Difficulty
}

const GameBoard: React.FC<GameBoardProps> = ({ cards, flippedCards, matchedPairs, onCardClick, difficulty }) => {
  const getGridClass = () => {
    switch (difficulty) {
      case "easy":
        return "grid-cols-3 md:grid-cols-4"
      case "medium":
        return "grid-cols-4 md:grid-cols-4"
      case "hard":
        return "grid-cols-4 md:grid-cols-6"
      default:
        return "grid-cols-4"
    }
  }

  const isCardVisible = (index: number) => {
    return flippedCards.includes(index) || matchedPairs.includes(cards[index]?.id)
  }

  const isCardMatched = (index: number) => {
    return matchedPairs.includes(cards[index]?.id)
  }

  return (
    <div className={`grid ${getGridClass()} gap-3 md:gap-4 max-w-4xl mx-auto p-4`}>
      {cards.map((card, index) => (
        <div
          key={index}
          onClick={() => onCardClick(index)}
          className={`
            relative aspect-square cursor-pointer transform transition-all duration-300 hover:scale-105
            ${isCardMatched(index) ? "opacity-75" : ""}
          `}
        >
          <div
            className={`
            absolute inset-0 rounded-xl shadow-lg transition-transform duration-500 preserve-3d
            ${isCardVisible(index) ? "rotate-y-180" : ""}
          `}
          >
            {/* Card Back */}
            <div className="absolute inset-0 backface-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <div className="text-2xl md:text-4xl">🎴</div>
            </div>

            {/* Card Front */}
            <div
              className={`
              absolute inset-0 backface-hidden rounded-xl rotate-y-180 flex items-center justify-center text-4xl md:text-6xl
              ${
                isCardMatched(index)
                  ? "bg-gradient-to-br from-green-400 to-emerald-500"
                  : "bg-gradient-to-br from-white to-gray-100"
              }
            `}
            >
              {card.emoji}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default GameBoard
