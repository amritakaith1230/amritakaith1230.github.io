"use client";

import { useState, useEffect } from "react";
import type {
  Application,
  ApplicationFormData,
  StatusUpdate,
} from "@/types/application";
import { dbService } from "@/lib/db";
import { useAuth } from "./useAuth";
import { logger } from "@/lib/logger";

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchApplications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      let fetchedApplications: Application[];

      if (user.role === "user") {
        fetchedApplications = await dbService.getUserApplications(user.uid);
      } else {
        fetchedApplications = await dbService.getAllApplications();
      }

      setApplications(fetchedApplications);
    } catch (error: any) {
      setError(error.message);
      logger.error("Failed to fetch applications", { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const createApplication = async (data: ApplicationFormData) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const applicationId = await dbService.createApplication(
        data,
        user.uid,
        user.displayName || user.email,
        user.email
      );
      await fetchApplications(); // Refresh the list
      return applicationId;
    } catch (error: any) {
      logger.error("Failed to create application", {
        error: error.message,
        data,
      });
      throw error;
    }
  };

  const updateApplicationStatus = async (id: string, update: StatusUpdate) => {
    if (!user) throw new Error("User not authenticated");

    try {
      console.log("🔄 Hook: Updating application status", {
        id,
        update,
        userId: user.uid,
      });

      await dbService.updateApplicationStatus(id, update, user.uid);

      console.log("✅ Hook: Status updated successfully");

      // Update local state immediately for better UX
      setApplications((prevApps) =>
        prevApps.map((app) =>
          app.id === id
            ? {
                ...app,
                status: update.status,
                remarks: update.remarks || app.remarks,
                assignedTo: update.assignedTo || app.assignedTo,
                updatedAt: new Date(),
                ...(update.status === "completed" && {
                  completedAt: new Date(),
                }),
              }
            : app
        )
      );

      // Also refresh from database to ensure consistency
      await fetchApplications();
    } catch (error: any) {
      console.error("❌ Hook: Failed to update application status:", error);
      logger.error("Failed to update application status", {
        id,
        error: error.message,
        update,
      });
      throw new Error(`Failed to update status: ${error.message}`);
    }
  };

  const getApplicationsByStatus = async (status: string) => {
    try {
      setLoading(true);
      const results = await dbService.getApplicationsByStatus(status);
      setApplications(results);
    } catch (error: any) {
      setError(error.message);
      logger.error("Failed to get applications by status", {
        status,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  return {
    applications,
    loading,
    error,
    createApplication,
    updateApplicationStatus,
    getApplicationsByStatus,
    refetch: fetchApplications,
  };
}
