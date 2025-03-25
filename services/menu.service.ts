import { apiClient } from '@/lib/api'
import type { MenuItem, CreateMenuItemDto, UpdateMenuItemDto } from '@/types/api'
import { AxiosError, AxiosResponse } from 'axios'

const BASE_URL = '/api/content/menu-items/'

export const MenuService = {
  getAll: async () => {
    console.log('MenuService: Fetching all menu items')
    try {
      const response = await apiClient.get<MenuItem[]>(BASE_URL)
      console.log(`MenuService: Successfully fetched ${response.data.length} menu items`)
      return response.data
    } catch (error) {
      console.error('MenuService: Error fetching menu items:', error)
      throw error
    }
  },

  getById: async (id: number) => {
    console.log(`🔍 [MenuService] Fetching menu item by id: ${id}`)
    try {
      const response = await apiClient.get<MenuItem>(`${BASE_URL}${id}/`)
      console.log('✅ [MenuService] Successfully fetched menu item:', {
        id,
        name: response.data.name
      })
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      console.error(`❌ [MenuService] Error fetching menu item ${id}:`, {
        error: axiosError,
        status: axiosError.response?.status,
        message: axiosError.message
      })
      throw error
    }
  },

  create: async (data: CreateMenuItemDto) => {
    console.log('MenuService: Creating new menu item:', data)
    try {
      const response = await apiClient.post<MenuItem>(BASE_URL, data)
      console.log('MenuService: Successfully created menu item:', response.data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      console.error('MenuService: Error creating menu item:', {
        error: axiosError,
        status: axiosError.response?.status,
        message: axiosError.message
      })
      throw error
    }
  },

  update: async ({ id, ...data }: UpdateMenuItemDto) => {
    console.log(`MenuService: Updating menu item ${id}:`, data)
    try {
      const response = await apiClient.put<MenuItem>(`${BASE_URL}${id}/`, data)
      console.log('MenuService: Successfully updated menu item:', response.data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      console.error(`MenuService: Error updating menu item ${id}:`, {
        error: axiosError,
        status: axiosError.response?.status,
        message: axiosError.message
      })
      throw error
    }
  },

  delete: async (id: number) => {
    console.log(`MenuService: Deleting menu item ${id}`)
    try {
      const response = await apiClient.delete<void>(`${BASE_URL}${id}/`)
      console.log(`MenuService: Successfully deleted menu item ${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      console.error(`MenuService: Error deleting menu item ${id}:`, {
        error: axiosError,
        status: axiosError.response?.status,
        message: axiosError.message
      })
      throw error
    }
  },
} 