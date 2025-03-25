export const API_CONFIG = {
  // Using relative URLs to work with Next.js proxy
  BASE_URL: 'http://34.60.128.41:8000',
  ENDPOINTS: {
    LOGIN: '/api/token/',
    REFRESH: '/api/token/refresh/',
    COUNTRIES: '/api/management/countries/',
    BRANCHES: '/api/management/branches/',
    DASHBOARD_STATS: '/api/analytics/dashboard-stats/',
    ROLES: '/api/users/roles',
    USERS: '/api/users',
    TESTIMONIALS: '/api/content/testimonials',
    CAREERS: '/api/content/careers',
  },
} as const

// For debugging purposes
if (process.env.NODE_ENV === 'development') {
  console.log('API Configuration:', API_CONFIG)
} 