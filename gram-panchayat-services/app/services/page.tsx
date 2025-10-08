"use client";

import type React from "react";

import { useServices } from "@/hooks/useServices";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Building2,
  FileText,
  Search,
  User,
  LogOut,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ServicesPage() {
  const { services, loading, searchServices } = useServices();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      await searchServices(searchTerm);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      birth_certificate: "bg-blue-100 text-blue-800",
      death_certificate: "bg-gray-100 text-gray-800",
      income_certificate: "bg-green-100 text-green-800",
      caste_certificate: "bg-purple-100 text-purple-800",
      residence_certificate: "bg-yellow-100 text-yellow-800",
      business_license: "bg-orange-100 text-orange-800",
      property_tax: "bg-red-100 text-red-800",
      water_connection: "bg-cyan-100 text-cyan-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Available Services
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    {user.displayName || user.email}
                  </div>
                  <Link href={`/dashboard/${user.role}`}>
                    <Button variant="outline">Dashboard</Button>
                  </Link>
                  <Button variant="outline" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="outline">Login</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button>Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Button
                type="submit"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
                size="sm"
              >
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No services found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms or check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card
                key={service.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      <Badge
                        className={`${getCategoryColor(service.category)} mt-2`}
                      >
                        {service.category.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 line-clamp-3">
                    {service.description}
                  </CardDescription>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Processing Time:</span>
                      <span className="font-medium">
                        {service.processingTime}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Fees:</span>
                      <span className="font-medium">₹{service.fees}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Required Documents:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {service.requiredDocuments
                        .slice(0, 3)
                        .map((doc, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {doc}
                          </Badge>
                        ))}
                      {service.requiredDocuments.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{service.requiredDocuments.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {user ? (
                      <Link
                        href={`/services/apply/${service.id}`}
                        className="flex-1"
                      >
                        <Button className="w-full">
                          Apply Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/auth/login" className="flex-1">
                        <Button className="w-full">
                          Login to Apply
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
