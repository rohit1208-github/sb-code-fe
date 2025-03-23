import { apiClient } from '@/lib/api'
import { API_CONFIG } from '@/lib/api-config'
import type { Branch } from '@/types/microsites'

const BASE_URL = API_CONFIG.ENDPOINTS.BRANCHES

export const BranchService = {
  getAll: async () => {
    console.log('🔍 [BranchService] Fetching all branches')
    try {
      const response = await apiClient.get<Branch[]>(BASE_URL)
      console.log('✅ [BranchService] Successfully fetched branches:', {
        count: response.data.length,
        status: response.status,
      })
      return response
    } catch (error) {
      console.error('❌ [BranchService] Error fetching branches:', {
        error,
        status: error.response?.status,
        message: error.message,
      })
      throw error
    }
  },
} 