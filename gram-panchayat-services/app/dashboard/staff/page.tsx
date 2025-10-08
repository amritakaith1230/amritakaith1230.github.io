"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useApplications } from "@/hooks/useApplications";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  LogOut,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ApplicationStatus } from "@/types/application";
import { useToast } from "@/hooks/use-toast";

export default function StaffDashboard() {
  const { user, logout, loading } = useAuth();
  const {
    applications,
    loading: applicationsLoading,
    updateApplicationStatus,
  } = useApplications();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    console.log("Staff Dashboard - User:", user);
    console.log("Staff Dashboard - Loading:", loading);

    if (!loading && !user) {
      console.log("No user found, redirecting to login");
      router.replace("/auth/login");
    } else if (!loading && user && user.role !== "staff") {
      console.log("User role mismatch, redirecting to appropriate dashboard");
      const redirectPath =
        user.role === "admin" ? "/dashboard/admin" : "/dashboard/user";
      router.replace(redirectPath);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "staff") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">
            Access denied. Staff access required.
          </p>
          <Link href="/auth/login">
            <Button>Login</Button>
          </Link>
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

  const handleStatusChange = async (
    applicationId: string,
    newStatus: ApplicationStatus
  ) => {
    try {
      console.log("🔄 Dashboard: Updating status", {
        applicationId,
        newStatus,
      });

      await updateApplicationStatus(applicationId, { status: newStatus });

      toast({
        title: "Status Updated",
        description: `Application status changed to ${newStatus.replace(
          "_",
          " "
        )}`,
      });

      console.log("✅ Dashboard: Status updated successfully");
    } catch (error: any) {
      console.error("❌ Dashboard: Failed to update status:", error);

      toast({
        title: "Update Failed",
        description:
          error.message || "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter applications that need attention
  const pendingApplications =
    applications?.filter((app) => app.status === "submitted") || [];
  const underReviewApplications =
    applications?.filter((app) => app.status === "under_review") || [];
  const todayProcessed =
    applications?.filter(
      (app) =>
        app.updatedAt &&
        new Date(app.updatedAt).toDateString() === new Date().toDateString() &&
        ["approved", "rejected", "completed"].includes(app.status)
    ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Staff Dashboard
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome, {user.displayName || user.email}!
          </h2>
          <p className="mt-2 text-gray-600">
            Manage applications and update their status
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Applications
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Pending Review
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pendingApplications.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Under Review
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {underReviewApplications.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Processed Today
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {todayProcessed.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you can perform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/staff/applications">
                <Button className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View All Applications
                </Button>
              </Link>
              <Link href="/staff/services">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Services
                </Button>
              </Link>
              <Link href="/staff/applications?status=submitted">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Pending Reviews ({pendingApplications.length})
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>Applications by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Submitted</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {applications?.filter((app) => app.status === "submitted")
                      .length || 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Under Review</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {applications?.filter(
                      (app) => app.status === "under_review"
                    ).length || 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Approved</span>
                  <Badge className="bg-green-100 text-green-800">
                    {applications?.filter((app) => app.status === "approved")
                      .length || 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Rejected</span>
                  <Badge className="bg-red-100 text-red-800">
                    {applications?.filter((app) => app.status === "rejected")
                      .length || 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Completed</span>
                  <Badge className="bg-purple-100 text-purple-800">
                    {applications?.filter((app) => app.status === "completed")
                      .length || 0}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications - Staff can update status directly */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>
              Latest application submissions requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {applicationsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : !applications || applications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No applications found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.slice(0, 10).map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {application.serviceName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        By {application.applicantName} • Submitted on{" "}
                        {new Date(application.submittedAt).toLocaleDateString()}
                      </p>
                      {application.remarks && (
                        <p className="text-sm text-gray-500 mt-1">
                          Remarks: {application.remarks}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(application.status)}>
                        <span className="capitalize">
                          {application.status.replace("_", " ")}
                        </span>
                      </Badge>

                      {/* Status Update Dropdown */}
                      <Select
                        value={application.status}
                        onValueChange={(value) =>
                          handleStatusChange(
                            application.id,
                            value as ApplicationStatus
                          )
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="under_review">
                            Under Review
                          </SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>

                      <Link href={`/staff/applications/${application.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                {applications.length > 10 && (
                  <div className="text-center pt-4">
                    <Link href="/staff/applications">
                      <Button variant="outline">View All Applications</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
