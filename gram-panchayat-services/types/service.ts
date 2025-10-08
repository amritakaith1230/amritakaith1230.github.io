export interface Service {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  requiredDocuments: string[];
  processingTime: string;
  fees: number;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ServiceCategory =
  | "birth_certificate"
  | "death_certificate"
  | "income_certificate"
  | "caste_certificate"
  | "residence_certificate"
  | "business_license"
  | "property_tax"
  | "water_connection"
  | "other";

export interface ServiceFormData {
  title: string;
  description: string;
  category: ServiceCategory;
  requiredDocuments: string[];
  processingTime: string;
  fees: number;
}
