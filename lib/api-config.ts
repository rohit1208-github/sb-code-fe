export const API_CONFIG = {
  // Using relative URLs to work with Next.js proxy
  BASE_URL: '',
  ENDPOINTS: {
    LOGIN: '/api/token/',
    REFRESH: '/api/token/refresh/',
    COUNTRIES: '/api/management/countries/',
    BRANCHES: '/api/management/branches/',
    DASHBOARD_STATS: '/api/analytics/dashboard-stats/',
  },
} as const

// For debugging purposes
if (process.env.NODE_ENV === 'development') {
  console.log('API Configuration:', API_CONFIG)
} 