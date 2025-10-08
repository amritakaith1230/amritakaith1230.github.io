"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { useServices } from "@/hooks/useServices";
import { dbService } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { serviceSchema } from "@/lib/validations";
import { Building2, ArrowLeft, Plus, X, Save } from "lucide-react";
import type { z } from "zod";
import type { Service } from "@/types/service";

type ServiceFormData = z.infer<typeof serviceSchema>;

interface EditServicePageProps {
  params: {
    id: string;
  };
}

export default function EditServicePage({ params }: EditServicePageProps) {
  const { user } = useAuth();
  const { updateService } = useServices();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<string[]>([""]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const fetchedService = await dbService.getService(params.id);
        if (!fetchedService) {
          setError("Service not found");
        } else {
          setService(fetchedService);
          setDocuments(fetchedService.requiredDocuments);

          // Reset form with service data
          reset({
            title: fetchedService.title,
            description: fetchedService.description,
            category: fetchedService.category,
            requiredDocuments: fetchedService.requiredDocuments,
            processingTime: fetchedService.processingTime,
            fees: fetchedService.fees,
          });
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
  }, [params.id, reset]);

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

  const addDocument = () => {
    setDocuments([...documents, ""]);
  };

  const removeDocument = (index: number) => {
    const newDocs = documents.filter((_, i) => i !== index);
    setDocuments(newDocs);
    setValue(
      "requiredDocuments",
      newDocs.filter((doc) => doc.trim() !== "")
    );
  };

  const updateDocument = (index: number, value: string) => {
    const newDocs = [...documents];
    newDocs[index] = value;
    setDocuments(newDocs);
    setValue(
      "requiredDocuments",
      newDocs.filter((doc) => doc.trim() !== "")
    );
  };

  const onSubmit = async (data: ServiceFormData) => {
    try {
      console.log("📝 Form submitted with data:", data);
      setSaving(true);
      setError(null);

      const validDocuments = documents.filter((doc) => doc.trim() !== "");
      console.log("📋 Valid documents:", validDocuments);

      if (validDocuments.length === 0) {
        throw new Error("At least one required document must be specified");
      }

      const serviceData = {
        ...data,
        requiredDocuments: validDocuments,
      };

      console.log("💾 Final service data:", serviceData);

      await updateService(service.id, serviceData);
      console.log("✅ Service updated successfully");

      // Show success message
      alert("Service updated successfully!");

      // Navigate back to service detail
      router.push(`/admin/services/${service.id}`);
    } catch (error: any) {
      console.error("❌ Form submission error:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Button
              variant="ghost"
              onClick={() => router.push(`/admin/services/${service.id}`)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Building2 className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Edit Service</h1>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Edit Service Details</CardTitle>
            <CardDescription>
              Update the information below to modify the service
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Service Title</Label>
                <Input
                  id="title"
                  placeholder="Enter service title"
                  {...register("title")}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter service description"
                  rows={4}
                  {...register("description")}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  onValueChange={(value) => setValue("category", value as any)}
                  defaultValue={service.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="birth_certificate">
                      Birth Certificate
                    </SelectItem>
                    <SelectItem value="death_certificate">
                      Death Certificate
                    </SelectItem>
                    <SelectItem value="income_certificate">
                      Income Certificate
                    </SelectItem>
                    <SelectItem value="caste_certificate">
                      Caste Certificate
                    </SelectItem>
                    <SelectItem value="residence_certificate">
                      Residence Certificate
                    </SelectItem>
                    <SelectItem value="business_license">
                      Business License
                    </SelectItem>
                    <SelectItem value="property_tax">Property Tax</SelectItem>
                    <SelectItem value="water_connection">
                      Water Connection
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="processingTime">Processing Time</Label>
                  <Input
                    id="processingTime"
                    placeholder="e.g., 7-10 working days"
                    {...register("processingTime")}
                    className={errors.processingTime ? "border-red-500" : ""}
                  />
                  {errors.processingTime && (
                    <p className="text-sm text-red-500">
                      {errors.processingTime.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fees">Fees (₹)</Label>
                  <Input
                    id="fees"
                    type="number"
                    min="0"
                    placeholder="0"
                    {...register("fees", { valueAsNumber: true })}
                    className={errors.fees ? "border-red-500" : ""}
                  />
                  {errors.fees && (
                    <p className="text-sm text-red-500">
                      {errors.fees.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Required Documents</Label>
                <div className="space-y-2">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Enter document name"
                        value={doc}
                        onChange={(e) => updateDocument(index, e.target.value)}
                      />
                      {documents.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeDocument(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addDocument}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Document
                  </Button>
                </div>
                {errors.requiredDocuments && (
                  <p className="text-sm text-red-500">
                    {errors.requiredDocuments.message}
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={saving} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/admin/services/${service.id}`)}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
