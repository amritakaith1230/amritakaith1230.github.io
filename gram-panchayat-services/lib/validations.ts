import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(["user", "staff", "admin"]).optional(),
});

export const serviceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum([
    "birth_certificate",
    "death_certificate",
    "income_certificate",
    "caste_certificate",
    "residence_certificate",
    "business_license",
    "property_tax",
    "water_connection",
    "other",
  ]),
  requiredDocuments: z
    .array(z.string())
    .min(1, "At least one document is required"),
  processingTime: z.string().min(1, "Processing time is required"),
  fees: z.number().min(0, "Fees cannot be negative"),
});

export const applicationSchema = z.object({
  serviceId: z.string().min(1, "Service ID is required"),
  formData: z.record(z.string(), z.unknown()),
  documents: z.array(z.unknown()).optional(),
});

export const statusUpdateSchema = z.object({
  status: z.enum([
    "submitted",
    "under_review",
    "approved",
    "rejected",
    "completed",
  ]),
  remarks: z.string().optional(),
  assignedTo: z.string().optional(),
});
