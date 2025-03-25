import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard.service";
import type { DashboardResponse } from "@/types/dashboard";

export function useDashboard() {
  return useQuery<DashboardResponse>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await DashboardService.getStats();
      console.log("🎯 Dashboard API Response:", {
        status: response.status,
        data: response.data,
        statistics: response.data?.statistics,
        webTraffic: response.data?.webTraffic,
        socialMedia: response.data?.socialMedia,
        trafficByRegion: response.data?.trafficByRegion,
      });
      return response.data;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}
