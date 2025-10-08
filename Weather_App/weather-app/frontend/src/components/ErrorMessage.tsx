"use client"

import type React from "react"

interface ErrorMessageProps {
  message: string
  onClose: () => void
  type?: "error" | "warning" | "info"
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose, type = "error" }) => {
  const getIcon = () => {
    switch (type) {
      case "warning":
        return "⚠️"
      case "info":
        return "ℹ️"
      default:
        return "❌"
    }
  }

  const getClassName = () => {
    switch (type) {
      case "warning":
        return "error-message warning"
      case "info":
        return "error-message info"
      default:
        return "error-message error"
    }
  }

  return (
    <div className={getClassName()}>
      <div className="error-content">
        <span className="error-icon">{getIcon()}</span>
        <span className="error-text">{message}</span>
      </div>
      <button onClick={onClose} className="close-button" aria-label="Close">
        ✕
      </button>
    </div>
  )
}

export default ErrorMessage
