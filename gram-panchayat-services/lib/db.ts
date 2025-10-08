import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Service, ServiceFormData } from "@/types/service";
import type {
  Application,
  ApplicationFormData,
  StatusUpdate,
} from "@/types/application";
import { logger } from "./logger";

export class DatabaseService {
  // Services
  async createService(
    data: ServiceFormData,
    createdBy: string
  ): Promise<string> {
    try {
      console.log("📝 Creating service with data:", data);
      console.log("👤 Created by:", createdBy);

      // Validate required fields
      if (!data.title || !data.description || !data.category) {
        throw new Error("Missing required fields");
      }

      if (!data.requiredDocuments || data.requiredDocuments.length === 0) {
        throw new Error("At least one required document must be specified");
      }

      const serviceData: Omit<Service, "id"> = {
        ...data,
        isActive: true,
        createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("💾 Saving service data:", serviceData);

      const docRef = await addDoc(collection(db, "services"), {
        ...serviceData,
        createdAt: serviceData.createdAt.toISOString(),
        updatedAt: serviceData.updatedAt.toISOString(),
      });

      console.log("✅ Service created successfully with ID:", docRef.id);

      // Verify the document was created
      const verifyDoc = await getDoc(doc(db, "services", docRef.id));
      if (!verifyDoc.exists()) {
        throw new Error("Failed to verify service creation");
      }

      console.log("✅ Service creation verified:", verifyDoc.data());
      logger.logServiceAction(docRef.id, "service_created", createdBy, data);
      return docRef.id;
    } catch (error: any) {
      console.error("❌ Failed to create service:", error);
      logger.error("Failed to create service", { error: error.message, data });
      throw new Error(`Service creation failed: ${error.message}`);
    }
  }

  async updateService(
    id: string,
    data: Partial<ServiceFormData>,
    updatedBy: string
  ): Promise<void> {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, "services", id), updateData);
      logger.logServiceAction(id, "service_updated", updatedBy, data);
    } catch (error: any) {
      logger.error("Failed to update service", {
        id,
        error: error.message,
        data,
      });
      throw new Error(error.message);
    }
  }

  async deleteService(id: string, deletedBy: string): Promise<void> {
    try {
      await updateDoc(doc(db, "services", id), {
        isActive: false,
        updatedAt: new Date().toISOString(),
      });

      logger.logServiceAction(id, "service_deleted", deletedBy);
    } catch (error: any) {
      logger.error("Failed to delete service", { id, error: error.message });
      throw new Error(error.message);
    }
  }

  async getService(id: string): Promise<Service | null> {
    try {
      const docSnap = await getDoc(doc(db, "services", id));

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
        } as Service;
      }

      return null;
    } catch (error: any) {
      logger.error("Failed to get service", { id, error: error.message });
      throw new Error(error.message);
    }
  }

  async getServices(activeOnly = true): Promise<Service[]> {
    try {
      console.log("🔍 Getting services, activeOnly:", activeOnly);

      // Simplified query to avoid index requirement
      const q = query(collection(db, "services"));

      console.log("📋 Executing Firestore query...");
      const querySnapshot = await getDocs(q);
      const services: Service[] = [];

      console.log("📊 Query returned", querySnapshot.size, "documents");

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("📄 Processing document:", doc.id, data);

        try {
          const service: Service = {
            id: doc.id,
            title: data.title,
            description: data.description,
            category: data.category,
            requiredDocuments: data.requiredDocuments || [],
            processingTime: data.processingTime,
            fees: data.fees || 0,
            isActive: data.isActive !== false, // Default to true if not specified
            createdBy: data.createdBy,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
          };

          // Filter active services in code instead of query
          if (!activeOnly || service.isActive) {
            services.push(service);
            console.log("✅ Service processed:", service.title);
          }
        } catch (error) {
          console.error("❌ Error processing service document:", doc.id, error);
        }
      });

      // Sort by createdAt in code
      services.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      console.log("✅ Total services processed:", services.length);
      return services;
    } catch (error: any) {
      console.error("❌ Failed to get services:", error);
      logger.error("Failed to get services", { error: error.message });
      throw new Error(`Failed to fetch services: ${error.message}`);
    }
  }

  async searchServices(searchTerm: string): Promise<Service[]> {
    try {
      const services = await this.getServices(true);

      return services.filter(
        (service) =>
          service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          service.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error: any) {
      logger.error("Failed to search services", {
        searchTerm,
        error: error.message,
      });
      throw new Error(error.message);
    }
  }

  // Applications
  async createApplication(
    data: ApplicationFormData,
    applicantId: string,
    applicantName: string,
    applicantEmail: string
  ): Promise<string> {
    try {
      const service = await this.getService(data.serviceId);
      if (!service) {
        throw new Error("Service not found");
      }

      const applicationData: Omit<Application, "id"> = {
        serviceId: data.serviceId,
        serviceName: service.title,
        applicantId,
        applicantName,
        applicantEmail,
        status: "submitted",
        formData: data.formData,
        documents: [], // Documents will be uploaded separately
        submittedAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "applications"), {
        ...applicationData,
        submittedAt: applicationData.submittedAt.toISOString(),
        updatedAt: applicationData.updatedAt.toISOString(),
      });

      logger.logApplicationAction(
        docRef.id,
        "application_submitted",
        applicantId,
        data
      );
      return docRef.id;
    } catch (error: any) {
      logger.error("Failed to create application", {
        error: error.message,
        data,
      });
      throw new Error(error.message);
    }
  }

  async updateApplicationStatus(
    id: string,
    update: StatusUpdate,
    updatedBy: string
  ): Promise<void> {
    try {
      console.log("🔄 Updating application status:", { id, update, updatedBy });

      // First check if the application exists
      const appDoc = await getDoc(doc(db, "applications", id));
      if (!appDoc.exists()) {
        throw new Error("Application not found");
      }

      console.log("📄 Current application data:", appDoc.data());

      const updateData: any = {
        status: update.status,
        updatedAt: new Date().toISOString(),
      };

      // Only add fields if they are provided
      if (update.remarks) {
        updateData.remarks = update.remarks;
      }

      if (update.assignedTo) {
        updateData.assignedTo = update.assignedTo;
      }

      if (update.status === "completed") {
        updateData.completedAt = new Date().toISOString();
      }

      console.log("💾 Update data:", updateData);

      await updateDoc(doc(db, "applications", id), updateData);

      console.log("✅ Application status updated successfully");

      // Verify the update
      const verifyDoc = await getDoc(doc(db, "applications", id));
      if (verifyDoc.exists()) {
        console.log("✅ Update verified:", verifyDoc.data());
      }

      logger.logApplicationAction(id, "status_updated", updatedBy, update);
    } catch (error: any) {
      console.error("❌ Failed to update application status:", error);
      logger.error("Failed to update application status", {
        id,
        error: error.message,
        update,
      });
      throw new Error(`Failed to update status: ${error.message}`);
    }
  }

  async getApplication(id: string): Promise<Application | null> {
    try {
      const docSnap = await getDoc(doc(db, "applications", id));

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          submittedAt: new Date(data.submittedAt),
          updatedAt: new Date(data.updatedAt),
          completedAt: data.completedAt
            ? new Date(data.completedAt)
            : undefined,
        } as Application;
      }

      return null;
    } catch (error: any) {
      logger.error("Failed to get application", { id, error: error.message });
      throw new Error(error.message);
    }
  }

  async getUserApplications(userId: string): Promise<Application[]> {
    try {
      console.log("🔍 Getting applications for user:", userId);

      // Simplified query
      const q = query(collection(db, "applications"));
      const querySnapshot = await getDocs(q);
      const applications: Application[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.applicantId === userId) {
          applications.push({
            id: doc.id,
            ...data,
            submittedAt: new Date(data.submittedAt),
            updatedAt: new Date(data.updatedAt),
            completedAt: data.completedAt
              ? new Date(data.completedAt)
              : undefined,
          } as Application);
        }
      });

      // Sort by submittedAt
      applications.sort(
        (a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()
      );

      console.log("✅ Found", applications.length, "applications for user");
      return applications;
    } catch (error: any) {
      console.error("❌ Failed to get user applications:", error);
      logger.error("Failed to get user applications", {
        userId,
        error: error.message,
      });
      throw new Error(error.message);
    }
  }

  async getAllApplications(): Promise<Application[]> {
    try {
      console.log("🔍 Getting all applications");

      const q = query(collection(db, "applications"));
      const querySnapshot = await getDocs(q);
      const applications: Application[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        applications.push({
          id: doc.id,
          ...data,
          submittedAt: new Date(data.submittedAt),
          updatedAt: new Date(data.updatedAt),
          completedAt: data.completedAt
            ? new Date(data.completedAt)
            : undefined,
        } as Application);
      });

      // Sort by submittedAt
      applications.sort(
        (a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()
      );

      console.log("✅ Found", applications.length, "total applications");
      return applications;
    } catch (error: any) {
      console.error("❌ Failed to get all applications:", error);
      logger.error("Failed to get all applications", { error: error.message });
      throw new Error(error.message);
    }
  }

  async getApplicationsByStatus(status: string): Promise<Application[]> {
    try {
      const q = query(collection(db, "applications"));
      const querySnapshot = await getDocs(q);
      const applications: Application[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === status) {
          applications.push({
            id: doc.id,
            ...data,
            submittedAt: new Date(data.submittedAt),
            updatedAt: new Date(data.updatedAt),
            completedAt: data.completedAt
              ? new Date(data.completedAt)
              : undefined,
          } as Application);
        }
      });

      // Sort by submittedAt
      applications.sort(
        (a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()
      );

      return applications;
    } catch (error: any) {
      logger.error("Failed to get applications by status", {
        status,
        error: error.message,
      });
      throw new Error(error.message);
    }
  }
}

export const dbService = new DatabaseService();
