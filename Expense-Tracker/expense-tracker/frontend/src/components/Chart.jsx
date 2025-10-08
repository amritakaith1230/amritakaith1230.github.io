"use client"

import { motion } from "framer-motion"
import { BarChart3 } from "lucide-react"
import { useTransactions } from "../context/TransactionContext"

function Chart() {
  const { summary } = useTransactions()
  const categoryBreakdown = summary.categoryBreakdown || []

  if (categoryBreakdown.length === 0) {
    return null
  }

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      Food: "🍕",
      Transportation: "🚗",
      Entertainment: "🎬",
      Shopping: "🛍️",
      Bills: "📄",
      Healthcare: "🏥",
      Education: "📚",
      Other: "📦",
      Salary: "💼",
      Freelance: "💻",
      Business: "🏢",
      Investment: "📈",
      Gift: "🎁",
    }
    return emojiMap[category] || "📦"
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      className="chart-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="chart-header">
        <h2 className="chart-title">
          <BarChart3 size={20} />
          Expense Breakdown by Category
        </h2>
      </div>

      <motion.div className="chart-grid" variants={containerVariants} initial="hidden" animate="visible">
        {categoryBreakdown.map((item, index) => (
          <motion.div
            key={item.category}
            className="category-card"
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              y: -5,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="category-icon"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 3,
                delay: index * 0.2,
              }}
            >
              {getCategoryEmoji(item.category)}
            </motion.div>

            <h3 className="category-name">{item.category}</h3>

            <motion.p
              className="category-amount"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              ₹{Number.parseFloat(item.amount).toLocaleString()}
            </motion.p>

            <div className="category-stats">
              <div className="stat-item">
                <span className="stat-label">Share:</span>
                <span className="stat-value">{item.percentage}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Count:</span>
                <span className="stat-value">{item.count}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Avg:</span>
                <span className="stat-value">₹{item.avgAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="progress-container">
              <motion.div
                className="progress-bar"
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default Chart
