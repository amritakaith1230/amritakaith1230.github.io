import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import type {
  User,
  LoginCredentials,
  RegisterData,
  UserRole,
} from "@/types/auth";
import { logger } from "./logger";

export class AuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      logger.logAuthAction("login_attempt", undefined, {
        email: credentials.email,
      });
      console.log("🔐 Starting login process for:", credentials.email);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      console.log(
        "✅ Firebase authentication successful for:",
        credentials.email
      );

      if (!userCredential.user) {
        throw new Error("Login failed - no user returned from Firebase");
      }

      console.log(
        "🔍 Looking for user profile in Firestore for UID:",
        userCredential.user.uid
      );

      // Try to get user profile from Firestore
      let user = await this.getUserProfile(userCredential.user.uid);

      // If user profile doesn't exist in Firestore, create it from Firebase Auth data
      if (!user) {
        console.log(
          "⚠️ User profile not found in Firestore, creating from Firebase Auth data"
        );

        const newUserData: User = {
          uid: userCredential.user.uid,
          email: userCredential.user.email || credentials.email,
          displayName:
            userCredential.user.displayName || credentials.email.split("@")[0],
          role: "user", // Default role
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Create user profile in Firestore
        await this.createUserProfile(newUserData);
        user = newUserData;
        console.log("✅ Created user profile in Firestore:", user);
      }

      console.log(
        "✅ Login successful for user:",
        user.email,
        "Role:",
        user.role
      );
      logger.logAuthAction("login_success", user.uid, {
        email: credentials.email,
      });
      return user;
    } catch (error: any) {
      console.error("❌ Login error:", error);
      logger.logAuthAction("login_failed", undefined, {
        email: credentials.email,
        error: error.message,
      });

      // Provide user-friendly error messages
      if (error.code === "auth/user-not-found") {
        throw new Error("No account found with this email address");
      } else if (error.code === "auth/wrong-password") {
        throw new Error("Incorrect password");
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Invalid email address");
      } else if (error.code === "auth/too-many-requests") {
        throw new Error("Too many failed attempts. Please try again later");
      } else if (error.code === "auth/invalid-credential") {
        throw new Error("Invalid email or password");
      }

      throw new Error(error.message || "Login failed");
    }
  }

  async register(
    data: RegisterData
  ): Promise<{ success: boolean; message: string }> {
    try {
      logger.logAuthAction("register_attempt", undefined, {
        email: data.email,
      });
      console.log("📝 Starting registration process for:", data.email);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log(
        "✅ Firebase user created successfully:",
        userCredential.user.uid
      );

      if (!userCredential.user) {
        throw new Error("Registration failed - no user created");
      }

      const userData: User = {
        uid: userCredential.user.uid,
        email: data.email,
        displayName: data.displayName,
        role: data.role || "user",
        phoneNumber: data.phoneNumber,
        address: data.address,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("💾 Saving user profile to Firestore:", userData);

      // Create user profile in Firestore
      await this.createUserProfile(userData);
      console.log("✅ User profile saved successfully to Firestore");

      // Sign out the user after registration so they need to login manually
      await signOut(auth);
      console.log("🚪 User signed out after registration");

      logger.logAuthAction("register_success", userData.uid, {
        email: data.email,
      });

      return {
        success: true,
        message:
          "Account created successfully! Please login with your credentials.",
      };
    } catch (error: any) {
      console.error("❌ Registration error:", error);
      logger.logAuthAction("register_failed", undefined, {
        email: data.email,
        error: error.message,
      });

      // Provide user-friendly error messages
      if (error.code === "auth/email-already-in-use") {
        throw new Error("An account with this email already exists");
      } else if (error.code === "auth/weak-password") {
        throw new Error(
          "Password is too weak. Please choose a stronger password"
        );
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Invalid email address");
      }

      throw new Error(error.message || "Registration failed");
    }
  }

  async createUserProfile(userData: User): Promise<void> {
    try {
      const userDocData = {
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role,
        phoneNumber: userData.phoneNumber || null,
        address: userData.address || null,
        createdAt: userData.createdAt.toISOString(),
        updatedAt: userData.updatedAt.toISOString(),
      };

      console.log("💾 Creating user document in Firestore:", userDocData);

      await setDoc(doc(db, "users", userData.uid), userDocData);
      console.log("✅ User document created successfully");

      // Verify the document was created
      const verifyDoc = await getDoc(doc(db, "users", userData.uid));
      if (!verifyDoc.exists()) {
        throw new Error("Failed to verify user profile creation");
      }
      console.log("✅ User profile creation verified");
    } catch (error: any) {
      console.error("❌ Failed to create user profile:", error);
      throw new Error(`Failed to create user profile: ${error.message}`);
    }
  }

  async logout(): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      await signOut(auth);
      logger.logAuthAction("logout_success", currentUser?.uid);
      console.log("✅ Logout successful");
    } catch (error: any) {
      console.error("❌ Logout error:", error);
      logger.logAuthAction("logout_failed", undefined, {
        error: error.message,
      });
      throw new Error(error.message || "Logout failed");
    }
  }

  async getUserProfile(uid: string): Promise<User | null> {
    try {
      console.log("🔍 Getting user profile for UID:", uid);
      const userDoc = await getDoc(doc(db, "users", uid));

      if (!userDoc.exists()) {
        console.log("⚠️ User profile not found in Firestore for UID:", uid);
        return null;
      }

      const userData = userDoc.data();
      console.log("✅ User profile found:", userData);

      const user: User = {
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
        createdAt: new Date(userData.createdAt),
        updatedAt: new Date(userData.updatedAt),
      };

      return user;
    } catch (error: any) {
      console.error("❌ Failed to get user profile:", error);
      logger.error("Failed to get user profile", { uid, error: error.message });
      return null;
    }
  }

  async updateUserProfile(uid: string, updates: Partial<User>): Promise<void> {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, "users", uid), updateData);
      logger.logUserAction(uid, "profile_updated", updates);
      console.log("✅ User profile updated successfully");
    } catch (error: any) {
      console.error("❌ Failed to update user profile:", error);
      logger.error("Failed to update user profile", {
        uid,
        error: error.message,
      });
      throw new Error(error.message);
    }
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        console.log(
          "🔄 Auth state changed:",
          firebaseUser ? `User: ${firebaseUser.email}` : "No user"
        );

        if (firebaseUser) {
          try {
            const user = await this.getUserProfile(firebaseUser.uid);
            callback(user);
          } catch (error) {
            console.error(
              "❌ Failed to get user profile on auth state change:",
              error
            );
            logger.error("Failed to get user profile on auth state change", {
              uid: firebaseUser.uid,
              error,
            });
            callback(null);
          }
        } else {
          callback(null);
        }
      }
    );
  }

  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  async checkUserRole(
    uid: string,
    requiredRoles: UserRole[]
  ): Promise<boolean> {
    try {
      const user = await this.getUserProfile(uid);
      return user ? requiredRoles.includes(user.role) : false;
    } catch (error) {
      logger.error("Failed to check user role", { uid, requiredRoles, error });
      return false;
    }
  }
}

export const authService = new AuthService();
