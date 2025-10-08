export function validateTransactionData(formData) {
  const errors = {}

  // Amount validation
  if (!formData.amount || formData.amount <= 0) {
    errors.amount = "Amount must be greater than 0"
  } else if (formData.amount > 1000000) {
    errors.amount = "Amount cannot exceed ₹10,00,000"
  }

  // Description validation
  if (!formData.description || formData.description.trim().length === 0) {
    errors.description = "Description is required"
  } else if (formData.description.length > 200) {
    errors.description = "Description cannot exceed 200 characters"
  }

  // Category validation
  if (!formData.category) {
    errors.category = "Category is required"
  }

  // Date validation
  if (!formData.date) {
    errors.date = "Date is required"
  } else {
    const selectedDate = new Date(formData.date)
    const today = new Date()
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(today.getFullYear() - 1)

    if (selectedDate > today) {
      errors.date = "Date cannot be in the future"
    } else if (selectedDate < oneYearAgo) {
      errors.date = "Date cannot be more than 1 year ago"
    }
  }

  return errors
}
