"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  FileText,
  Clock,
  IndianRupee,
  User,
  LogOut,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import type { Service } from "@/types/service";

export default function UserServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const serviceData = await dbService.getService(params.id as string);
        if (!serviceData) {
          setError("Service not found");
        } else {
          setService(serviceData);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-primary mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Service Details
                </h1>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading service details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Link href="/user/services">
                  <Button variant="ghost" size="sm" className="mr-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Services
                  </Button>
                </Link>
                <Building2 className="h-8 w-8 text-primary mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Service Details
                </h1>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Service Not Found
            </h3>
            <p className="text-gray-600 mb-4">
              {error || "The requested service could not be found."}
            </p>
            <Link href="/user/services">
              <Button>Browse All Services</Button>
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
              <Link href="/user/services">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Services
                </Button>
              </Link>
              <Building2 className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Service Details
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      {service.title}
                    </CardTitle>
                    <Badge className={getCategoryColor(service.category)}>
                      {getCategoryLabel(service.category)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Required Documents
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {service.requiredDocuments.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-sm font-medium">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Processing Time
                      </h3>
                      <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <Clock className="h-5 w-5 text-blue-500 mr-3" />
                        <span className="font-medium">
                          {service.processingTime}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Service Fees
                      </h3>
                      <div className="flex items-center p-3 bg-green-50 rounded-lg">
                        <IndianRupee className="h-5 w-5 text-green-500 mr-3" />
                        <span className="font-medium">₹{service.fees}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Apply for this Service</CardTitle>
                <CardDescription>
                  Ready to submit your application?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href={`/user/services/${service.id}/apply`}>
                  <Button className="w-full" size="lg">
                    <FileText className="h-5 w-5 mr-2" />
                    Apply Now
                  </Button>
                </Link>

                <div className="text-sm text-gray-600 space-y-2">
                  <p className="font-medium">Before you apply:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Ensure you have all required documents</li>
                    <li>• Documents should be clear and readable</li>
                    <li>• Processing time may vary based on verification</li>
                    <li>• You will receive updates via email</li>
                  </ul>
                </div>

                <Separator />

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Need help?</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                  >
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
