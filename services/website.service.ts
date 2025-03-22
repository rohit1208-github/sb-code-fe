import { Template, Microsite } from '@/types/website'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export class WebsiteService {
  // Template Management
  static async getTemplates(): Promise<Template[]> {
    const response = await fetch(`${API_URL}/templates`)
    if (!response.ok) {
      throw new Error('Failed to fetch templates')
    }
    return response.json()
  }

  static async getTemplate(id: string): Promise<Template> {
    const response = await fetch(`${API_URL}/templates/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch template')
    }
    return response.json()
  }

  static async createTemplate(data: Omit<Template, 'id'>): Promise<Template> {
    const response = await fetch(`${API_URL}/templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to create template')
    }
    return response.json()
  }

  static async updateTemplate(id: string, data: Partial<Template>): Promise<Template> {
    const response = await fetch(`${API_URL}/templates/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to update template')
    }
    return response.json()
  }

  // Microsite Management
  static async getMicrosites(): Promise<Microsite[]> {
    const response = await fetch(`${API_URL}/microsites`)
    if (!response.ok) {
      throw new Error('Failed to fetch microsites')
    }
    return response.json()
  }

  static async getMicrosite(id: string): Promise<Microsite> {
    const response = await fetch(`${API_URL}/microsites/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch microsite')
    }
    return response.json()
  }

  static async createMicrosite(data: Omit<Microsite, 'id'>): Promise<Microsite> {
    const response = await fetch(`${API_URL}/microsites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to create microsite')
    }
    return response.json()
  }

  static async updateMicrosite(id: string, data: Partial<Microsite>): Promise<Microsite> {
    const response = await fetch(`${API_URL}/microsites/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to update microsite')
    }
    return response.json()
  }

  static async publishMicrosite(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/microsites/${id}/publish`, {
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error('Failed to publish microsite')
    }
  }

  static async checkDomainStatus(domain: string): Promise<{
    status: 'available' | 'taken' | 'error'
    message?: string
  }> {
    const response = await fetch(`${API_URL}/domains/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ domain }),
    })
    if (!response.ok) {
      throw new Error('Failed to check domain status')
    }
    return response.json()
  }
} 