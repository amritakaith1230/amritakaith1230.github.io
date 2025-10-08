"use client"

import { createContext, useContext, useState, useEffect } from "react"

const TransactionContext = createContext()

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([])

  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState("all")
  const [searchFilter, setSearchFilter] = useState("")
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [summary, setSummary] = useState({})

  // Calculate summary whenever transactions change
  useEffect(() => {
    calculateSummary()
  }, [transactions])

  const calculateSummary = () => {
    const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    const netIncome = totalIncome - totalExpenses
    const totalTransactions = transactions.length

    // Category breakdown for expenses
    const expensesByCategory = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = { amount: 0, count: 0 }
        }
        acc[t.category].amount += t.amount
        acc[t.category].count += 1
        return acc
      }, {})

    const categoryBreakdown = Object.entries(expensesByCategory)
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        count: data.count,
        percentage: totalExpenses > 0 ? Math.round((data.amount / totalExpenses) * 100) : 0,
        avgAmount: Math.round(data.amount / data.count),
      }))
      .sort((a, b) => b.amount - a.amount)

    setSummary({
      summary: {
        totalIncome,
        totalExpenses,
        netIncome,
        totalTransactions,
      },
      categoryBreakdown,
    })
  }

  const addTransaction = async (transactionData) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newTransaction = {
        ...transactionData,
        _id: Date.now().toString(),
        date: new Date(transactionData.date).toISOString(),
      }

      setTransactions((prev) => [newTransaction, ...prev])
      return { success: true, message: "Transaction added successfully!" }
    } catch (error) {
      return { success: false, message: "Failed to add transaction" }
    } finally {
      setLoading(false)
    }
  }

  const updateTransaction = async (id, transactionData) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setTransactions((prev) =>
        prev.map((t) =>
          t._id === id ? { ...transactionData, _id: id, date: new Date(transactionData.date).toISOString() } : t,
        ),
      )

      setEditingTransaction(null)
      return { success: true, message: "Transaction updated successfully!" }
    } catch (error) {
      return { success: false, message: "Failed to update transaction" }
    } finally {
      setLoading(false)
    }
  }

  const deleteTransaction = async (id) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      setTransactions((prev) => prev.filter((t) => t._id !== id))
      return { success: true, message: "Transaction deleted successfully!" }
    } catch (error) {
      return { success: false, message: "Failed to delete transaction" }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    transactions,
    loading,
    filter,
    setFilter,
    searchFilter,
    setSearchFilter,
    editingTransaction,
    setEditingTransaction,
    summary,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  }

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>
}

export function useTransactions() {
  const context = useContext(TransactionContext)
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionProvider")
  }
  return context
}
