import { apiClient } from '@/lib/api'
import { API_CONFIG } from '@/lib/api-config'

// Debug logging utility
const logApiCall = (method: string, endpoint: string, data?: any) => {
  console.log(`🌐 API ${method}:`, `${API_CONFIG.BASE_URL}${endpoint}`)
  if (data) {
    console.log('📦 Request Data:', data)
  }
}

export interface Country {
  id: number
  name: string
  code: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateCountryDto {
  name: string
  code: string
  is_active?: boolean
}

export interface UpdateCountryDto {
  id: number
  name: string
  code: string
  is_active: boolean
}

const BASE_URL = '/api/management/countries/'

export const CountriesService = {
  getAll: async () => {
    logApiCall('GET', BASE_URL)
    const response = await apiClient.get<Country[]>(BASE_URL)
    console.log('📥 Response:', response.data)
    return response
  },

  getById: async (id: number) => {
    const url = `${BASE_URL.slice(0, -1)}/${id}/`
    logApiCall('GET', url)
    const response = await apiClient.get<Country>(url)
    console.log('📥 Response:', response.data)
    return response
  },

  create: async (data: CreateCountryDto) => {
    try {
      // Ensure data is properly formatted
      const formattedData = {
        name: String(data.name).trim(),
        code: String(data.code).trim(),
        is_active: Boolean(data.is_active ?? true)
      }
      
      logApiCall('POST', BASE_URL, formattedData)
      const response = await apiClient.post<Country>(BASE_URL, formattedData)
      
      if (response.data) {
        console.log('📥 Response:', response.data)
      }
      
      return response
    } catch (error: any) {
      console.error('❌ Create Country Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        originalError: error
      })
      throw error
    }
  },

  update: async ({ id, ...data }: UpdateCountryDto) => {
    try {
      const url = `${BASE_URL.slice(0, -1)}/${id}/`
      
      // Ensure data is properly formatted
      const formattedData = {
        name: String(data.name).trim(),
        code: String(data.code).trim(),
        is_active: Boolean(data.is_active)
      }
      
      logApiCall('PUT', url, formattedData)
      const response = await apiClient.put<Country>(url, formattedData)
      console.log('📥 Response:', response.data)
      return response
    } catch (error: any) {
      console.error('❌ Update Country Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        originalError: error
      })
      throw error
    }
  },

  delete: async (id: number) => {
    const url = `${BASE_URL.slice(0, -1)}/${id}/`
    logApiCall('DELETE', url)
    const response = await apiClient.delete<void>(url)
    console.log('📥 Response: Delete successful')
    return response
  },
} 