const express = require("express")
const router = express.Router()
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
} = require("../controllers/transactionController")
const { validateTransaction } = require("../middleware/validation")

// Routes
router.get("/", getTransactions)
router.post("/", validateTransaction, createTransaction)
router.put("/:id", validateTransaction, updateTransaction)
router.delete("/:id", deleteTransaction)
router.get("/summary", getSummary)

module.exports = router
