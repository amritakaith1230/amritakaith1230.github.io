export interface Application {
  id: string;
  serviceId: string;
  serviceName: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  status: ApplicationStatus;
  formData: Record<string, any>;
  documents: ApplicationDocument[];
  remarks?: string;
  assignedTo?: string;
  submittedAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export type ApplicationStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "completed";

export interface ApplicationDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface ApplicationFormData {
  serviceId: string;
  formData: Record<string, any>;
  documents: File[];
}

export interface StatusUpdate {
  status: ApplicationStatus;
  remarks?: string;
  assignedTo?: string;
}
