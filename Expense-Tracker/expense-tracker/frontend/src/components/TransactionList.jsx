"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Edit3, Trash2, TrendingUp, TrendingDown } from "lucide-react"
import { useTransactions } from "../context/TransactionContext"

function TransactionList() {
  const { transactions, loading, filter, searchFilter, deleteTransaction, setEditingTransaction } = useTransactions()

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
  }

  const handleDelete = async (id, description) => {
    if (window.confirm(`Are you sure you want to delete "${description}"?`)) {
      const result = await deleteTransaction(id)
      if (result.success) {
        alert(result.message)
      } else {
        alert(result.message)
      }
    }
  }

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter = filter === "all" || filter === transaction.type || filter === transaction.category

    const matchesSearch =
      !searchFilter ||
      transaction.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchFilter.toLowerCase())

    return matchesFilter && matchesSearch
  })

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      x: -100,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  }

  if (loading) {
    return (
      <motion.div className="list-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="list-title">📋 Recent Transactions</h2>
        <div className="loading-container">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="loading-item"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.1 }}
            />
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="list-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="list-header">
        <h2 className="list-title">
          📋 Recent Transactions
          <span className="transaction-count">
            ({filteredTransactions.length} {filter !== "all" ? "filtered" : "total"})
          </span>
        </h2>
      </div>

      <motion.div className="transaction-container" variants={containerVariants} initial="hidden" animate="visible">
        <AnimatePresence mode="popLayout">
          {filteredTransactions.length === 0 ? (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="empty-icon"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                📊
              </motion.div>
              <p className="empty-title">No transactions found</p>
              <p className="empty-subtitle">
                {searchFilter ? "Try adjusting your search" : "Add your first transaction to get started! 🚀"}
              </p>
            </motion.div>
          ) : (
            filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction._id}
                className={`transaction-item ${transaction.type}`}
                variants={itemVariants}
                layout
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="transaction-content">
                  <div className="transaction-main">
                    <div className="transaction-icon">
                      {transaction.type === "income" ? (
                        <TrendingUp className="icon income-icon" size={20} />
                      ) : (
                        <TrendingDown className="icon expense-icon" size={20} />
                      )}
                    </div>

                    <div className="transaction-details">
                      <h3 className="transaction-description">{transaction.description}</h3>
                      <div className="transaction-meta">
                        <span className={`category-tag ${transaction.type}`}>{transaction.category}</span>
                        <span className="transaction-date">
                          {new Date(transaction.date).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="transaction-amount">
                    <span className={`amount ${transaction.type}`}>
                      {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="transaction-actions">
                    <motion.button
                      onClick={() => handleEdit(transaction)}
                      className="action-button edit"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Edit transaction"
                    >
                      <Edit3 size={16} />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(transaction._id, transaction.description)}
                      className="action-button delete"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Delete transaction"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default TransactionList
