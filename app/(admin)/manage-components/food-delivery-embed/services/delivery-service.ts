import { DeliveryConfig, DeliveryConfigFormData, DeliveryConfigsResponse, DeliveryConfigResponse } from '../types'

// TODO: Replace with actual API base URL
const API_BASE_URL = '/api/food-delivery'

export const DeliveryService = {
  // Get all delivery configurations
  getConfigurations: async (): Promise<DeliveryConfig[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/configurations`)
      const data: DeliveryConfigsResponse = await response.json()
      return data.data
    } catch (error) {
      console.error('Error fetching delivery configurations:', error)
      throw error
    }
  },

  // Get a single delivery configuration
  getConfiguration: async (id: string): Promise<DeliveryConfig> => {
    try {
      const response = await fetch(`${API_BASE_URL}/configurations/${id}`)
      const data: DeliveryConfigResponse = await response.json()
      return data.data
    } catch (error) {
      console.error('Error fetching delivery configuration:', error)
      throw error
    }
  },

  // Create a new delivery configuration
  createConfiguration: async (config: DeliveryConfigFormData): Promise<DeliveryConfig> => {
    try {
      const response = await fetch(`${API_BASE_URL}/configurations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })
      const data: DeliveryConfigResponse = await response.json()
      return data.data
    } catch (error) {
      console.error('Error creating delivery configuration:', error)
      throw error
    }
  },

  // Update an existing delivery configuration
  updateConfiguration: async (id: string, config: DeliveryConfigFormData): Promise<DeliveryConfig> => {
    try {
      const response = await fetch(`${API_BASE_URL}/configurations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })
      const data: DeliveryConfigResponse = await response.json()
      return data.data
    } catch (error) {
      console.error('Error updating delivery configuration:', error)
      throw error
    }
  },

  // Delete a delivery configuration
  deleteConfiguration: async (id: string): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/configurations/${id}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error('Error deleting delivery configuration:', error)
      throw error
    }
  },

  // Update configuration status
  updateStatus: async (id: string, status: 'active' | 'inactive'): Promise<DeliveryConfig> => {
    try {
      const response = await fetch(`${API_BASE_URL}/configurations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      const data: DeliveryConfigResponse = await response.json()
      return data.data
    } catch (error) {
      console.error('Error updating configuration status:', error)
      throw error
    }
  },
} 