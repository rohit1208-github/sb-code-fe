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

export interface UpdateCountryDto extends Partial<CreateCountryDto> {
  id: number
}

const BASE_URL = '/api/management/countries'

export const CountriesService = {
  getAll: async () => {
    logApiCall('GET', BASE_URL)
    const response = await apiClient.get<Country[]>(BASE_URL)
    console.log('📥 Response:', response.data)
    return response
  },

  getById: async (id: number) => {
    logApiCall('GET', `${BASE_URL}/${id}`)
    const response = await apiClient.get<Country>(`${BASE_URL}/${id}`)
    console.log('📥 Response:', response.data)
    return response
  },

  create: async (data: CreateCountryDto) => {
    logApiCall('POST', BASE_URL, data)
    const response = await apiClient.post<Country>(BASE_URL, data)
    console.log('📥 Response:', response.data)
    return response
  },

  update: async ({ id, ...data }: UpdateCountryDto) => {
    logApiCall('PATCH', `${BASE_URL}/${id}`, data)
    const response = await apiClient.patch<Country>(`${BASE_URL}/${id}`, data)
    console.log('📥 Response:', response.data)
    return response
  },

  delete: async (id: number) => {
    logApiCall('DELETE', `${BASE_URL}/${id}`)
    const response = await apiClient.delete<void>(`${BASE_URL}/${id}`)
    console.log('📥 Response: Delete successful')
    return response
  },
} 