"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { dbService } from "@/lib/db";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Building2,
  FileText,
  Clock,
  IndianRupee,
  User,
  LogOut,
  ArrowLeft,
  Upload,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import type { Service } from "@/types/service";

export default function ApplyServicePage() {
  const params = useParams();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { createApplication } = useApplications();
  const { toast } = useToast();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    purpose: "",
    additionalInfo: "",
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const serviceData = await dbService.getService(params.id as string);
        if (!serviceData) {
          setError("Service not found");
        } else {
          setService(serviceData);
          // Pre-fill user data
          if (user) {
            setFormData((prev) => ({
              ...prev,
              fullName: user.displayName || "",
              email: user.email || "",
            }));
          }
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
  }, [params.id, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!service || !user) return;

    try {
      setSubmitting(true);

      // Validate required fields
      if (
        !formData.fullName ||
        !formData.email ||
        !formData.phone ||
        !formData.address
      ) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      const applicationData = {
        serviceId: service.id,
        formData: {
          ...formData,
          serviceTitle: service.title,
          serviceCategory: service.category,
          serviceFees: service.fees,
        },
        documents: [], // File upload will be implemented later
      };

      const applicationId = await createApplication(applicationData);

      toast({
        title: "Application Submitted Successfully!",
        description: `Your application ID is ${applicationId.slice(0, 8)}...`,
      });

      // Redirect to applications page
      router.push("/user/applications");
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">
            Please login to apply for services
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
                  Apply for Service
                </h1>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading application form...</p>
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
                  Apply for Service
                </h1>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
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
              <Link href={`/user/services/${service.id}`}>
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Service
                </Button>
              </Link>
              <Building2 className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Apply for Service
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
          {/* Application Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Application Form</CardTitle>
                <CardDescription>
                  Please fill in all required information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Complete Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="purpose">
                      Purpose/Reason for Application
                    </Label>
                    <Textarea
                      id="purpose"
                      value={formData.purpose}
                      onChange={(e) =>
                        handleInputChange("purpose", e.target.value)
                      }
                      rows={3}
                      placeholder="Please describe why you need this service..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="additionalInfo">
                      Additional Information
                    </Label>
                    <Textarea
                      id="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={(e) =>
                        handleInputChange("additionalInfo", e.target.value)
                      }
                      rows={3}
                      placeholder="Any additional details you'd like to provide..."
                    />
                  </div>

                  <Separator />

                  <div>
                    <Label>Document Upload</Label>
                    <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Document upload feature coming soon
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        For now, you can submit without documents and upload
                        them later
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Submit Application
                        </>
                      )}
                    </Button>
                    <Link href={`/user/services/${service.id}`}>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Service Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Processing: {service.processingTime}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <IndianRupee className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Fees: ₹{service.fees}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Required Documents:</h4>
                  <div className="space-y-1">
                    {service.requiredDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="text-xs text-gray-600 space-y-1">
                  <p>
                    • Application will be reviewed within the processing time
                  </p>
                  <p>• You will receive email updates on status changes</p>
                  <p>• Ensure all information is accurate</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
