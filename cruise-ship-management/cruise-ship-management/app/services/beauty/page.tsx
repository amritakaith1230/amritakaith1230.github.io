"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Scissors,
  Clock,
  Star,
  Calendar,
  Sparkles,
  Heart,
  Palette,
  Flower,
  Bell,
  History,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useOrders } from "@/lib/order-context"
import PaymentModal from "@/components/payment-modal"
import NotificationsModal from "@/components/notifications-modal"
import OrderHistoryModal from "@/components/order-history-modal"
import type { PaymentDetails, PaymentResult } from "@/lib/payment"

interface Service {
  id: number
  name: string
  category: string
  description: string
  duration: string
  price: number
  image: string
  popular?: boolean
}

interface Specialist {
  id: number
  name: string
  specialization: string[]
  experience: string
  rating: number
  image: string
  availability: string[]
}

export default function BeautyPage() {
  const { user } = useAuth()
  const { orders, addOrder } = useOrders()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [selectedSpecialist, setSelectedSpecialist] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [showPayment, setShowPayment] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showOrderHistory, setShowOrderHistory] = useState(false)

  const services: Service[] = [
    {
      id: 1,
      name: "Luxury Facial Treatment",
      category: "skincare",
      description: "Deep cleansing facial with premium products and relaxing massage",
      duration: "90 min",
      price: 2999,
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&h=200&fit=crop",
      popular: true,
    },
    {
      id: 2,
      name: "Professional Hair Cut & Style",
      category: "hair",
      description: "Expert hair cutting and styling with premium products",
      duration: "60 min",
      price: 1999,
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&h=200&fit=crop",
    },
    {
      id: 3,
      name: "Gel Manicure & Pedicure",
      category: "nails",
      description: "Long-lasting gel manicure and pedicure with nail art options",
      duration: "75 min",
      price: 1499,
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&h=200&fit=crop",
    },
    {
      id: 4,
      name: "Bridal Makeup Package",
      category: "makeup",
      description: "Complete bridal makeup with trial session and touch-ups",
      duration: "120 min",
      price: 4999,
      image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=300&h=200&fit=crop",
      popular: true,
    },
    {
      id: 5,
      name: "Hot Stone Massage",
      category: "massage",
      description: "Relaxing hot stone massage therapy for ultimate relaxation",
      duration: "90 min",
      price: 3499,
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=200&fit=crop",
    },
    {
      id: 6,
      name: "Eyebrow Threading & Tinting",
      category: "skincare",
      description: "Professional eyebrow shaping and tinting for perfect brows",
      duration: "45 min",
      price: 999,
      image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=300&h=200&fit=crop",
    },
  ]

  const specialists: Specialist[] = [
    {
      id: 1,
      name: "Priya Sharma",
      specialization: ["Hair Styling", "Hair Coloring", "Bridal Hair"],
      experience: "10 years",
      rating: 4.9,
      image: "https://media.istockphoto.com/id/1479648645/photo/close-up-portrait-of-a-beautiful-female-creative-specialist-with-curly-hair-smiling-young.jpg?s=612x612&w=0&k=20&c=cgLtVWg6kqhKcl7WRJ2SKzZnJioXo2tLYPePtPDfMAM=",
      availability: ["09:00", "11:00", "14:00", "16:00"],
    },
    {
      id: 2,
      name: "Anita Patel",
      specialization: ["Skincare", "Facials", "Anti-Aging"],
      experience: "8 years",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop",
      availability: ["10:00", "13:00", "15:00", "17:00"],
    },
    {
      id: 3,
      name: "Sunita Gupta",
      specialization: ["Makeup", "Bridal Makeup", "Special Events"],
      experience: "12 years",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=200&h=200&fit=crop",
      availability: ["08:00", "12:00", "14:00", "18:00"],
    },
  ]

  const categories = [
    { id: "all", name: "All Services", icon: Sparkles },
    { id: "hair", name: "Hair Services", icon: Scissors },
    { id: "skincare", name: "Skincare", icon: Heart },
    { id: "makeup", name: "Makeup", icon: Palette },
    { id: "nails", name: "Nail Care", icon: Flower },
    { id: "massage", name: "Massage", icon: Heart },
  ]

  const timeSlots = [
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
    "19:00",
  ]

  const filteredServices = services.filter(
    (service) => selectedCategory === "all" || service.category === selectedCategory,
  )

  const handleBookService = (serviceId: number) => {
    if (!user) {
      alert("Please login to book services")
      return
    }
    setSelectedService(serviceId)
  }

  const handleBooking = () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      alert("Please fill all booking details")
      return
    }
    setShowPayment(true)
  }

  const handlePaymentSuccess = (result: PaymentResult) => {
    const service = services.find((s) => s.id === selectedService)
    const specialist = specialists.find((s) => s.id === selectedSpecialist)

    addOrder({
      name: `${service?.name} - Beauty Appointment`,
      type: "beauty",
      amount: service?.price || 0,
      status: "confirmed",
      details: {
        service: service?.name,
        specialist: specialist?.name || "Any Available",
        date: selectedDate,
        time: selectedTime,
        duration: service?.duration,
      },
      transactionId: result.transactionId,
    })

    alert(`Beauty appointment confirmed! Transaction ID: ${result.transactionId}`)
    setSelectedService(null)
    setSelectedDate("")
    setSelectedTime("")
    setSelectedSpecialist(null)
  }

  const selectedServiceData = services.find((s) => s.id === selectedService)
  const unreadNotifications = orders.filter((order) => order.status === "pending").length

  const paymentDetails: PaymentDetails = selectedServiceData
    ? {
        amount: selectedServiceData.price,
        currency: "INR",
        orderId: `BTY${Date.now()}`,
        customerInfo: {
          name: user ? `${user.firstName} ${user.lastName}` : "",
          email: user?.email || "",
          phone: user?.phoneNumber || "",
          cabinNumber: user?.cabinNumber,
        },
        items: [
          {
            id: selectedServiceData.id.toString(),
            name: selectedServiceData.name,
            quantity: 1,
            price: selectedServiceData.price,
          },
        ],
      }
    : ({} as PaymentDetails)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
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
                <div className="p-2 bg-pink-100 rounded-full">
                  <Scissors className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Beauty Salon</h1>
                  <p className="text-sm text-gray-600">Premium beauty and wellness services</p>
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
                Orders ({orders.filter((o) => o.type === "beauty").length})
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="services">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="services">Browse Services</TabsTrigger>
            <TabsTrigger value="booking">Book Appointment</TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Our Beauty Services</h2>
              <p className="text-gray-600">Indulge in our premium beauty and wellness treatments</p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => {
                const IconComponent = category.icon
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center space-x-2"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{category.name}</span>
                  </Button>
                )
              })}
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Card
                  key={service.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full flex flex-col"
                >
                  <div className="relative">
                    <img
                      src={service.image || "/placeholder.svg"}
                      alt={service.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {service.popular && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-gradient-to-r from-pink-500 to-purple-500">
                          <Star className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardHeader className="flex-grow">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{service.duration}</span>
                      </div>
                      <span className="text-2xl font-bold text-green-600">₹{service.price}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="mt-auto">
                    <Button className="w-full" onClick={() => handleBookService(service.id)}>
                      Book This Service
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Specialists Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6">Meet Our Specialists</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specialists.map((specialist) => (
                  <Card
                    key={specialist.id}
                    className="text-center hover:shadow-lg transition-shadow h-full flex flex-col"
                  >
                    <CardHeader className="flex-grow">
                      <div className="relative mx-auto w-24 h-24 mb-4">
                        <img
                          src={specialist.image || "/placeholder.svg"}
                          alt={specialist.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                        <div className="absolute -bottom-1 -right-1">
                          <div className="flex items-center space-x-1 bg-white rounded-full px-2 py-1 shadow-md">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">{specialist.rating}</span>
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{specialist.name}</CardTitle>
                      <CardDescription>{specialist.experience} experience</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {specialist.specialization.map((spec) => (
                            <Badge key={spec} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Booking Tab */}
          <TabsContent value="booking" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Book Your Appointment</h2>
              <p className="text-gray-600">Schedule your beauty treatment with our expert specialists</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Booking Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Details</CardTitle>
                  <CardDescription>Fill in your preferences for the perfect appointment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="service">Select Service</Label>
                    <select
                      id="service"
                      className="w-full p-2 border rounded-md mt-1"
                      value={selectedService || ""}
                      onChange={(e) => setSelectedService(Number(e.target.value))}
                    >
                      <option value="">Choose a service...</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} - ₹{service.price} ({service.duration})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="specialist">Preferred Specialist</Label>
                    <select
                      id="specialist"
                      className="w-full p-2 border rounded-md mt-1"
                      value={selectedSpecialist || ""}
                      onChange={(e) => setSelectedSpecialist(Number(e.target.value))}
                    >
                      <option value="">Any available specialist</option>
                      {specialists.map((specialist) => (
                        <option key={specialist.id} value={specialist.id}>
                          {specialist.name} - {specialist.specialization.join(", ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Preferred Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div>
                      <Label>Preferred Time</Label>
                      <div className="grid grid-cols-3 gap-1 mt-1">
                        {timeSlots.slice(0, 6).map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                            className="text-xs"
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-1 mt-1">
                        {timeSlots.slice(6).map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                            className="text-xs"
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Special Requests (Optional)</Label>
                    <textarea
                      id="notes"
                      className="w-full p-2 border rounded-md mt-1"
                      rows={3}
                      placeholder="Any special requests or allergies we should know about..."
                    />
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleBooking}
                    disabled={!selectedService || !selectedDate || !selectedTime}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>

              {/* Booking Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Summary</CardTitle>
                  <CardDescription>Review your booking details</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedService ? (
                    <div className="space-y-4">
                      {(() => {
                        const service = services.find((s) => s.id === selectedService)
                        const specialist = specialists.find((s) => s.id === selectedSpecialist)

                        return service ? (
                          <>
                            <div className="flex items-center space-x-3">
                              <img
                                src={service.image || "/placeholder.svg"}
                                alt={service.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div>
                                <h4 className="font-semibold">{service.name}</h4>
                                <p className="text-sm text-gray-600">{service.duration}</p>
                                <p className="text-lg font-bold text-green-600">₹{service.price}</p>
                              </div>
                            </div>

                            {specialist && (
                              <div className="border-t pt-4">
                                <h5 className="font-medium mb-2">Your Specialist</h5>
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={specialist.image || "/placeholder.svg"}
                                    alt={specialist.name}
                                    className="w-12 h-12 object-cover rounded-full"
                                  />
                                  <div>
                                    <p className="font-medium">{specialist.name}</p>
                                    <p className="text-sm text-gray-600">{specialist.experience}</p>
                                    <div className="flex items-center space-x-1">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span className="text-sm">{specialist.rating}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {selectedDate && selectedTime && (
                              <div className="border-t pt-4">
                                <h5 className="font-medium mb-2">Appointment Time</h5>
                                <div className="flex items-center space-x-2 text-gray-600">
                                  <Calendar className="h-4 w-4" />
                                  <span>{selectedDate}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600 mt-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{selectedTime}</span>
                                </div>
                              </div>
                            )}

                            <div className="border-t pt-4">
                              <div className="flex justify-between items-center text-lg font-bold">
                                <span>Total Amount:</span>
                                <span className="text-green-600">₹{service.price}</span>
                              </div>
                            </div>
                          </>
                        ) : null
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select a service to see booking summary</p>
                    </div>
                  )}
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
