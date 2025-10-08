"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { dbService } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ArrowLeft, Edit, Trash2, FileText } from "lucide-react";
import Link from "next/link";
import type { Service } from "@/types/service";

interface ServiceDetailPageProps {
  params: {
    id: string;
  };
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { user } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const fetchedService = await dbService.getService(params.id);
        if (!fetchedService) {
          setError("Service not found");
        } else {
          setService(fetchedService);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchService();
    }
  }, [params.id]);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Access denied. Admin access required.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Service not found"}</p>
          <Button onClick={() => router.push("/admin/services")}>
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

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

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${service.title}"?`)) {
      try {
        await dbService.deleteService(service.id, user.uid);
        router.push("/admin/services");
      } catch (error: any) {
        alert("Failed to delete service: " + error.message);
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
                onClick={() => router.push("/admin/services")}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Button>
              <Building2 className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Service Details
              </h1>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/services/${service.id}/edit`}>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Service
                </Button>
              </Link>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={getCategoryColor(service.category)}>
                    {service.category.replace("_", " ").toUpperCase()}
                  </Badge>
                  <Badge variant={service.isActive ? "default" : "secondary"}>
                    {service.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{service.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Processing Time</h3>
                <p className="text-gray-700">{service.processingTime}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Fees</h3>
                <p className="text-gray-700">₹{service.fees}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Required Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {service.requiredDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <FileText className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-gray-700">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">
                  Created At
                </h3>
                <p className="text-gray-700">
                  {service.createdAt.toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">
                  Last Updated
                </h3>
                <p className="text-gray-700">
                  {service.updatedAt.toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
