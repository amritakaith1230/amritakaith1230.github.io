"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useServices } from "@/hooks/useServices";
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
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Settings,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminServicesPage() {
  const { user } = useAuth();
  const { services, loading, deleteService, refetch } = useServices();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Add debugging
  useEffect(() => {
    console.log("🔍 Services page loaded");
    console.log("👤 User:", user);
    console.log("📊 Services:", services);
    console.log("⏳ Loading:", loading);
  }, [user, services, loading]);

  // Add refresh button for testing
  const handleRefresh = async () => {
    console.log("🔄 Manual refresh triggered");
    await refetch();
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Access denied. Admin access required.</p>
      </div>
    );
  }

  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteService(id);
      } catch (error) {
        console.error("Failed to delete service:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard/admin")}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Building2 className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Service Management
              </h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefresh}>
                Refresh
              </Button>
              <Link href="/admin/services/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Service
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Stats */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>Total: {services.length}</span>
              <span>Active: {services.filter((s) => s.isActive).length}</span>
              <span>
                Inactive: {services.filter((s) => !s.isActive).length}
              </span>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No services found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Get started by creating your first service"}
            </p>
            <Link href="/admin/services/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Service
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getCategoryColor(service.category)}>
                          {service.category.replace("_", " ").toUpperCase()}
                        </Badge>
                        <Badge
                          variant={service.isActive ? "default" : "secondary"}
                        >
                          {service.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
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
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Documents:</span>
                      <span className="font-medium">
                        {service.requiredDocuments.length}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/services/${service.id}`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/admin/services/${service.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(service.id, service.title)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
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
