"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react"
import { useTransactions } from "../context/TransactionContext"

function Summary() {
  const { summary, loading } = useTransactions()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  if (loading) {
    return (
      <motion.div className="summary-grid" variants={containerVariants} initial="hidden" animate="visible">
        {[...Array(4)].map((_, i) => (
          <motion.div key={i} className="summary-card loading" variants={cardVariants}>
            <div className="loading-content">
              <div className="loading-icon"></div>
              <div className="loading-text">
                <div className="loading-line short"></div>
                <div className="loading-line long"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    )
  }

  const { totalIncome, totalExpenses, netIncome } = summary.summary || {}
  const totalTransactions = summary.summary?.totalTransactions || 0

  const summaryData = [
    {
      title: "Total Income",
      value: totalIncome || 0,
      icon: TrendingUp,
      type: "income",
      color: "green",
    },
    {
      title: "Total Expenses",
      value: totalExpenses || 0,
      icon: TrendingDown,
      type: "expense",
      color: "red",
    },
    {
      title: "Net Income",
      value: netIncome || 0,
      icon: DollarSign,
      type: (netIncome || 0) >= 0 ? "positive" : "negative",
      color: (netIncome || 0) >= 0 ? "blue" : "red",
    },
    {
      title: "Transactions",
      value: totalTransactions,
      icon: Activity,
      type: "neutral",
      color: "gray",
      isCount: true,
    },
  ]

  return (
    <motion.div className="summary-grid" variants={containerVariants} initial="hidden" animate="visible">
      {summaryData.map((item, index) => {
        const Icon = item.icon
        return (
          <motion.div
            key={item.title}
            className={`summary-card ${item.color}`}
            variants={cardVariants}
            whileHover={{
              scale: 1.05,
              y: -5,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="card-content">
              <div className="card-header">
                <div className={`card-icon ${item.color}`}>
                  <Icon size={24} />
                </div>
                <div className="card-info">
                  <p className="card-title">{item.title}</p>
                  <motion.p
                    className={`card-value ${item.type}`}
                    key={item.value} // Re-animate when value changes
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.isCount ? item.value : `₹${item.value.toLocaleString()}`}
                  </motion.p>
                </div>
              </div>

              {/* Progress indicator for income vs expenses */}
              {(item.type === "income" || item.type === "expense") && totalIncome > 0 && (
                <div className="progress-container">
                  <div
                    className={`progress-bar ${item.type}`}
                    style={{
                      width: `${(item.value / (totalIncome + totalExpenses)) * 100}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default Summary
