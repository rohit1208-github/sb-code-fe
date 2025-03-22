export interface Template {
  id: string
  name: string
  theme: 'light' | 'dark' | 'custom'
  layout: 'default' | 'modern' | 'classic'
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  components: TemplateComponent[]
  createdAt: string
  updatedAt: string
}

export interface TemplateComponent {
  id: string
  type: ComponentType
  name: string
  isEnabled: boolean
  settings: Record<string, any>
}

export type ComponentType =
  | 'header'
  | 'footer'
  | 'menu'
  | 'testimonials'
  | 'gallery'
  | 'contact'
  | 'about'
  | 'delivery'
  | 'careers'

export interface Microsite {
  id: string
  name: string
  domain: string
  branch: string
  template: string
  status: MicrositeStatus
  settings: MicrositeSettings
  seo: SEOSettings
  lastUpdated: string
  createdAt: string
  updatedAt: string
}

export type MicrositeStatus = 'published' | 'draft' | 'archived'

export interface MicrositeSettings {
  customDomain?: string
  languageSettings: {
    defaultLanguage: string
    supportedLanguages: string[]
  }
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  analytics: {
    googleAnalyticsId?: string
  }
  features: {
    onlineOrdering: boolean
    reservations: boolean
    giftCards: boolean
  }
}

export interface SEOSettings {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  customMetaTags: {
    name: string
    content: string
  }[]
} 