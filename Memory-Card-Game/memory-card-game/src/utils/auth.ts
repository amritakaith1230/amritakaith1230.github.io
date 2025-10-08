// Simple client-side password hashing (in production, use proper server-side hashing)
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "memory-game-salt") // Add salt
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 6) {
    return { isValid: false, message: "Password must be at least 6 characters long" }
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: "Password must contain at least one lowercase letter" }
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: "Password must contain at least one uppercase letter" }
  }
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: "Password must contain at least one number" }
  }
  return { isValid: true, message: "" }
}

export const validateUsername = (username: string): { isValid: boolean; message: string } => {
  if (username.length < 3) {
    return { isValid: false, message: "Username must be at least 3 characters long" }
  }
  if (username.length > 20) {
    return { isValid: false, message: "Username must be less than 20 characters" }
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, message: "Username can only contain letters, numbers, and underscores" }
  }
  return { isValid: true, message: "" }
}
