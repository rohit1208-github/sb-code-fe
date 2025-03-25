import { API_CONFIG } from '@/lib/api-config'
import { apiClient } from '@/lib/api'
import type { Microsite, MicrositeResponse, CreateMicrositeDto, UpdateMicrositeDto } from '@/types/microsites'

const BASE_URL = '/api/microsites/'

export const MicrositeService = {
  getAll: async () => {
    console.log('🔍 [MicrositeService] Fetching all microsites')
    try {
      const response = await apiClient.get<MicrositeResponse>(BASE_URL)
      console.log('✅ [MicrositeService] Successfully fetched microsites:', {
        count: response.data.length,
      })
      return response
    } catch (error) {
      console.error('❌ [MicrositeService] Error fetching microsites:', {
        error,
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
      })
      return response
    } catch (error) {
      console.error(`❌ [MicrositeService] Error fetching microsite ${id}:`, {
        error,
      })
      throw error
    }
  },

  create: async (data: CreateMicrositeDto) => {
    console.log('📝 [MicrositeService] Creating new microsite:', data)
    try {
      // Ensure branches is an array of numbers
      const formattedData = {
        ...data,
        branches: data.branches.map(id => Number(id))
      }
      
      console.log('🔄 [MicrositeService] Formatted data:', formattedData)
      const response = await apiClient.post<Microsite>(BASE_URL, formattedData)
      console.log('✅ [MicrositeService] Successfully created microsite:', {
        id: response.data.id,
        name: response.data.name,
      })
      return response
    } catch (error) {
      console.error('❌ [MicrositeService] Error creating microsite:', {
        error,
        data,
      })
      throw error
    }
  },

  update: async (id: number, data: UpdateMicrositeDto) => {
    console.log('📝 [MicrositeService] Updating microsite:', data)
    try {
      const response = await apiClient.put<Microsite>(`${BASE_URL}${id}/`, data)
      console.log('✅ [MicrositeService] Successfully updated microsite:', {
        id, 
        name: response.data.name,
      })
      return response
    } catch (error) {
      console.error('❌ [MicrositeService] Error updating microsite:', {
        error,  
        data,
      })
      throw error
    }
  },

  delete: async (id: number) => {
    console.log(`🔍 [MicrositeService] Deleting microsite by id: ${id}`)
    try {
      const response = await apiClient.delete(`${BASE_URL}${id}/`)
      console.log('✅ [MicrositeService] Successfully deleted microsite:', {
        id, 
      })
      return response
    } catch (error) {
      console.error('❌ [MicrositeService] Error deleting microsite:', {
        error,
        id,
      })
      throw error
    }
  }
} 