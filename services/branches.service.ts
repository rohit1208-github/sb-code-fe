import api from '@/lib/api'

export interface Branch {
  id: string
  name: string
  countryId: string
  address: string
  location: {
    lat: number
    lng: number
  }
  operatingHours: {
    day: string
    open: string
    close: string
  }[]
  contactInfo: {
    phone: string
    email: string
  }
  images: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateBranchInput {
  name: string
  countryId: string
  address: string
  location: {
    lat: number
    lng: number
  }
  operatingHours: {
    day: string
    open: string
    close: string
  }[]
  contactInfo: {
    phone: string
    email: string
  }
  images?: string[]
}

export interface UpdateBranchInput extends Partial<CreateBranchInput> {
  id: string
}

export const BranchesService = {
  async list() {
    const response = await api.get<Branch[]>('/branches')
    return response.data
  },

  async getById(id: string) {
    const response = await api.get<Branch>(`/branches/${id}`)
    return response.data
  },

  async create(data: CreateBranchInput) {
    const response = await api.post<Branch>('/branches', data)
    return response.data
  },

  async update(data: UpdateBranchInput) {
    const response = await api.patch<Branch>(`/branches/${data.id}`, data)
    return response.data
  },

  async delete(id: string) {
    await api.delete(`/branches/${id}`)
  }
} 