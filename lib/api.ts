import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'

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

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: error.message || 'An unexpected error occurred',
      status: error.response?.status,
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