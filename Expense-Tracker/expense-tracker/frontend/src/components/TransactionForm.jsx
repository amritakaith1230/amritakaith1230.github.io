"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit3, Save, X, DollarSign, Calendar, Tag, FileText } from "lucide-react"
import { useTransactions } from "../context/TransactionContext"
import { validateTransactionData } from "../utils/validation"

const categories = {
  income: ["Salary", "Freelance", "Business", "Investment", "Gift", "Other"],
  expense: ["Food", "Transportation", "Entertainment", "Shopping", "Bills", "Healthcare", "Education", "Other"],
}

function TransactionForm() {
  const { addTransaction, updateTransaction, editingTransaction, setEditingTransaction } = useTransactions()

  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    description: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        type: editingTransaction.type,
        amount: editingTransaction.amount.toString(),
        description: editingTransaction.description,
        category: editingTransaction.category,
        date: editingTransaction.date.split("T")[0],
      })
      setIsExpanded(true)
    }
  }, [editingTransaction])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "type" && { category: "" }),
    }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validateTransactionData(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const transactionData = {
        ...formData,
        amount: Number.parseFloat(formData.amount),
      }

      let result
      if (editingTransaction) {
        result = await updateTransaction(editingTransaction._id, transactionData)
      } else {
        result = await addTransaction(transactionData)
      }

      if (result.success) {
        setFormData({
          type: "expense",
          amount: "",
          description: "",
          category: "",
          date: new Date().toISOString().split("T")[0],
        })
        setErrors({})
        setIsExpanded(false)
        alert(result.message)
      } else {
        alert(result.message)
      }
    } catch (error) {
      alert("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setEditingTransaction(null)
    setFormData({
      type: "expense",
      amount: "",
      description: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
    })
    setErrors({})
    setIsExpanded(false)
  }

  const formVariants = {
    collapsed: { height: "auto" },
    expanded: { height: "auto" },
  }

  const contentVariants = {
    collapsed: { opacity: 0, y: -10 },
    expanded: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      className="form-card"
      layout
      variants={formVariants}
      animate={isExpanded ? "expanded" : "collapsed"}
      transition={{ duration: 0.3 }}
    >
      <div className="form-header">
        <motion.h2 className="form-title" layout>
          {editingTransaction ? (
            <>
              <Edit3 size={20} />
              Edit Transaction
            </>
          ) : (
            <>
              <Plus size={20} />
              Add Transaction
            </>
          )}
        </motion.h2>

        {!isExpanded && !editingTransaction && (
          <motion.button
            className="expand-button"
            onClick={() => setIsExpanded(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={16} />
            Quick Add
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {(isExpanded || editingTransaction) && (
          <motion.form
            onSubmit={handleSubmit}
            className="form-content"
            variants={contentVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            transition={{ duration: 0.3 }}
          >
            {/* Transaction Type */}
            <div className="form-group">
              <label className="form-label">Transaction Type</label>
              <div className="type-selector">
                <motion.label
                  className={`type-option ${formData.type === "income" ? "selected income" : ""}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name="type"
                    value="income"
                    checked={formData.type === "income"}
                    onChange={handleChange}
                  />
                  <span className="type-icon">💰</span>
                  Income
                </motion.label>
                <motion.label
                  className={`type-option ${formData.type === "expense" ? "selected expense" : ""}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name="type"
                    value="expense"
                    checked={formData.type === "expense"}
                    onChange={handleChange}
                  />
                  <span className="type-icon">💸</span>
                  Expense
                </motion.label>
              </div>
            </div>

            {/* Amount */}
            <div className="form-group">
              <label htmlFor="amount" className="form-label">
                <DollarSign size={16} />
                Amount (₹)
              </label>
              <motion.input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                className={`form-input ${errors.amount ? "error" : ""}`}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
              <AnimatePresence>
                {errors.amount && (
                  <motion.p
                    className="error-message"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {errors.amount}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                <FileText size={16} />
                Description
              </label>
              <motion.input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What was this for?"
                maxLength="200"
                className={`form-input ${errors.description ? "error" : ""}`}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
              <AnimatePresence>
                {errors.description && (
                  <motion.p
                    className="error-message"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {errors.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                <Tag size={16} />
                Category
              </label>
              <motion.select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`form-input ${errors.category ? "error" : ""}`}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <option value="">Select category</option>
                {categories[formData.type].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </motion.select>
              <AnimatePresence>
                {errors.category && (
                  <motion.p
                    className="error-message"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {errors.category}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Date */}
            <div className="form-group">
              <label htmlFor="date" className="form-label">
                <Calendar size={16} />
                Date
              </label>
              <motion.input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`form-input ${errors.date ? "error" : ""}`}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
              <AnimatePresence>
                {errors.date && (
                  <motion.p
                    className="error-message"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {errors.date}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Buttons */}
            <div className="form-actions">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`submit-button ${formData.type}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    ⏳
                  </motion.div>
                ) : (
                  <>
                    <Save size={16} />
                    {editingTransaction ? "Update" : "Add"} Transaction
                  </>
                )}
              </motion.button>

              {(editingTransaction || isExpanded) && (
                <motion.button
                  type="button"
                  onClick={handleCancel}
                  className="cancel-button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <X size={16} />
                  Cancel
                </motion.button>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default TransactionForm
