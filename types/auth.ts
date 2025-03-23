export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  access: string
  refresh: string
}

export interface AuthError {
  message: string
  code: string
}

// For type safety in error handling
export interface ApiError {
  detail?: string
  code?: string
  message?: string
}

// For debugging purposes
export const AUTH_DEBUG = {
  logAuthResponse: (response: AuthResponse) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth Response:', { 
        access: response.access ? '${response.access.slice(0, 10)}...' : 'none',
        refresh: response.refresh ? '${response.refresh.slice(0, 10)}...' : 'none'
      })
    }
  },
  logAuthError: (error: AuthError | ApiError) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Auth Error:', error)
    }
  }
} 