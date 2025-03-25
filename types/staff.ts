export interface StaffMember {
  id: string
  first_name: string
  last_name: string
  email: string
  role: number
  branch: number
  country: number
  is_active: boolean
  lastActive: string
  createdAt: string
  updatedAt: string
}

export type StaffRole = {
  id: string
  name: string,
  name_display: string
}
export type StaffStatus = 'active' | 'inactive'

export interface StaffFormData {
  name: string
  email: string
  role: number
  status: StaffStatus
} 