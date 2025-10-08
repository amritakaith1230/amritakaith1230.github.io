"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Dumbbell, Clock, Star, User, Bell, History } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useOrders } from "@/lib/order-context"
import PaymentModal from "@/components/payment-modal"
import NotificationsModal from "@/components/notifications-modal"
import OrderHistoryModal from "@/components/order-history-modal"
import type { PaymentDetails, PaymentResult } from "@/lib/payment"

interface Equipment {
  id: number
  name: string
  category: string
  description: string
  image: string
  available: boolean
  maxDuration: number
  difficulty: string
  price: number
}

interface Trainer {
  id: number
  name: string
  specialization: string[]
  experience: string
  rating: number
  image: string
  price: number
  availability: string[]
}

export default function FitnessPage() {
  const { user } = useAuth()
  const { orders, addOrder } = useOrders()
  const [selectedTab, setSelectedTab] = useState("equipment")
  const [selectedEquipment, setSelectedEquipment] = useState<number[]>([])
  const [selectedTrainer, setSelectedTrainer] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [duration, setDuration] = useState("60")
  const [showPayment, setShowPayment] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showOrderHistory, setShowOrderHistory] = useState(false)

  const equipment: Equipment[] = [
    {
      id: 1,
      name: "Treadmill Pro X1",
      category: "Cardio",
      description: "High-end treadmill with ocean view, perfect for morning runs",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
      available: true,
      maxDuration: 60,
      difficulty: "Beginner",
      price: 299,
    },
    {
      id: 2,
      name: "Olympic Weight Set",
      category: "Strength",
      description: "Complete Olympic weight set with professional barbells",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop",
      available: true,
      maxDuration: 90,
      difficulty: "Advanced",
      price: 499,
    },
    {
      id: 3,
      name: "Rowing Machine Elite",
      category: "Cardio",
      description: "Premium rowing machine for full-body cardio workout",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
      available: false,
      maxDuration: 45,
      difficulty: "Intermediate",
      price: 399,
    },
    {
      id: 4,
      name: "Cable Machine System",
      category: "Strength",
      description: "Multi-station cable machine for versatile strength training",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
      available: true,
      maxDuration: 75,
      difficulty: "Intermediate",
      price: 399,
    },
  ]

  const trainers: Trainer[] = [
    {
      id: 1,
      name: "Rahul Singh",
      specialization: ["Weight Training", "HIIT", "Nutrition"],
      experience: "8 years",
      rating: 4.9,
      image: "https://media.istockphoto.com/id/1146745072/photo/african-athletic-man-portrait.jpg?s=2048x2048&w=is&k=20&c=HE2xBJDEA1U2H5KetQNIZ461splsS3g2r9utT8QNVec=",
      price: 1999,
      availability: ["09:00", "11:00", "14:00", "16:00"],
    },
    {
      id: 2,
      name: "Amit Kumar",
      specialization: ["Cardio", "Endurance", "Sports Training"],
      experience: "12 years",
      rating: 4.8,
      image: "https://media.istockphoto.com/id/1490616593/photo/portrait-of-pleased-young-man.jpg?s=2048x2048&w=is&k=20&c=VT3yvytnzROO_hn373VnWQQI6HQIEc5CBf23HSQX5Io=",
      price: 2499,
      availability: ["08:00", "10:00", "15:00", "17:00"],
    },
  ]

  const timeSlots = [
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ]

  const handleBookEquipment = (equipmentId: number) => {
    if (!user) {
      alert("Please login to book equipment")
      return
    }
    setSelectedEquipment([equipmentId])
    setSelectedTab("booking")
  }

  const handleBookTrainer = (trainerId: number) => {
    if (!user) {
      alert("Please login to book trainer")
      return
    }
    setSelectedTrainer(trainerId)
    setSelectedTab("booking")
  }

  const handleBooking = () => {
    if ((!selectedEquipment.length && !selectedTrainer) || !selectedDate || !selectedTime) {
      alert("Please fill all booking details")
      return
    }
    setShowPayment(true)
  }

  const handlePaymentSuccess = (result: PaymentResult) => {
    const equipmentNames = selectedEquipment.map((id) => equipment.find((e) => e.id === id)?.name).filter(Boolean)
    const trainer = trainers.find((t) => t.id === selectedTrainer)

    addOrder({
      name: `Fitness Booking - ${equipmentNames.length > 0 ? equipmentNames.join(", ") : ""}${trainer ? ` with ${trainer.name}` : ""}`,
      type: "fitness",
      amount: calculateTotal(),
      status: "confirmed",
      details: {
        equipment: equipmentNames,
        trainer: trainer?.name,
        date: selectedDate,
        time: selectedTime,
        duration: `${duration} minutes`,
      },
      transactionId: result.transactionId,
    })

    alert(`Fitness booking confirmed! Transaction ID: ${result.transactionId}`)
    setSelectedEquipment([])
    setSelectedTrainer(null)
    setSelectedDate("")
    setSelectedTime("")
  }

  const calculateTotal = () => {
    let total = 0
    const durationHours = Number.parseInt(duration) / 60

    selectedEquipment.forEach((equipId) => {
      const equip = equipment.find((e) => e.id === equipId)
      if (equip) total += equip.price * durationHours
    })

    if (selectedTrainer) {
      const trainer = trainers.find((t) => t.id === selectedTrainer)
      if (trainer) total += trainer.price
    }

    return total
  }

  const unreadNotifications = orders.filter((order) => order.status === "pending").length

  const paymentDetails: PaymentDetails = {
    amount: calculateTotal(),
    currency: "INR",
    orderId: `FIT${Date.now()}`,
    customerInfo: {
      name: user ? `${user.firstName} ${user.lastName}` : "",
      email: user?.email || "",
      phone: user?.phoneNumber || "",
      cabinNumber: user?.cabinNumber,
    },
    items: [
      ...selectedEquipment.map((equipId) => {
        const equip = equipment.find((e) => e.id === equipId)!
        return {
          id: equip.id.toString(),
          name: `${equip.name} (${duration} min)`,
          quantity: 1,
          price: equip.price * (Number.parseInt(duration) / 60),
        }
      }),
      ...(selectedTrainer
        ? [
            {
              id: `trainer-${selectedTrainer}`,
              name: trainers.find((t) => t.id === selectedTrainer)!.name,
              quantity: 1,
              price: trainers.find((t) => t.id === selectedTrainer)!.price,
            },
          ]
        : []),
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-red-100 rounded-full">
                  <Dumbbell className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Fitness Center</h1>
                  <p className="text-sm text-gray-600">Book equipment, trainers, and fitness classes</p>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => setShowNotifications(true)} className="relative">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>

              <Button variant="outline" onClick={() => setShowOrderHistory(true)}>
                <History className="h-4 w-4 mr-2" />
                Orders ({orders.filter((o) => o.type === "fitness").length})
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="equipment">Equipment Booking</TabsTrigger>
            <TabsTrigger value="trainers">Personal Trainers</TabsTrigger>
            <TabsTrigger value="booking">Complete Booking</TabsTrigger>
          </TabsList>

          {/* Equipment Booking */}
          <TabsContent value="equipment" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Book Gym Equipment</h2>
              <p className="text-gray-600">Reserve your preferred equipment for your workout session</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipment.map((item) => (
                <Card
                  key={item.id}
                  className={`overflow-hidden transition-all duration-300 h-full flex flex-col ${
                    item.available ? "hover:shadow-xl cursor-pointer" : "opacity-60"
                  }`}
                >
                  <div className="relative">
                    <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-48 object-cover" />
                    <div className="absolute top-2 right-2">
                      <Badge className={item.available ? "bg-green-500" : "bg-red-500"}>
                        {item.available ? "Available" : "In Use"}
                      </Badge>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary">{item.category}</Badge>
                    </div>
                  </div>

                  <CardHeader className="flex-grow">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>

                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline">{item.difficulty}</Badge>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Max {item.maxDuration}min</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-600">₹{item.price}/hr</span>
                    </div>
                  </CardHeader>

                  <CardContent className="mt-auto">
                    <Button className="w-full" disabled={!item.available} onClick={() => handleBookEquipment(item.id)}>
                      {item.available ? "Book Equipment" : "Currently Unavailable"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Personal Trainers */}
          <TabsContent value="trainers" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Personal Trainers</h2>
              <p className="text-gray-600">Book a session with our certified fitness professionals</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainers.map((trainer) => (
                <Card
                  key={trainer.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col"
                >
                  <div className="relative">
                    <img
                      src={trainer.image || "/placeholder.svg"}
                      alt={trainer.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{trainer.rating}</span>
                      </div>
                    </div>
                  </div>

                  <CardHeader className="flex-grow">
                    <CardTitle className="text-xl">{trainer.name}</CardTitle>
                    <CardDescription>{trainer.experience} experience</CardDescription>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {trainer.specialization.map((spec) => (
                        <Badge key={spec} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-2xl font-bold text-green-600">₹{trainer.price}/session</span>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>1-on-1</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="mt-auto">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Available Today:</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {trainer.availability.map((time) => (
                            <Badge key={time} variant="outline" className="text-xs">
                              {time}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full" onClick={() => handleBookTrainer(trainer.id)}>
                        Book Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Complete Booking */}
          <TabsContent value="booking" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Complete Your Booking</h2>
              <p className="text-gray-600">Finalize your fitness session details</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Booking Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Session Details</CardTitle>
                  <CardDescription>Set your workout preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div>
                      <Label>Duration</Label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                      >
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">60 minutes</option>
                        <option value="90">90 minutes</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label>Available Time Slots</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleBooking}
                    disabled={(!selectedEquipment.length && !selectedTrainer) || !selectedDate || !selectedTime}
                  >
                    Confirm Booking - ₹{calculateTotal().toFixed(2)}
                  </Button>
                </CardContent>
              </Card>

              {/* Booking Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                  <CardDescription>Review your session details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedEquipment.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-2">Selected Equipment</h5>
                        {selectedEquipment.map((equipId) => {
                          const equip = equipment.find((e) => e.id === equipId)!
                          return (
                            <div key={equipId} className="flex justify-between items-center p-2 border rounded">
                              <span>{equip.name}</span>
                              <span>₹{(equip.price * (Number.parseInt(duration) / 60)).toFixed(2)}</span>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {selectedTrainer && (
                      <div>
                        <h5 className="font-medium mb-2">Personal Trainer</h5>
                        <div className="flex justify-between items-center p-2 border rounded">
                          <span>{trainers.find((t) => t.id === selectedTrainer)!.name}</span>
                          <span>₹{trainers.find((t) => t.id === selectedTrainer)!.price}</span>
                        </div>
                      </div>
                    )}

                    {selectedDate && selectedTime && (
                      <div className="border-t pt-4">
                        <h5 className="font-medium mb-2">Session Time</h5>
                        <p>
                          {selectedDate} at {selectedTime}
                        </p>
                        <p>Duration: {duration} minutes</p>
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total Amount:</span>
                        <span className="text-green-600">₹{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        paymentDetails={paymentDetails}
        onPaymentSuccess={handlePaymentSuccess}
      />
      <NotificationsModal isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      <OrderHistoryModal isOpen={showOrderHistory} onClose={() => setShowOrderHistory(false)} />
    </div>
  )
}
