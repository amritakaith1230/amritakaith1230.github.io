"use client"

import { motion } from "framer-motion"
import { Filter, X } from "lucide-react"
import { useTransactions } from "../context/TransactionContext"

function CategoryFilter() {
  const { filter, setFilter, transactions } = useTransactions()

  const categories = [...new Set(transactions.map((t) => t.category))].sort()

  const filterOptions = [
    { value: "all", label: "All Transactions", icon: "📊" },
    { value: "income", label: "Income Only", icon: "💰" },
    { value: "expense", label: "Expenses Only", icon: "💸" },
    ...categories.map((cat) => ({ value: cat, label: cat, icon: "📂" })),
  ]

  return (
    <motion.div
      className="filter-container"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="filter-content">
        <div className="filter-label">
          <Filter size={16} />
          Filter:
        </div>

        <motion.select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.icon} {option.label}
            </option>
          ))}
        </motion.select>

        {filter !== "all" && (
          <motion.button
            onClick={() => setFilter("all")}
            className="clear-filter"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Clear filter"
          >
            <X size={14} />
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default CategoryFilter
