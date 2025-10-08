"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, Settings } from "lucide-react"
import { TransactionProvider } from "./context/TransactionContext"
import { ThemeProvider, useTheme } from "./context/ThemeContext"
import TransactionForm from "./components/TransactionForm"
import TransactionList from "./components/TransactionList"
import Summary from "./components/Summary"
import CategoryFilter from "./components/CategoryFilter"
import Chart from "./components/Chart"
import SearchBar from "./components/SearchBar"
import "./styles/global.css"

function AppContent() {
  const { theme, toggleTheme } = useTheme()
  const [showSettings, setShowSettings] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div className="min-h-screen app-background" variants={containerVariants} initial="hidden" animate="visible">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div className="header-section" variants={itemVariants}>
          <div className="flex items-center justify-between mb-8">
            <motion.div
              className="logo-section"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <h1 className="app-title">
                <motion.span
                  className="title-icon"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                >
                  💰
                </motion.span>
                Smart Expense Tracker
              </h1>
              <p className="app-subtitle">Track your finances like a pro! 📊</p>
            </motion.div>

            <div className="header-controls">
              <motion.button
                className="control-button"
                onClick={() => setShowSettings(!showSettings)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Settings size={20} />
              </motion.button>

              <motion.button
                className="theme-toggle"
                onClick={toggleTheme}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ rotate: theme === "dark" ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                className="settings-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="settings-content">
                  <h3>⚙️ Settings</h3>
                  <div className="setting-item">
                    <span>Theme: {theme === "light" ? "☀️ Light" : "🌙 Dark"}</span>
                    <button onClick={toggleTheme} className="setting-toggle">
                      Switch to {theme === "light" ? "Dark" : "Light"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Summary Section */}
        <motion.div variants={itemVariants}>
          <Summary />
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div className="controls-section" variants={itemVariants}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8 mb-6">
            <SearchBar />
            <CategoryFilter />
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div className="main-content" variants={itemVariants}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transaction Form */}
            <div className="lg:col-span-1">
              <TransactionForm />
            </div>

            {/* Transactions List */}
            <div className="lg:col-span-2">
              <TransactionList />
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <motion.div className="charts-section" variants={itemVariants}>
          <div className="mt-8">
            <Chart />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <TransactionProvider>
        <AppContent />
      </TransactionProvider>
    </ThemeProvider>
  )
}

export default App
