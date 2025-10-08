import type { Card, Difficulty } from "../types/game"

const emojis = [
  "🐶",
  "🐱",
  "🐭",
  "🐹",
  "🐰",
  "🦊",
  "🐻",
  "🐼",
  "🐨",
  "🐯",
  "🦁",
  "🐮",
  "🐷",
  "🐸",
  "🐵",
  "🐔",
  "🦄",
  "🐝",
  "🐛",
  "🦋",
  "🐌",
  "🐞",
  "🐜",
  "🦗",
  "🍎",
  "🍊",
  "🍋",
  "🍌",
  "🍉",
  "🍇",
  "🍓",
  "🍈",
  "🍒",
  "🍑",
  "🥭",
  "🍍",
  "🥥",
  "🥝",
  "🍅",
  "🍆",
  "🥑",
  "🥦",
  "🥒",
  "🌶️",
  "🌽",
  "🥕",
  "🧄",
  "🧅",
]

export const generateCards = (difficulty: Difficulty): Card[] => {
  let pairCount: number

  switch (difficulty) {
    case "easy":
      pairCount = 6 // 3x4 grid
      break
    case "medium":
      pairCount = 8 // 4x4 grid
      break
    case "hard":
      pairCount = 18 // 6x6 grid
      break
    default:
      pairCount = 8
  }

  const selectedEmojis = emojis.slice(0, pairCount)
  const cards: Card[] = []

  selectedEmojis.forEach((emoji, index) => {
    // Create two cards for each emoji (a pair)
    cards.push({ id: index, emoji })
    cards.push({ id: index, emoji })
  })

  return cards
}

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
