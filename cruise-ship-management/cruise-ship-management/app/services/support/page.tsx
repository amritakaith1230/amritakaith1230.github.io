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
  Phone,
  MessageCircle,
  Mail,
  Clock,
  MapPin,
  AlertTriangle,
  HelpCircle,
  User,
  Shield,
  Heart,
  Headphones,
} from "lucide-react"

interface SupportService {
  id: number
  name: string
  description: string
  availability: string
  responseTime: string
  icon: any
  contact: string
  priority: "high" | "medium" | "low"
}

interface FAQ {
  id: number
  question: string
  answer: string
  category: string
}

export default function SupportPage() {
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const supportServices: SupportService[] = [
    {
      id: 1,
      name: "Emergency Services",
      description: "24/7 emergency medical and safety assistance",
      availability: "24/7",
      responseTime: "Immediate",
      icon: AlertTriangle,
      contact: "+91-1800-CRUISE-911",
      priority: "high",
    },
    {
      id: 2,
      name: "Guest Relations",
      description: "General inquiries, complaints, and assistance",
      availability: "6:00 AM - 12:00 AM",
      responseTime: "5-10 minutes",
      icon: User,
      contact: "+91-1800-CRUISE-HELP",
      priority: "medium",
    },
    {
      id: 3,
      name: "Concierge Services",
      description: "Booking assistance, recommendations, and special requests",
      availability: "8:00 AM - 10:00 PM",
      responseTime: "10-15 minutes",
      icon: Headphones,
      contact: "+91-1800-CRUISE-CONCIERGE",
      priority: "medium",
    },
    {
      id: 4,
      name: "Medical Center",
      description: "Non-emergency medical consultation and first aid",
      availability: "24/7",
      responseTime: "15-30 minutes",
      icon: Heart,
      contact: "Deck 3 - Medical Center",
      priority: "high",
    },
    {
      id: 5,
      name: "Security Services",
      description: "Safety concerns, lost items, and security assistance",
      availability: "24/7",
      responseTime: "5-10 minutes",
      icon: Shield,
      contact: "+91-1800-CRUISE-SECURITY",
      priority: "high",
    },
    {
      id: 6,
      name: "Technical Support",
      description: "WiFi, TV, cabin equipment, and technical issues",
      availability: "7:00 AM - 11:00 PM",
      responseTime: "20-30 minutes",
      icon: HelpCircle,
      contact: "+91-1800-CRUISE-TECH",
      priority: "low",
    },
  ]

  const faqs: FAQ[] = [
    {
      id: 1,
      question: "What should I do in case of a medical emergency?",
      answer:
        "Immediately call our emergency hotline or press the emergency button in your cabin. Our medical team is available 24/7 and will respond immediately.",
      category: "emergency",
    },
    {
      id: 2,
      question: "How can I connect to WiFi on the ship?",
      answer:
        "WiFi is available throughout the ship. Connect to 'CruiseShip-WiFi' network and use your cabin number and last name to log in. Premium packages are available for faster speeds.",
      category: "technical",
    },
    {
      id: 3,
      question: "What dining options are available and how do I make reservations?",
      answer:
        "We offer multiple dining venues including fine dining, casual restaurants, and 24/7 room service. Reservations can be made through our app, at guest relations, or by calling concierge.",
      category: "dining",
    },
    {
      id: 4,
      question: "Can I modify or cancel my spa/fitness bookings?",
      answer:
        "Yes, you can modify or cancel bookings up to 4 hours before your appointment time. Use our app or contact guest relations for assistance.",
      category: "bookings",
    },
    {
      id: 5,
      question: "What safety measures are in place on the ship?",
      answer:
        "We have comprehensive safety protocols including mandatory safety drills, 24/7 security, medical facilities, and trained emergency response teams.",
      category: "safety",
    },
    {
      id: 6,
      question: "How do I report a lost item?",
      answer:
        "Contact security services immediately or visit the guest relations desk. We maintain a lost and found database and will help locate your items.",
      category: "general",
    },
    {
      id: 7,
      question: "What payment methods are accepted on board?",
      answer:
        "We accept all major credit cards, debit cards, and digital payments. Your cabin key card can also be linked to your payment method for convenience.",
      category: "general",
    },
    {
      id: 8,
      question: "Are there any dress codes for restaurants?",
      answer:
        "Yes, fine dining restaurants require smart casual attire. Casual venues have relaxed dress codes. Specific requirements are mentioned when making reservations.",
      category: "dining",
    },
  ]

  const categories = [
    { id: "all", name: "All FAQs" },
    { id: "emergency", name: "Emergency" },
    { id: "technical", name: "Technical" },
    { id: "dining", name: "Dining" },
    { id: "bookings", name: "Bookings" },
    { id: "safety", name: "Safety" },
    { id: "general", name: "General" },
  ]

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-cyan-100 rounded-full">
                <Headphones className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">24/7 Support Services</h1>
                <p className="text-sm text-gray-600">Round-the-clock assistance for all your needs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="services">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">Support Services</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* Support Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Available Support Services</h2>
              <p className="text-gray-600">Get help whenever you need it with our comprehensive support services</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supportServices.map((service) => {
                const IconComponent = service.icon
                return (
                  <Card
                    key={service.id}
                    className="hover:shadow-xl transition-all duration-300 group h-full flex flex-col"
                  >
                    <CardHeader className="flex-grow">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-3 bg-cyan-100 rounded-full group-hover:bg-cyan-200 transition-colors">
                          <IconComponent className="h-6 w-6 text-cyan-600" />
                        </div>
                        <Badge className={getPriorityColor(service.priority)}>{service.priority} priority</Badge>
                      </div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>

                      <div className="space-y-2 mt-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{service.availability}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MessageCircle className="h-4 w-4" />
                          <span>Response: {service.responseTime}</span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="mt-auto">
                      <div className="space-y-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-700">Contact:</p>
                          <p className="text-sm text-gray-600">{service.contact}</p>
                        </div>
                        <Button className="w-full">
                          <Phone className="h-4 w-4 mr-2" />
                          Contact Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Emergency Contact Card */}
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Emergency Contacts</span>
                </CardTitle>
                <CardDescription className="text-red-700">
                  For immediate assistance in case of emergencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <Phone className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <p className="font-semibold">Emergency Hotline</p>
                    <p className="text-sm text-gray-600">+91-1800-CRUISE-911</p>
                  </div>
                  <div className="text-center">
                    <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <p className="font-semibold">Medical Emergency</p>
                    <p className="text-sm text-gray-600">Deck 3 - Medical Center</p>
                  </div>
                  <div className="text-center">
                    <Shield className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <p className="font-semibold">Security</p>
                    <p className="text-sm text-gray-600">+91-1800-CRUISE-SEC</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Get in Touch</h2>
              <p className="text-gray-600">Multiple ways to reach our support team</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>We'll get back to you as soon as possible</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="राहुल" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="शर्मा" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="rahul.sharma@email.com" />
                  </div>

                  <div>
                    <Label htmlFor="cabin">Cabin Number</Label>
                    <Input id="cabin" placeholder="A-101" />
                  </div>

                  <div>
                    <Label htmlFor="category">Issue Category</Label>
                    <select id="category" className="w-full p-2 border rounded-md">
                      <option>General Inquiry</option>
                      <option>Booking Issue</option>
                      <option>Technical Problem</option>
                      <option>Dining Concern</option>
                      <option>Billing Question</option>
                      <option>Complaint</option>
                      <option>Compliment</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority Level</Label>
                    <select id="priority" className="w-full p-2 border rounded-md">
                      <option>Low - General inquiry</option>
                      <option>Medium - Needs attention</option>
                      <option>High - Urgent issue</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      className="w-full p-2 border rounded-md"
                      rows={4}
                      placeholder="Please describe your issue or inquiry in detail..."
                    />
                  </div>

                  <Button size="lg" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Direct contact details for immediate assistance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-cyan-600" />
                      <div>
                        <p className="font-medium">Guest Relations</p>
                        <p className="text-sm text-gray-600">+91-1800-CRUISE-HELP</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-cyan-600" />
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-sm text-gray-600">support@cruiseshipmanager.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-cyan-600" />
                      <div>
                        <p className="font-medium">Guest Relations Desk</p>
                        <p className="text-sm text-gray-600">Deck 5, Central Atrium</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-cyan-600" />
                      <div>
                        <p className="font-medium">Operating Hours</p>
                        <p className="text-sm text-gray-600">24/7 Emergency | 6 AM - 12 AM General</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Live Chat Support</CardTitle>
                    <CardDescription>Chat with our support team in real-time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <MessageCircle className="h-16 w-16 text-cyan-600 mx-auto" />
                      <p className="text-gray-600">
                        Get instant help through our live chat feature. Available 24/7 for urgent matters.
                      </p>
                      <Button size="lg" className="w-full">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Start Live Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Frequently Asked Questions</h2>
              <p className="text-gray-600">Find quick answers to common questions</p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <HelpCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
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

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-start space-x-2">
                      <HelpCircle className="h-5 w-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                      <span>{faq.question}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    <Badge variant="secondary" className="mt-3 capitalize">
                      {faq.category}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No FAQs found matching your search criteria</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
