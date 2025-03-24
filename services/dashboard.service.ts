import { apiClient } from '@/lib/api'
import { API_CONFIG } from '@/lib/api-config'
import type { DashboardResponse } from '@/types/dashboard'

const BASE_URL = API_CONFIG.ENDPOINTS.DASHBOARD_STATS

export const DashboardService = {
  getStats: async () => {
    console.log('📊 [DashboardService] Starting API call to:', BASE_URL)
    try {
      const response = await apiClient.get<DashboardResponse>(BASE_URL)
      console.log('✅ [DashboardService] API call successful:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        url: response.config?.url
      })
      return response
    } catch (error) {
      console.error('❌ [DashboardService] API call failed:', {
        error,
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        url: error.config?.url
      })
      throw error
    }
  },
} 