export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  phoneNumber?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = "user" | "staff" | "admin";

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  phoneNumber?: string;
  address?: string;
  role?: UserRole;
}
