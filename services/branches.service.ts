import { apiClient } from "@/lib/api"
import { API_CONFIG } from "@/lib/api-config"
import type { Branch } from "@/types/api"

const BASE_URL = API_CONFIG.ENDPOINTS.BRANCHES

export interface CreateBranchDto {
  name: string
  country: number
  address: string
  phone: string
  email: string
  is_active: boolean
  has_online_ordering: boolean
}

export interface UpdateBranchDto extends CreateBranchDto {
  id: number
}

export const BranchesService = {
  getAll: async () => {
    console.log("Fetching all branches")
    const response = await apiClient.get<Branch[]>(BASE_URL)
    return response
  },

  create: async (data: CreateBranchDto) => {
    try {
      console.log("Creating new branch with data:", JSON.stringify(data, null, 2))
      const response = await apiClient.post<Branch>(BASE_URL, data)
      console.log("Create branch response:", response)
      return response
    } catch (error: any) {
      console.error("Create branch error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      throw error
    }
  },

  update: async ({ id, ...data }: UpdateBranchDto) => {
    console.log(`Updating branch ${id} with data:`, data)
    const url = `${BASE_URL}${id}/`
    const response = await apiClient.put<Branch>(url, data)
    return response
  },

  delete: async (id: number) => {
    console.log(`Deleting branch ${id}`)
    const url = `${BASE_URL}${id}/`
    const response = await apiClient.delete(url)
    return response
  },
}