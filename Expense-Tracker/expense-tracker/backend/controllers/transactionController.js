const Transaction = require("../models/Transaction")
const { validationResult } = require("express-validator")

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Public
const getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, limit = 50, page = 1 } = req.query

    // Build filter object
    const filter = {}
    if (type) filter.type = type
    if (category) filter.category = category

    if (startDate || endDate) {
      filter.date = {}
      if (startDate) filter.date.$gte = new Date(startDate)
      if (endDate) filter.date.$lte = new Date(endDate)
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    const transactions = await Transaction.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .limit(Number.parseInt(limit))
      .skip(skip)

    const total = await Transaction.countDocuments(filter)

    res.json({
      success: true,
      data: transactions,
      pagination: {
        current: Number.parseInt(page),
        total: Math.ceil(total / limit),
        count: transactions.length,
        totalRecords: total,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching transactions",
      error: error.message,
    })
  }
}

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Public
const createTransaction = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      })
    }

    const transaction = new Transaction(req.body)
    await transaction.save()

    res.status(201).json({
      success: true,
      message: "🎉 Transaction created successfully!",
      data: transaction,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating transaction",
      error: error.message,
    })
  }
}

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Public
const updateTransaction = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      })
    }

    const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      })
    }

    res.json({
      success: true,
      message: "✅ Transaction updated successfully!",
      data: transaction,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating transaction",
      error: error.message,
    })
  }
}

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Public
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id)

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      })
    }

    res.json({
      success: true,
      message: "🗑️ Transaction deleted successfully!",
      data: transaction,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting transaction",
      error: error.message,
    })
  }
}

// @desc    Get financial summary
// @route   GET /api/transactions/summary
// @access  Public
const getSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    const dateFilter = {}

    if (startDate || endDate) {
      dateFilter.date = {}
      if (startDate) dateFilter.date.$gte = new Date(startDate)
      if (endDate) dateFilter.date.$lte = new Date(endDate)
    }

    // Calculate totals
    const [incomeResult, expenseResult] = await Promise.all([
      Transaction.aggregate([
        { $match: { type: "income", ...dateFilter } },
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
      Transaction.aggregate([
        { $match: { type: "expense", ...dateFilter } },
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
    ])

    const totalIncome = incomeResult[0]?.total || 0
    const totalExpenses = expenseResult[0]?.total || 0
    const incomeCount = incomeResult[0]?.count || 0
    const expenseCount = expenseResult[0]?.count || 0
    const netIncome = totalIncome - totalExpenses

    // Category breakdown for expenses
    const categoryBreakdown = await Transaction.aggregate([
      { $match: { type: "expense", ...dateFilter } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
          avgAmount: { $avg: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ])

    // Monthly breakdown
    const monthlyBreakdown = await Transaction.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ])

    res.json({
      success: true,
      data: {
        summary: {
          totalIncome,
          totalExpenses,
          netIncome,
          incomeCount,
          expenseCount,
          totalTransactions: incomeCount + expenseCount,
        },
        categoryBreakdown: categoryBreakdown.map((item) => ({
          category: item._id,
          amount: item.total,
          count: item.count,
          avgAmount: Math.round(item.avgAmount * 100) / 100,
          percentage: totalExpenses > 0 ? ((item.total / totalExpenses) * 100).toFixed(2) : 0,
        })),
        monthlyBreakdown,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generating summary",
      error: error.message,
    })
  }
}

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
}
