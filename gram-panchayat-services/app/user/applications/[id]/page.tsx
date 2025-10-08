"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { dbService } from "@/lib/db";
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
import {
  Building2,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import type { Application } from "@/types/application";
import { Label } from "@/components/ui/label";

export default function UserApplicationDetailPage() {
  const params = useParams();
  const { user, logout } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const applicationData = await dbService.getApplication(
          params.id as string
        );
        if (!applicationData) {
          setError("Application not found");
        } else if (applicationData.applicantId !== user?.uid) {
          setError("Access denied");
        } else {
          setApplication(applicationData);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id && user) {
      fetchApplication();
    }
  }, [params.id, user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <Clock className="h-4 w-4" />;
      case "under_review":
        return <AlertCircle className="h-4 w-4" />;
      case "approved":
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">
            Please login to access your applications
          </p>
          <Link href="/auth/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-primary mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Application Details
                </h1>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading application details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Link href="/user/applications">
                  <Button variant="ghost" size="sm" className="mr-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Applications
                  </Button>
                </Link>
                <Building2 className="h-8 w-8 text-primary mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Application Details
                </h1>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Application Not Found
            </h3>
            <p className="text-gray-600 mb-4">
              {error || "The requested application could not be found."}
            </p>
            <Link href="/user/applications">
              <Button>View All Applications</Button>
            </Link>
          </div>
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
              <Link href="/user/applications">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Applications
                </Button>
              </Link>
              <Building2 className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Application Details
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Application Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {application.serviceName}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Application ID: {application.id}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(application.status)}>
                  {getStatusIcon(application.status)}
                  <span className="ml-2 capitalize">
                    {application.status.replace("_", " ")}
                  </span>
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Application Submitted</p>
                    <p className="text-sm text-gray-600">
                      {new Date(application.submittedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {application.status !== "submitted" && (
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full">
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">Under Review</p>
                      <p className="text-sm text-gray-600">
                        {new Date(application.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {["approved", "rejected", "completed"].includes(
                  application.status
                ) && (
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        application.status === "rejected"
                          ? "bg-red-100"
                          : "bg-green-100"
                      }`}
                    >
                      {application.status === "rejected" ? (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="font-medium capitalize">
                        {application.status.replace("_", " ")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(application.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Application Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Full Name
                  </Label>
                  <p className="font-medium">
                    {application.formData.fullName || application.applicantName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Email
                  </Label>
                  <p className="font-medium">
                    {application.formData.email || application.applicantEmail}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Phone
                  </Label>
                  <p className="font-medium">
                    {application.formData.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Address
                  </Label>
                  <p className="font-medium">
                    {application.formData.address || "Not provided"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Service
                  </Label>
                  <p className="font-medium">{application.serviceName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Category
                  </Label>
                  <p className="font-medium capitalize">
                    {application.formData.serviceCategory?.replace("_", " ") ||
                      "Not specified"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Fees
                  </Label>
                  <p className="font-medium">
                    ₹{application.formData.serviceFees || 0}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Assigned To
                  </Label>
                  <p className="font-medium">
                    {application.assignedTo || "Not assigned"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          {(application.formData.purpose ||
            application.formData.additionalInfo) && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {application.formData.purpose && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Purpose
                    </Label>
                    <p className="mt-1">{application.formData.purpose}</p>
                  </div>
                )}
                {application.formData.additionalInfo && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Additional Details
                    </Label>
                    <p className="mt-1">
                      {application.formData.additionalInfo}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Remarks */}
          {application.remarks && (
            <Card>
              <CardHeader>
                <CardTitle>Official Remarks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p>{application.remarks}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {application.documents && application.documents.length > 0 ? (
                <div className="space-y-2">
                  {application.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-gray-600">
                            Uploaded on{" "}
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No documents uploaded</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
