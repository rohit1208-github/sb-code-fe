export interface Branch {
  id: number
  name: string
  country: number
  country_name: string
  address: string
  phone: string
  email: string
  is_active: boolean
  has_online_ordering: boolean
  created_at: string
  updated_at: string
}

export interface Section {
  id: number
  section_type: string
  section_type_display: string
  display_order: number
  is_active: boolean
}

export interface Microsite {
  id: number
  name: string
  slug: string
  branches: number[]
  branches_data: Branch[]
  is_active: boolean
  has_language_switcher: boolean
  secondary_language: string | null
  sections: Section[]
  created_at: string
  updated_at: string
}

export interface CreateMicrositeDto {
  name: string
  slug: string
  branches: number[]
  is_active: boolean
  // has_language_switcher: boolean
  // secondary_language: string | null
}

export interface UpdateMicrositeDto {
  id: number
  name: string
  slug: string
  branches: number[]
  is_active: boolean
  // has_language_switcher: boolean
  // secondary_language: string | null
}


export type MicrositeResponse = Microsite[] 