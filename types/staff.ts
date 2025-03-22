export interface StaffMember {
  id: string
  name: string
  email: string
  role: StaffRole
  status: StaffStatus
  lastActive: string
  createdAt: string
  updatedAt: string
}

export type StaffRole = 'Admin' | 'Manager' | 'Staff'

export type StaffStatus = 'active' | 'inactive'

export interface StaffFormData {
  name: string
  email: string
  role: StaffRole
  status: StaffStatus
} 