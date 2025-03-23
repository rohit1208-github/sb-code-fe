import { API_CONFIG } from '@/lib/api-config'
import { apiClient } from '@/lib/api'
import type { Microsite, MicrositeResponse } from '@/types/microsites'

const BASE_URL = '/api/microsites/'

export const MicrositeService = {
  getAll: async () => {
    console.log('🔍 [MicrositeService] Fetching all microsites')
    try {
      const response = await apiClient.get<MicrositeResponse>(BASE_URL)
      console.log('✅ [MicrositeService] Successfully fetched microsites:', {
        count: response.data.length,
        status: response.status,
      })
      return response
    } catch (error) {
      console.error('❌ [MicrositeService] Error fetching microsites:', {
        error,
        status: error.response?.status,
        message: error.message,
      })
      throw error
    }
  },

  getById: async (id: number) => {
    console.log(`🔍 [MicrositeService] Fetching microsite by id: ${id}`)
    try {
      const response = await apiClient.get<Microsite>(`${BASE_URL}${id}/`)
      console.log('✅ [MicrositeService] Successfully fetched microsite:', {
        id,
        name: response.data.name,
        status: response.status,
      })
      return response
    } catch (error) {
      console.error(`❌ [MicrositeService] Error fetching microsite ${id}:`, {
        error,
        status: error.response?.status,
        message: error.message,
      })
      throw error
    }
  },

  // Additional methods will be added later for create, update, delete
} 