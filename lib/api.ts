import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import { API_CONFIG } from './api-config'
import Cookies from 'js-cookie'

// Types
export interface ApiError {
  message: string
  code?: string
  status?: number
}

export interface ApiResponse<T = any> {
  data: T
  error: ApiError | null
}

const ACCESS_TOKEN_KEY = 'sb-access-token'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Add request interceptor for auth and logging
api.interceptors.request.use(
  (config) => {
    // Add auth header if token exists
    const token = Cookies.get(ACCESS_TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log request details
    console.log('🔐 Using token:', token)
    console.log('🚀 Request:', {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      data: config.data,
      params: config.params,
      headers: {
        ...config.headers,
        Authorization: token ? 'Bearer [HIDDEN]' : 'None',
      },
    })

    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling and logging
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ Response:', {
      status: response.status,
      data: response.data,
    })
    return response
  },
  (error: AxiosError) => {
    const errorResponse = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    }

    // Try to parse HTML error message if received
    if (typeof errorResponse.data === 'string' && errorResponse.data.includes('<!DOCTYPE html>')) {
      try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(errorResponse.data, 'text/html')
        const errorElement = doc.querySelector('.exception_value') || doc.querySelector('.traceback')
        if (errorElement) {
          errorResponse.data = {
            detail: errorElement.textContent?.trim() || 'Server error occurred'
          }
        }
      } catch (e) {
        errorResponse.data = { detail: 'Failed to parse server error' }
      }
    }

    console.error('❌ Response Error:', errorResponse)
    const apiError: ApiError = {
      message: errorResponse.message || 'An unexpected error occurred',
      status: errorResponse.status,
      code: error.code,
    }
    return Promise.reject(apiError)
  }
)

// Generic request wrapper
async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  data?: any,
  params?: any
): Promise<ApiResponse<T>> {
  try {
    const response = await api.request<T>({
      method,
      url,
      data,
      params,
    })
    return { data: response.data, error: null }
  } catch (error) {
    const apiError = error as ApiError
    return { data: null as T, error: apiError }
  }
}

// Export request methods
export const apiClient = {
  get: <T>(url: string, params?: any) => request<T>('GET', url, undefined, params),
  post: <T>(url: string, data: any) => request<T>('POST', url, data),
  put: <T>(url: string, data: any) => request<T>('PUT', url, data),
  delete: <T>(url: string) => request<T>('DELETE', url),
  patch: <T>(url: string, data: any) => request<T>('PATCH', url, data),
}

export default api 