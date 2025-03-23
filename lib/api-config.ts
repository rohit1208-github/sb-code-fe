export const API_CONFIG = {
  BASE_URL: 'http://192.168.0.239:8000',
  ENDPOINTS: {
    LOGIN: '/api/token/',
    REFRESH: '/api/token/refresh/',
  },
} as const

// For debugging purposes
if (process.env.NODE_ENV === 'development') {
  console.log('API Configuration:', API_CONFIG)
} 