import { StaffMember } from '@/types/staff'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export class StaffService {
  static async getStaffMembers(): Promise<StaffMember[]> {
    const response = await fetch(`${API_URL}/staff`)
    if (!response.ok) {
      throw new Error('Failed to fetch staff members')
    }
    return response.json()
  }

  static async getStaffMember(id: string): Promise<StaffMember> {
    const response = await fetch(`${API_URL}/staff/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch staff member')
    }
    return response.json()
  }

  static async createStaffMember(data: Omit<StaffMember, 'id'>): Promise<StaffMember> {
    const response = await fetch(`${API_URL}/staff`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to create staff member')
    }
    return response.json()
  }

  static async updateStaffMember(id: string, data: Partial<StaffMember>): Promise<StaffMember> {
    const response = await fetch(`${API_URL}/staff/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to update staff member')
    }
    return response.json()
  }

  static async deleteStaffMember(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/staff/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete staff member')
    }
  }
} 