import { apiClient } from '@/lib/api'

export interface Country {
  id: number
  name: string
  code: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCountryDto {
  name: string
  code: string
  isActive?: boolean
}

export interface UpdateCountryDto extends Partial<CreateCountryDto> {
  id: number
}

const BASE_URL = '/countries'

export const CountriesService = {
  getAll: async () => {
    return apiClient.get<Country[]>(BASE_URL)
  },

  getById: async (id: number) => {
    return apiClient.get<Country>(`${BASE_URL}/${id}`)
  },

  create: async (data: CreateCountryDto) => {
    return apiClient.post<Country>(BASE_URL, data)
  },

  update: async ({ id, ...data }: UpdateCountryDto) => {
    return apiClient.patch<Country>(`${BASE_URL}/${id}`, data)
  },

  delete: async (id: number) => {
    return apiClient.delete<void>(`${BASE_URL}/${id}`)
  },
} 