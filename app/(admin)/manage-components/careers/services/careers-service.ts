import { CareerPosting, CareerPostingFormData, CareerPostingsResponse, CareerPostingResponse } from "../types";

// This will be replaced with your actual API base URL
const API_BASE_URL = '/api/careers';

export const CareersService = {
  getAll: async (): Promise<CareerPosting[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}`);
      const data: CareerPostingsResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching careers:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<CareerPosting> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      const data: CareerPostingResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error fetching career ${id}:`, error);
      throw error;
    }
  },

  create: async (data: CareerPostingFormData): Promise<CareerPosting> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result: CareerPostingResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating career:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<CareerPostingFormData>): Promise<CareerPosting> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result: CareerPostingResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error(`Error updating career ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Error deleting career ${id}:`, error);
      throw error;
    }
  },

  updateStatus: async (id: string, status: CareerPosting['status']): Promise<CareerPosting> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      const result: CareerPostingResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error(`Error updating career status ${id}:`, error);
      throw error;
    }
  },
}; 