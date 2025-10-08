"use client";

import { useState, useEffect } from "react";
import type { Service, ServiceFormData } from "@/types/service";
import { dbService } from "@/lib/db";
import { useAuth } from "./useAuth";
import { logger } from "@/lib/logger";

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchServices = async () => {
    try {
      console.log("🔄 Hook: Fetching services...");
      setLoading(true);
      setError(null);

      const fetchedServices = await dbService.getServices();
      console.log("✅ Hook: Services fetched:", fetchedServices.length);

      setServices(fetchedServices);
    } catch (error: any) {
      console.error("❌ Hook: Failed to fetch services:", error);
      setError(error.message);
      logger.error("Failed to fetch services", { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const createService = async (data: ServiceFormData) => {
    if (!user) throw new Error("User not authenticated");

    try {
      console.log("🚀 Creating service from hook:", data);
      console.log("👤 User:", user.uid, user.email);

      const serviceId = await dbService.createService(data, user.uid);
      console.log("✅ Service created with ID:", serviceId);

      // Refresh the list immediately
      console.log("🔄 Refreshing services list...");
      await fetchServices();

      return serviceId;
    } catch (error: any) {
      console.error("❌ Hook: Failed to create service:", error);
      logger.error("Failed to create service", { error: error.message, data });
      throw error;
    }
  };

  const updateService = async (id: string, data: Partial<ServiceFormData>) => {
    if (!user) throw new Error("User not authenticated");

    try {
      await dbService.updateService(id, data, user.uid);
      await fetchServices(); // Refresh the list
    } catch (error: any) {
      logger.error("Failed to update service", {
        id,
        error: error.message,
        data,
      });
      throw error;
    }
  };

  const deleteService = async (id: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      await dbService.deleteService(id, user.uid);
      await fetchServices(); // Refresh the list
    } catch (error: any) {
      logger.error("Failed to delete service", { id, error: error.message });
      throw error;
    }
  };

  const searchServices = async (searchTerm: string) => {
    try {
      setLoading(true);
      const results = await dbService.searchServices(searchTerm);
      setServices(results);
    } catch (error: any) {
      setError(error.message);
      logger.error("Failed to search services", {
        searchTerm,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    error,
    createService,
    updateService,
    deleteService,
    searchServices,
    refetch: fetchServices,
  };
}
