"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { dbService } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  ArrowLeft,
  FileText,
  User,
  Mail,
  Calendar,
  Save,
} from "lucide-react";
import type { Application, ApplicationStatus } from "@/types/application";

interface ApplicationDetailPageProps {
  params: {
    id: string;
  };
}

export default function StaffApplicationDetailPage({
  params,
}: ApplicationDetailPageProps) {
  const { user } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ApplicationStatus>("submitted");
  const [remarks, setRemarks] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const fetchedApplication = await dbService.getApplication(params.id);
        if (!fetchedApplication) {
          setError("Application not found");
        } else {
          setApplication(fetchedApplication);
          setStatus(fetchedApplication.status);
          setRemarks(fetchedApplication.remarks || "");
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchApplication();
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
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {error || "Application not found"}
          </p>
          <Button onClick={() => router.push("/staff/applications")}>
            Back to Applications
          </Button>
        </div>
      </div>
    );
  }

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

  const handleUpdateStatus = async () => {
    try {
      setUpdating(true);
      await dbService.updateApplicationStatus(
        application.id,
        {
          status,
          remarks: remarks.trim() || undefined,
          assignedTo: user.uid,
        },
        user.uid
      );

      // Update local state
      setApplication({
        ...application,
        status,
        remarks: remarks.trim() || undefined,
        updatedAt: new Date(),
      });

      alert("Application status updated successfully!");
    } catch (error: any) {
      alert("Failed to update status: " + error.message);
    } finally {
      setUpdating(false);
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
                onClick={() => router.push("/staff/applications")}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Applications
              </Button>
              <Building2 className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Application Details
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Application Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">
                      {application.serviceName}
                    </CardTitle>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <FileText className="h-12 w-12 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Applicant
                      </p>
                      <p className="text-gray-900">
                        {application.applicantName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">
                        {application.applicantEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Submitted
                      </p>
                      <p className="text-gray-900">
                        {new Date(application.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Last Updated
                      </p>
                      <p className="text-gray-900">
                        {new Date(application.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Data */}
                {application.formData &&
                  Object.keys(application.formData).length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Application Data
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                          {JSON.stringify(application.formData, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                {/* Documents */}
                {application.documents && application.documents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Documents</h3>
                    <div className="space-y-2">
                      {application.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <FileText className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-700">{doc.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Status Update Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Update Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={status}
                    onValueChange={(value) =>
                      setStatus(value as ApplicationStatus)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks (Optional)</Label>
                  <Textarea
                    id="remarks"
                    placeholder="Add remarks or notes..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handleUpdateStatus}
                  disabled={updating}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updating ? "Updating..." : "Update Status"}
                </Button>

                {application.remarks && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Previous Remarks:
                    </p>
                    <p className="text-sm text-gray-600">
                      {application.remarks}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
