"use client"

// Payment processing utilities
export interface PaymentDetails {
  amount: number
  currency: string
  orderId: string
  customerInfo: {
    name: string
    email: string
    phone: string
    cabinNumber?: string
  }
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
  paymentMethod?: string
   amount?: number
    timestamp?: string
}

// Simulated payment gateway integration
export const processPayment = async (paymentDetails: PaymentDetails): Promise<PaymentResult> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Simulate payment processing
  const isSuccess = Math.random() > 0.1 // 90% success rate

  if (isSuccess) {
    return {
      success: true,
      transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
      paymentMethod: "Credit Card",
    }
  } else {
    return {
      success: false,
      error: "Payment failed. Please try again or use a different payment method.",
    }
  }
}

// UPI Payment Integration (Simulated)
export const processUPIPayment = async (paymentDetails: PaymentDetails, upiId: string): Promise<PaymentResult> => {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const isSuccess = Math.random() > 0.05 // 95% success rate for UPI

  if (isSuccess) {
    return {
      success: true,
      transactionId: `UPI${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
      paymentMethod: "UPI",
    }
  } else {
    return {
      success: false,
      error: "UPI payment failed. Please check your UPI ID and try again.",
    }
  }
}

// Razorpay Integration (Simulated)
export const initializeRazorpay = (paymentDetails: PaymentDetails) => {
  return {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_key",
    amount: paymentDetails.amount * 100, // Convert to paise
    currency: paymentDetails.currency,
    name: "CruiseShip Manager",
    description: `Payment for Order #${paymentDetails.orderId}`,
    order_id: paymentDetails.orderId,
    handler: async (response: any) => {
      // Handle successful payment
      return {
        success: true,
        transactionId: response.razorpay_payment_id,
        paymentMethod: "Razorpay",
      }
    },
    prefill: {
      name: paymentDetails.customerInfo.name,
      email: paymentDetails.customerInfo.email,
      contact: paymentDetails.customerInfo.phone,
    },
    theme: {
      color: "#3B82F6",
    },
  }
}

// Payment method validation
export const validatePaymentMethod = (method: string, details: any): boolean => {
  switch (method) {
    case "card":
      return details.cardNumber && details.expiryDate && details.cvv && details.cardholderName
    case "upi":
      return details.upiId && /^[\w.-]+@[\w.-]+$/.test(details.upiId)
    case "netbanking":
      return details.bankCode
    case "wallet":
      return details.walletProvider && details.walletId
    default:
      return false
  }
}

// Generate payment receipt
export const generateReceipt = (paymentResult: PaymentResult, paymentDetails: PaymentDetails) => {
  return {
    receiptId: `RCP${Date.now()}`,
    transactionId: paymentResult.transactionId,
    amount: paymentDetails.amount,
    currency: paymentDetails.currency,
    paymentMethod: paymentResult.paymentMethod,
    customerName: paymentDetails.customerInfo.name,
    items: paymentDetails.items,
    timestamp: new Date().toISOString(),
    status: paymentResult.success ? "Completed" : "Failed",
  }
}
