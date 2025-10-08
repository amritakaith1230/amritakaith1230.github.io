"use client"

import type React from "react"
import { useState } from "react"
import { toggleSound } from "../utils/soundUtils"

const SoundToggle: React.FC = () => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)

  const handleToggle = () => {
    const newState = toggleSound()
    setIsSoundEnabled(newState)
  }

  return (
    <button
      onClick={handleToggle}
      className="fixed top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-3 text-2xl hover:bg-white/30 transition-all duration-200 z-50"
      title={isSoundEnabled ? "Disable Sound" : "Enable Sound"}
    >
      {isSoundEnabled ? "🔊" : "🔇"}
    </button>
  )
}

export default SoundToggle
