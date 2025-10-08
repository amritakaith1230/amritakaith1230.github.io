"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useApplications } from "@/hooks/useApplications";
import { dbService } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  ArrowLeft,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import type { Service } from "@/types/service";

interface StaffServiceDetailPageProps {
  params: {
    id: string;
  };
}

export default function StaffServiceDetailPage({
  params,
}: StaffServiceDetailPageProps) {
  const { user } = useAuth();
  const { applications } = useApplications();
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

  if (!user || user.role !== "staff") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Access denied. Staff access required.</p>
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
          <Button onClick={() => router.push("/staff/services")}>
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

  // Get applications for this service
  const serviceApplications = applications.filter(
    (app) => app.serviceId === service.id
  );
  const statusCounts = {
    submitted: serviceApplications.filter((app) => app.status === "submitted")
      .length,
    under_review: serviceApplications.filter(
      (app) => app.status === "under_review"
    ).length,
    approved: serviceApplications.filter((app) => app.status === "approved")
      .length,
    rejected: serviceApplications.filter((app) => app.status === "rejected")
      .length,
    completed: serviceApplications.filter((app) => app.status === "completed")
      .length,
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
                onClick={() => router.push("/staff/services")}
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
              {serviceApplications.length > 0 && (
                <Link href={`/staff/applications?service=${service.id}`}>
                  <Button>
                    <Users className="h-4 w-4 mr-2" />
                    View Applications ({serviceApplications.length})
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Service Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">
                      {service.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-4">
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
                    <h3 className="text-lg font-semibold mb-2">
                      Processing Time
                    </h3>
                    <p className="text-gray-700">{service.processingTime}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Fees</h3>
                    <p className="text-gray-700">₹{service.fees}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Required Documents
                  </h3>
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
              </CardContent>
            </Card>
          </div>

          {/* Application Statistics */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-sm font-medium">
                        Total Applications
                      </span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      {serviceApplications.length}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="text-sm font-medium">Submitted</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {statusCounts.submitted}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
                      <span className="text-sm font-medium">Under Review</span>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">
                      {statusCounts.under_review}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm font-medium">Approved</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {statusCounts.approved}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-sm font-medium">Rejected</span>
                    </div>
                    <Badge className="bg-red-100 text-red-800">
                      {statusCounts.rejected}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">
                      {statusCounts.completed}
                    </Badge>
                  </div>
                </div>

                {serviceApplications.length > 0 && (
                  <div className="mt-6">
                    <Link href={`/staff/applications?service=${service.id}`}>
                      <Button className="w-full">
                        <Users className="h-4 w-4 mr-2" />
                        Manage Applications
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Applications */}
            {serviceApplications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {serviceApplications.slice(0, 5).map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {app.applicantName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(app.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          className={`text-xs ${
                            app.status === "submitted"
                              ? "bg-blue-100 text-blue-800"
                              : app.status === "under_review"
                              ? "bg-yellow-100 text-yellow-800"
                              : app.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : app.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {app.status.replace("_", " ")}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
