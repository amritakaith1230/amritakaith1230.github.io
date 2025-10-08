"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useApplications } from "@/hooks/useApplications";
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
import {
  Building2,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  LogOut,
  Settings,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { user, logout, loading } = useAuth();
  const { applications, loading: applicationsLoading } = useApplications();
  const { services, loading: servicesLoading } = useServices();
  const router = useRouter();

  useEffect(() => {
    console.log("Admin Dashboard - User:", user);
    console.log("Admin Dashboard - Loading:", loading);

    if (!loading && !user) {
      console.log("No user found, redirecting to login");
      router.replace("/auth/login");
    } else if (!loading && user && user.role !== "admin") {
      console.log("User role mismatch, redirecting to appropriate dashboard");
      const redirectPath =
        user.role === "staff" ? "/dashboard/staff" : "/dashboard/user";
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

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">
            Access denied. Admin access required.
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
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
            Manage services, applications, and system settings
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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
                <Settings className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Active Services
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {services?.filter((service) => service.isActive).length ||
                      0}
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
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications?.filter((app) =>
                      ["submitted", "under_review"].includes(app.status)
                    ).length || 0}
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
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications?.filter((app) =>
                      ["approved", "completed"].includes(app.status)
                    ).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications?.filter((app) => app.status === "rejected")
                      .length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Service Management</CardTitle>
              <CardDescription>Manage available services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin/services/create">
                <Button className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Service
                </Button>
              </Link>
              <Link href="/admin/services">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Services
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Management</CardTitle>
              <CardDescription>Review and manage applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin/applications">
                <Button className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View All Applications
                </Button>
              </Link>
              <Link href="/admin/applications?status=submitted">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Pending Reviews (
                  {applications?.filter((app) => app.status === "submitted")
                    .length || 0}
                  )
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>System statistics and health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Services</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {services?.length || 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Applications Today
                  </span>
                  <Badge className="bg-green-100 text-green-800">
                    {applications?.filter(
                      (app) =>
                        new Date(app.submittedAt).toDateString() ===
                        new Date().toDateString()
                    ).length || 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Processing Rate</span>
                  <Badge className="bg-purple-100 text-purple-800">
                    {applications && applications.length > 0
                      ? Math.round(
                          (applications.filter((app) =>
                            ["approved", "completed"].includes(app.status)
                          ).length /
                            applications.length) *
                            100
                        )
                      : 0}
                    %
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Latest application submissions</CardDescription>
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
                  {applications.slice(0, 5).map((application) => (
                    <div
                      key={application.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {application.serviceName}
                        </h4>
                        <p className="text-xs text-gray-600">
                          By {application.applicantName} •{" "}
                          {new Date(
                            application.submittedAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={`${getStatusColor(
                            application.status
                          )} text-xs`}
                        >
                          {application.status.replace("_", " ")}
                        </Badge>
                        <Link href={`/admin/applications/${application.id}`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-4">
                    <Link href="/admin/applications">
                      <Button variant="outline">View All Applications</Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Statistics</CardTitle>
              <CardDescription>Popular services and usage</CardDescription>
            </CardHeader>
            <CardContent>
              {servicesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : !services || services.length === 0 ? (
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No services found</p>
                  <Link href="/admin/services/create">
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Service
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {services.slice(0, 5).map((service) => {
                    const serviceApplications =
                      applications?.filter(
                        (app) => app.serviceId === service.id
                      ) || [];
                    return (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {service.title}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {service.category.replace("_", " ")}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            {serviceApplications.length}
                          </Badge>
                          <Link href={`/admin/services/${service.id}/edit`}>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                  <div className="text-center pt-4">
                    <Link href="/admin/services">
                      <Button variant="outline">View All Services</Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
