const { body } = require("express-validator")

const validateTransaction = [
  body("type").isIn(["income", "expense"]).withMessage("Type must be either income or expense"),

  body("amount").isFloat({ min: 0.01 }).withMessage("Amount must be a positive number greater than 0"),

  body("description")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Description is required and must be less than 200 characters"),

  body("category").trim().isLength({ min: 1 }).withMessage("Category is required"),

  body("date").optional().isISO8601().withMessage("Date must be in valid ISO format"),
]

module.exports = {
  validateTransaction,
}
