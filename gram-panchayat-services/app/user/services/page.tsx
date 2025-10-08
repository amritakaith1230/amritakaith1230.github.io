"use client";

import type React from "react";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  FileText,
  Clock,
  IndianRupee,
  Search,
  User,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserServicesPage() {
  const { services, loading, searchServices } = useServices();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      await searchServices(searchTerm);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
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
    return colors[category as keyof typeof colors] || colors.other;
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      birth_certificate: "Birth Certificate",
      death_certificate: "Death Certificate",
      income_certificate: "Income Certificate",
      caste_certificate: "Caste Certificate",
      residence_certificate: "Residence Certificate",
      business_license: "Business License",
      property_tax: "Property Tax",
      water_connection: "Water Connection",
      other: "Other",
    };
    return labels[category as keyof typeof labels] || "Other";
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">
            Please login to access services
          </p>
          <Link href="/auth/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/dashboard/user">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <Building2 className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Available Services
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                {user.displayName || user.email}
              </div>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Search Services</CardTitle>
              <CardDescription>Find the service you need</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search services by name, category, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Search</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    window.location.reload();
                  }}
                >
                  Clear
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        ) : !services || services.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Services Found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? "No services match your search criteria."
                : "No services are currently available."}
            </p>
            {searchTerm && (
              <Button
                onClick={() => {
                  setSearchTerm("");
                  window.location.reload();
                }}
              >
                View All Services
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchTerm
                  ? `Search Results (${services.length})`
                  : `All Services (${services.length})`}
              </h2>
              {searchTerm && (
                <p className="text-gray-600 mt-1">
                  Showing results for "{searchTerm}"
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {service.title}
                        </CardTitle>
                        <Badge className={getCategoryColor(service.category)}>
                          {getCategoryLabel(service.category)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {service.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        Processing Time: {service.processingTime}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <IndianRupee className="h-4 w-4 mr-2" />
                        Fees: ₹{service.fees}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Required Documents:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {service.requiredDocuments
                          .slice(0, 2)
                          .map((doc, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {doc}
                            </Badge>
                          ))}
                        {service.requiredDocuments.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{service.requiredDocuments.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/user/services/${service.id}/apply`}
                        className="flex-1"
                      >
                        <Button className="w-full">
                          <FileText className="h-4 w-4 mr-2" />
                          Apply Now
                        </Button>
                      </Link>
                      <Link href={`/user/services/${service.id}`}>
                        <Button variant="outline">Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
