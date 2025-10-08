"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Smartphone, Building, Wallet, X, CheckCircle, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import type { PaymentDetails, PaymentResult } from "@/lib/payment"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  paymentDetails: PaymentDetails
  onPaymentSuccess: (result: PaymentResult) => void
}

export default function PaymentModal({ isOpen, onClose, paymentDetails, onPaymentSuccess }: PaymentModalProps) {
  const { user } = useAuth()
  const [selectedMethod, setSelectedMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    upiId: "",
    bankAccount: "",
    walletProvider: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Check if user is logged in when modal opens
  useEffect(() => {
    if (isOpen && !user) {
      setShowLoginPrompt(true)
    } else {
      setShowLoginPrompt(false)
    }
  }, [isOpen, user])

  const validateCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, "")
    return cleaned.length === 16 && /^\d+$/.test(cleaned)
  }

  const validateExpiryDate = (expiryDate: string) => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/
    if (!regex.test(expiryDate)) return false

    const [month, year] = expiryDate.split("/")
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1

    const expYear = Number.parseInt(year)
    const expMonth = Number.parseInt(month)

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return false
    }

    return true
  }

  const validateCVV = (cvv: string) => {
    return cvv.length === 3 && /^\d+$/.test(cvv)
  }

  const validateUPI = (upiId: string) => {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/
    return upiRegex.test(upiId)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (selectedMethod === "card") {
      if (!formData.cardholderName.trim()) {
        newErrors.cardholderName = "Cardholder name is required"
      }
      if (!validateCardNumber(formData.cardNumber)) {
        newErrors.cardNumber = "Please enter a valid 16-digit card number"
      }
      if (!validateExpiryDate(formData.expiryDate)) {
        newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)"
      }
      if (!validateCVV(formData.cvv)) {
        newErrors.cvv = "Please enter a valid 3-digit CVV"
      }
    } else if (selectedMethod === "upi") {
      if (!validateUPI(formData.upiId)) {
        newErrors.upiId = "Please enter a valid UPI ID (e.g., user@paytm)"
      }
    } else if (selectedMethod === "netbanking") {
      if (!formData.bankAccount) {
        newErrors.bankAccount = "Please select your bank"
      }
    } else if (selectedMethod === "wallet") {
      if (!formData.walletProvider) {
        newErrors.walletProvider = "Please select a wallet provider"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePayment = async () => {
    // Check if user is logged in
    if (!user) {
      setShowLoginPrompt(true)
      return
    }

    if (!validateForm()) return

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const result: PaymentResult = {
        success: true,
        transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
        paymentMethod: selectedMethod,
        amount: paymentDetails.amount,
        timestamp: new Date().toISOString(),
      }

      onPaymentSuccess(result)
    } catch (error) {
      alert("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleLoginRedirect = () => {
    onClose()
    window.location.href = "/auth/login"
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return v
  }

  if (!isOpen) return null

  // Show login prompt if user is not logged in
  if (showLoginPrompt || !user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <span>Login Required</span>
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>You need to login to complete the payment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">Please login to your account to proceed with the payment.</p>
              <div className="space-y-2">
                <Button onClick={handleLoginRedirect} className="w-full">
                  Go to Login
                </Button>
                <Button variant="outline" onClick={onClose} className="w-full">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Ensure paymentDetails and items exist
  if (!paymentDetails || !paymentDetails.items || paymentDetails.items.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span>Payment Error</span>
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>There was an issue with your order details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">Unable to process payment. Please try again.</p>
              <Button onClick={onClose} className="w-full">
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Payment</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>Complete your payment to confirm the order</CardDescription>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[70vh]">
          {/* Order Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="space-y-1 text-sm">
              {paymentDetails.items && paymentDetails.items.length > 0 ? (
                paymentDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No items found</div>
              )}
              <div className="border-t pt-2 font-semibold flex justify-between">
                <span>Total</span>
                <span>₹{paymentDetails.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          {user && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">Customer Details</h3>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Name:</strong> {user.firstName} {user.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Phone:</strong> {user.phoneNumber}
                </p>
                {user.cabinNumber && (
                  <p>
                    <strong>Cabin:</strong> {user.cabinNumber}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Payment Methods */}
          <Tabs value={selectedMethod} onValueChange={setSelectedMethod}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="card" className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Card</span>
              </TabsTrigger>
              <TabsTrigger value="upi" className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4" />
                <span className="hidden sm:inline">UPI</span>
              </TabsTrigger>
              <TabsTrigger value="netbanking" className="flex items-center space-x-2">
                <Building className="h-4 w-4" />
                <span className="hidden sm:inline">Net Banking</span>
              </TabsTrigger>
              <TabsTrigger value="wallet" className="flex items-center space-x-2">
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">Wallet</span>
              </TabsTrigger>
            </TabsList>

            {/* Card Payment */}
            <TabsContent value="card" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    placeholder="Enter cardholder name"
                    value={formData.cardholderName}
                    onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
                    className={errors.cardholderName ? "border-red-500" : ""}
                  />
                  {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>}
                </div>
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
                    maxLength={19}
                    className={errors.cardNumber ? "border-red-500" : ""}
                  />
                  {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: formatExpiryDate(e.target.value) })}
                      maxLength={5}
                      className={errors.expiryDate ? "border-red-500" : ""}
                    />
                    {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      type="password"
                      value={formData.cvv}
                      onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, "") })}
                      maxLength={3}
                      className={errors.cvv ? "border-red-500" : ""}
                    />
                    {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* UPI Payment */}
            <TabsContent value="upi" className="space-y-4">
              <div>
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  placeholder="yourname@paytm"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  className={errors.upiId ? "border-red-500" : ""}
                />
                {errors.upiId && <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                {["@paytm", "@phonepe", "@googlepay", "@amazonpay"].map((provider) => (
                  <Badge
                    key={provider}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-50"
                    onClick={() => {
                      const username = formData.upiId.split("@")[0] || "yourname"
                      setFormData({ ...formData, upiId: `${username}${provider}` })
                    }}
                  >
                    {provider}
                  </Badge>
                ))}
              </div>
            </TabsContent>

            {/* Net Banking */}
            <TabsContent value="netbanking" className="space-y-4">
              <div>
                <Label htmlFor="bankAccount">Select Your Bank</Label>
                <Select
                  value={formData.bankAccount}
                  onValueChange={(value) => setFormData({ ...formData, bankAccount: value })}
                >
                  <SelectTrigger className={errors.bankAccount ? "border-red-500" : ""}>
                    <SelectValue placeholder="Choose your bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sbi">State Bank of India</SelectItem>
                    <SelectItem value="hdfc">HDFC Bank</SelectItem>
                    <SelectItem value="icici">ICICI Bank</SelectItem>
                    <SelectItem value="axis">Axis Bank</SelectItem>
                    <SelectItem value="kotak">Kotak Mahindra Bank</SelectItem>
                    <SelectItem value="pnb">Punjab National Bank</SelectItem>
                  </SelectContent>
                </Select>
                {errors.bankAccount && <p className="text-red-500 text-sm mt-1">{errors.bankAccount}</p>}
              </div>
            </TabsContent>

            {/* Wallet Payment */}
            <TabsContent value="wallet" className="space-y-4">
              <div>
                <Label htmlFor="walletProvider">Select Wallet</Label>
                <Select
                  value={formData.walletProvider}
                  onValueChange={(value) => setFormData({ ...formData, walletProvider: value })}
                >
                  <SelectTrigger className={errors.walletProvider ? "border-red-500" : ""}>
                    <SelectValue placeholder="Choose your wallet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paytm">Paytm</SelectItem>
                    <SelectItem value="phonepe">PhonePe</SelectItem>
                    <SelectItem value="googlepay">Google Pay</SelectItem>
                    <SelectItem value="amazonpay">Amazon Pay</SelectItem>
                    <SelectItem value="mobikwik">MobiKwik</SelectItem>
                  </SelectContent>
                </Select>
                {errors.walletProvider && <p className="text-red-500 text-sm mt-1">{errors.walletProvider}</p>}
              </div>
            </TabsContent>
          </Tabs>

          {/* Payment Button */}
          <div className="mt-6 pt-4 border-t">
            <Button onClick={handlePayment} disabled={isProcessing} className="w-full" size="lg">
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing Payment...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Pay ₹{paymentDetails.amount.toFixed(2)}</span>
                </div>
              )}
            </Button>
          </div>

          {/* Security Info */}
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Secure Payment</span>
            </div>
            <p className="text-xs text-green-700 mt-1">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
