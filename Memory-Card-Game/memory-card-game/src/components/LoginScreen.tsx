"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Player } from "../types/game"
import { getAllPlayers, createPlayer, authenticatePlayer, getPlayerByEmail } from "../utils/playerStorage"
import { validateEmail, validatePassword, validateUsername } from "../utils/auth"

interface LoginScreenProps {
  onLogin: (player: Player) => void
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [existingPlayers, setExistingPlayers] = useState<Player[]>([])

  useEffect(() => {
    try {
      const players = getAllPlayers()
      setExistingPlayers(players.filter((p) => p.email && p.password))
    } catch (error) {
      console.error("Error loading players:", error)
      setExistingPlayers([])
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    try {
      if (isSignUp) {
        const usernameValidation = validateUsername(formData.username)
        if (!usernameValidation.isValid) {
          newErrors.username = usernameValidation.message
        } else {
          const existingPlayer = getAllPlayers().find(
            (p) => p.username && p.username.toLowerCase() === formData.username.toLowerCase(),
          )
          if (existingPlayer) {
            newErrors.username = "Username already exists"
          }
        }

        if (!validateEmail(formData.email)) {
          newErrors.email = "Please enter a valid email address"
        } else {
          const existingEmail = getPlayerByEmail(formData.email)
          if (existingEmail) {
            newErrors.email = "Email already registered"
          }
        }

        const passwordValidation = validatePassword(formData.password)
        if (!passwordValidation.isValid) {
          newErrors.password = passwordValidation.message
        }

        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match"
        }
      } else {
        if (!formData.email.trim()) {
          newErrors.email = "Email or username is required"
        }
        if (!formData.password.trim()) {
          newErrors.password = "Password is required"
        }
      }
    } catch (error) {
      console.error("Error validating form:", error)
      newErrors.general = "Validation error occurred"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      if (isSignUp) {
        const newPlayer = await createPlayer(formData.username, formData.email, formData.password)
        onLogin(newPlayer)
      } else {
        const player = await authenticatePlayer(formData.email, formData.password)
        if (player) {
          onLogin(player)
        } else {
          setErrors({ password: "Invalid email/username or password" })
        }
      }
    } catch (error) {
      console.error("Authentication error:", error)
      setErrors({ general: "An error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ username: "", email: "", password: "", confirmPassword: "" })
    setErrors({})
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    resetForm()
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{isSignUp ? "🎮" : "🔐"}</div>
          <h2 className="text-3xl font-bold mb-2">{isSignUp ? "Create Account" : "Welcome Back!"}</h2>
          <p className="text-gray-300">{isSignUp ? "Join the memory game community" : "Sign in to continue playing"}</p>
        </div>

        {existingPlayers.length > 0 && !isSignUp && (
          <div className="mb-6 p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
            <p className="text-sm text-blue-200 text-center">
              🎯 {existingPlayers.length} player{existingPlayers.length > 1 ? "s" : ""} registered
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
              {errors.general}
            </div>
          )}

          {isSignUp && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Choose a unique username"
                className={`w-full px-4 py-3 bg-white/20 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 ${
                  errors.username ? "border-red-500" : "border-white/30"
                }`}
                maxLength={20}
              />
              {errors.username && <p className="mt-1 text-red-400 text-sm">{errors.username}</p>}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              {isSignUp ? "Email Address" : "Email or Username"}
            </label>
            <input
              type={isSignUp ? "email" : "text"}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={isSignUp ? "your.email@example.com" : "Email or username"}
              className={`w-full px-4 py-3 bg-white/20 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 ${
                errors.email ? "border-red-500" : "border-white/30"
              }`}
            />
            {errors.email && <p className="mt-1 text-red-400 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={isSignUp ? "Create a strong password" : "Enter your password"}
              className={`w-full px-4 py-3 bg-white/20 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 ${
                errors.password ? "border-red-500" : "border-white/30"
              }`}
            />
            {errors.password && <p className="mt-1 text-red-400 text-sm">{errors.password}</p>}
            {isSignUp && (
              <p className="mt-1 text-xs text-gray-400">
                Must contain: 6+ characters, uppercase, lowercase, and number
              </p>
            )}
          </div>

          {isSignUp && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className={`w-full px-4 py-3 bg-white/20 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 ${
                  errors.confirmPassword ? "border-red-500" : "border-white/30"
                }`}
              />
              {errors.confirmPassword && <p className="mt-1 text-red-400 text-sm">{errors.confirmPassword}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {isSignUp ? "Creating Account..." : "Signing In..."}
              </span>
            ) : (
              <span>{isSignUp ? "Create Account & Play! 🚀" : "Sign In & Play! 🎮"}</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={toggleMode}
            className="text-yellow-400 hover:text-yellow-300 underline transition-colors duration-200"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>🔒 Your data is stored securely in your browser</p>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen
