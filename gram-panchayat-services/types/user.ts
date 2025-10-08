export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  address?: string;
  role: "user" | "staff" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
}
