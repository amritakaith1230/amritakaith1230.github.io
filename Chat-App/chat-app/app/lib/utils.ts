import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return "Today";
  } else if (days === 1) {
    return "Yesterday";
  } else if (days < 7) {
    return `${days} days ago`;
  } else {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function sanitizeMessage(message: string): string {
  return message
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
}

export function validateUsername(username: string): {
  isValid: boolean;
  error?: string;
} {
  if (!username.trim()) {
    return { isValid: false, error: "Username is required" };
  }

  if (username.length < 2) {
    return { isValid: false, error: "Username must be at least 2 characters" };
  }

  if (username.length > 20) {
    return {
      isValid: false,
      error: "Username must be less than 20 characters",
    };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return {
      isValid: false,
      error:
        "Username can only contain letters, numbers, underscores, and hyphens",
    };
  }

  return { isValid: true };
}

export function validateRoomName(name: string): {
  isValid: boolean;
  error?: string;
} {
  if (!name.trim()) {
    return { isValid: false, error: "Room name is required" };
  }

  if (name.length < 2) {
    return { isValid: false, error: "Room name must be at least 2 characters" };
  }

  if (name.length > 50) {
    return {
      isValid: false,
      error: "Room name must be less than 50 characters",
    };
  }

  return { isValid: true };
}
