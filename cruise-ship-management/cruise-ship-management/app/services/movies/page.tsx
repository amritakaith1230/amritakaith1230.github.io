"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Clock, Star, MapPin, Ticket, Play, Bell, History } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useOrders } from "@/lib/order-context"
import PaymentModal from "@/components/payment-modal"
import NotificationsModal from "@/components/notifications-modal"
import OrderHistoryModal from "@/components/order-history-modal"
import type { PaymentDetails, PaymentResult } from "@/lib/payment"

interface Movie {
  id: number
  title: string
  description: string
  genre: string[]
  duration: string
  rating: number
  poster: string
  showtimes: string[]
  theater: string
  price: number
  availableSeats: number
  totalSeats: number
  category: "bollywood" | "hollywood" | "regional"
}

export default function MoviesPage() {
  const { user } = useAuth()
  const { orders, addOrder } = useOrders()
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null)
  const [selectedShowtime, setSelectedShowtime] = useState<string>("")
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showPayment, setShowPayment] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showOrderHistory, setShowOrderHistory] = useState(false)

  const movies: Movie[] = [
    {
      id: 1,
      title: "3 Idiots",
      description: "A comedy-drama about three engineering students and their journey through college and life",
      genre: ["Comedy", "Drama"],
      duration: "2h 50m",
      rating: 4.8,
      poster: "https://tse2.mm.bing.net/th?id=OIP.Qg1sasepOatXFkmCOM_7awHaFj&pid=Api&P=0&h=180",
      showtimes: ["14:00", "17:30", "20:00"],
      theater: "Theater A - IMAX",
      price: 499,
      availableSeats: 45,
      totalSeats: 120,
      category: "bollywood",
    },
    {
      id: 2,
      title: "Dangal",
      description: "The inspiring story of wrestler Mahavir Singh Phogat and his daughters",
      genre: ["Biography", "Drama", "Sport"],
      duration: "2h 41m",
      rating: 4.9,
      poster: "https://tse2.mm.bing.net/th?id=OIP.2mPlYwkFfmM2ppb_2589fQHaEK&pid=Api&P=0&h=180",
      showtimes: ["15:00", "18:00", "21:00"],
      theater: "Theater B - Premium",
      price: 399,
      availableSeats: 32,
      totalSeats: 80,
      category: "bollywood",
    },
    {
      id: 3,
      title: "Baahubali 2",
      description: "Epic historical fiction film about the battle for the throne of Mahishmati",
      genre: ["Action", "Drama", "Fantasy"],
      duration: "2h 47m",
      rating: 4.7,
      poster: "https://tse4.mm.bing.net/th?id=OIP.xBPShOFKk4_P0buIhaJBTQHaEF&pid=Api&P=0&h=180",
      showtimes: ["13:30", "16:45", "19:30"],
      theater: "Theater A - IMAX",
      price: 599,
      availableSeats: 28,
      totalSeats: 120,
      category: "bollywood",
    },
    {
      id: 4,
      title: "Queen",
      description: "A young woman's solo honeymoon trip to Europe becomes a journey of self-discovery",
      genre: ["Comedy", "Drama"],
      duration: "2h 26m",
      rating: 4.6,
      poster: "https://tse2.mm.bing.net/th?id=OIP.0KyIyukSNb_xkZgBlH6NwwHaDt&pid=Api&P=0&h=180",
      showtimes: ["19:00", "21:30"],
      theater: "Theater C - Intimate",
      price: 349,
      availableSeats: 15,
      totalSeats: 60,
      category: "bollywood",
    },
    {
      id: 5,
      title: "Zindagi Na Milegi Dobara",
      description: "Three friends on a bachelor trip discover themselves and their friendship",
      genre: ["Adventure", "Comedy", "Drama"],
      duration: "2h 35m",
      rating: 4.5,
      poster: "https://tse2.mm.bing.net/th?id=OIP.sOZfOr8qGL9uzGZEaBKAdgAAAA&pid=Api&P=0&h=180",
      showtimes: ["16:00", "19:00"],
      theater: "Theater B - Premium",
      price: 449,
      availableSeats: 25,
      totalSeats: 80,
      category: "bollywood",
    },
    {
      id: 6,
      title: "Avengers: Endgame",
      description: "The Avengers assemble once more to reverse Thanos' actions and save the universe",
      genre: ["Action", "Adventure", "Sci-Fi"],
      duration: "3h 1m",
      rating: 4.8,
      poster: "https://tse4.mm.bing.net/th?id=OIP.CIXxgBXzeAgwrhwTgQPJswHaEK&pid=Api&P=0&h=180",
      showtimes: ["14:30", "18:00", "21:30"],
      theater: "Theater A - IMAX",
      price: 699,
      availableSeats: 40,
      totalSeats: 120,
      category: "hollywood",
    },
  ]

  const categories = [
    { id: "all", name: "All Movies" },
    { id: "bollywood", name: "Bollywood" },
    { id: "hollywood", name: "Hollywood" },
    { id: "regional", name: "Regional" },
  ]

  const filteredMovies = movies.filter((movie) => selectedCategory === "all" || movie.category === selectedCategory)

  const generateSeatMap = (totalSeats: number, availableSeats: number) => {
    const rows = Math.ceil(totalSeats / 10)
    const seats = []

    for (let row = 0; row < rows; row++) {
      const rowSeats = []
      for (let seat = 0; seat < 10 && row * 10 + seat < totalSeats; seat++) {
        const seatId = `${String.fromCharCode(65 + row)}${seat + 1}`
        const isAvailable = Math.random() > 1 - availableSeats / totalSeats
        const isSelected = selectedSeats.includes(seatId)

        rowSeats.push({
          id: seatId,
          available: isAvailable,
          selected: isSelected,
        })
      }
      seats.push(rowSeats)
    }

    return seats
  }

  const toggleSeat = (seatId: string) => {
    if (!user) {
      alert("Please login to select seats")
      return
    }
    setSelectedSeats((prev) => (prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]))
  }

  const handleBooking = () => {
    if (!user) {
      alert("Please login to book tickets")
      return
    }
    if (!selectedShowtime) {
      alert("Please select a showtime")
      return
    }
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat")
      return
    }
    setShowPayment(true)
  }

  const handlePaymentSuccess = (result: PaymentResult) => {
    const movie = movies.find((m) => m.id === selectedMovie)
    if (movie) {
      addOrder({
        name: `${movie.title} - ${selectedShowtime}`,
        type: "movie",
        amount: movie.price * selectedSeats.length,
        status: "confirmed",
        details: {
          movie: movie.title,
          showtime: selectedShowtime,
          seats: selectedSeats.join(", "),
          theater: movie.theater,
        },
        transactionId: result.transactionId,
      })

      alert(`Booking confirmed! Transaction ID: ${result.transactionId}`)
      setSelectedMovie(null)
      setSelectedShowtime("")
      setSelectedSeats([])
    }
  }

  const selectedMovieData = selectedMovie ? movies.find((m) => m.id === selectedMovie) : null

  const paymentDetails: PaymentDetails = selectedMovieData
    ? {
        amount: selectedMovieData.price * selectedSeats.length,
        currency: "INR",
        orderId: `MOV${Date.now()}`,
        customerInfo: {
          name: user ? `${user.firstName} ${user.lastName}` : "",
          email: user?.email || "",
          phone: user?.phoneNumber || "",
          cabinNumber: user?.cabinNumber,
        },
        items: [
          {
            id: selectedMovieData.id.toString(),
            name: `${selectedMovieData.title} - ${selectedShowtime}`,
            quantity: selectedSeats.length,
            price: selectedMovieData.price,
          },
        ],
      }
    : ({} as PaymentDetails)

  const unreadNotifications = orders.filter((order) => order.status === "pending").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
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
                <div className="p-2 bg-purple-100 rounded-full">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Movie Theater</h1>
                  <p className="text-sm text-gray-600">Book your preferred seats for tonight's shows</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
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
                Orders
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!selectedMovie ? (
          // Movie Selection
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Now Showing</h2>
              <p className="text-gray-600">Choose from our premium movie selection</p>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMovies.map((movie) => (
                <Card
                  key={movie.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col"
                >
                  <div className="relative">
                    <img
                      src={movie.poster || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <div className="flex items-center space-x-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium text-white">{movie.rating}</span>
                      </div>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="capitalize">
                        {movie.category}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm">
                        <Play className="h-3 w-3 mr-1" />
                        Trailer
                      </Button>
                    </div>
                  </div>

                  <CardHeader className="flex-grow">
                    <CardTitle className="text-xl">{movie.title}</CardTitle>
                    <CardDescription className="text-sm">{movie.description}</CardDescription>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {movie.genre.map((g) => (
                        <Badge key={g} variant="secondary" className="text-xs">
                          {g}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mt-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{movie.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{movie.theater}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="mt-auto">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-green-600">₹{movie.price}</span>
                        <div className="text-right text-sm">
                          <p className="text-gray-600">{movie.availableSeats} seats left</p>
                          <p className="text-xs text-gray-500">of {movie.totalSeats} total</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Showtimes Today:</p>
                        <div className="flex flex-wrap gap-2">
                          {movie.showtimes.map((time) => (
                            <Badge key={time} variant="outline" className="cursor-pointer hover:bg-purple-100">
                              {time}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full" onClick={() => setSelectedMovie(movie.id)}>
                        <Ticket className="h-4 w-4 mr-2" />
                        Book Tickets
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          // Seat Selection
          <div>
            <div className="mb-6">
              <Button variant="ghost" onClick={() => setSelectedMovie(null)} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Movies
              </Button>

              {selectedMovieData && (
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedMovieData.poster || "/placeholder.svg"}
                    alt={selectedMovieData.title}
                    className="w-16 h-20 object-cover rounded"
                  />
                  <div>
                    <h2 className="text-2xl font-bold">{selectedMovieData.title}</h2>
                    <p className="text-gray-600">{selectedMovieData.theater}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{selectedMovieData.duration}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{selectedMovieData.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Tabs defaultValue="showtime" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="showtime">Select Showtime</TabsTrigger>
                <TabsTrigger value="seats">Choose Seats</TabsTrigger>
              </TabsList>

              <TabsContent value="showtime" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Showtimes</CardTitle>
                    <CardDescription>Select your preferred showtime</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedMovieData && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {selectedMovieData.showtimes.map((time) => (
                          <Card
                            key={time}
                            className={`cursor-pointer transition-all ${
                              selectedShowtime === time ? "ring-2 ring-purple-500 bg-purple-50" : "hover:shadow-md"
                            }`}
                            onClick={() => setSelectedShowtime(time)}
                          >
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-purple-600">{time}</div>
                              <div className="text-sm text-gray-600 mt-1">
                                {selectedMovieData.availableSeats} seats available
                              </div>
                              <div className="text-lg font-semibold text-green-600 mt-2">
                                ₹{selectedMovieData.price}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seats" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Select Your Seats</CardTitle>
                    <CardDescription>Showtime: {selectedShowtime || "Please select a showtime first"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedShowtime && selectedMovieData ? (
                      <div className="space-y-6">
                        {/* Screen */}
                        <div className="text-center">
                          <div className="bg-gray-800 text-white py-2 px-8 rounded-t-full mx-auto w-fit">SCREEN</div>
                        </div>

                        {/* Seat Map */}
                        <div className="space-y-2">
                          {generateSeatMap(selectedMovieData.totalSeats, selectedMovieData.availableSeats).map(
                            (row, rowIndex) => (
                              <div key={rowIndex} className="flex justify-center space-x-2">
                                <span className="w-6 text-center text-sm font-medium text-gray-500">
                                  {String.fromCharCode(65 + rowIndex)}
                                </span>
                                {row.map((seat) => (
                                  <button
                                    key={seat.id}
                                    onClick={() => seat.available && toggleSeat(seat.id)}
                                    disabled={!seat.available}
                                    className={`w-8 h-8 rounded text-xs font-medium transition-all ${
                                      seat.selected
                                        ? "bg-purple-600 text-white"
                                        : seat.available
                                          ? "bg-green-200 hover:bg-green-300 text-green-800"
                                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                  >
                                    {seat.id.slice(-1)}
                                  </button>
                                ))}
                              </div>
                            ),
                          )}
                        </div>

                        {/* Legend */}
                        <div className="flex justify-center space-x-6 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-green-200 rounded"></div>
                            <span>Available</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-purple-600 rounded"></div>
                            <span>Selected</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-gray-300 rounded"></div>
                            <span>Occupied</span>
                          </div>
                        </div>

                        {/* Booking Summary */}
                        {selectedSeats.length > 0 && (
                          <Card className="bg-purple-50 border-purple-200">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">Selected Seats: {selectedSeats.join(", ")}</p>
                                  <p className="text-sm text-gray-600">
                                    {selectedSeats.length} × ₹{selectedMovieData.price} = ₹
                                    {(selectedSeats.length * selectedMovieData.price).toFixed(2)}
                                  </p>
                                </div>
                                <Button size="lg" onClick={handleBooking}>
                                  Book Now
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Please select a showtime first to choose your seats
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
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
