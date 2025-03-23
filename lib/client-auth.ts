'use client'

import { AuthTokens, LoginCredentials, AuthResponse, AuthError, AUTH_DEBUG } from '@/types/auth'
import Cookies from 'js-cookie'
import { API_CONFIG } from './api-config'

const ACCESS_TOKEN_KEY = 'sb-access-token'
const REFRESH_TOKEN_KEY = 'sb-refresh-token'

const COOKIE_OPTIONS = {
  expires: 7,
  path: '/',
  sameSite: 'strict'
} as const

// For debugging purposes
const logAuthAction = (action: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Auth Action: ${action}`, data)
  }
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  logAuthAction('Login Attempt', { email: credentials.email })
  
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const errorData = await response.json()
      logAuthAction('Login Error', errorData)
      throw {
        message: errorData.detail || 'Authentication failed',
        code: response.status.toString(),
      }
    }

    const data: AuthResponse = await response.json()
    AUTH_DEBUG.logAuthResponse(data)

    // Store tokens in cookies
    Cookies.set(ACCESS_TOKEN_KEY, data.access, COOKIE_OPTIONS)
    Cookies.set(REFRESH_TOKEN_KEY, data.refresh, COOKIE_OPTIONS)

    logAuthAction('Login Success')
    return data
  } catch (error) {
    AUTH_DEBUG.logAuthError(error as AuthError)
    throw error
  }
}

export function getAuthTokens(): AuthTokens | null {
  const access = Cookies.get(ACCESS_TOKEN_KEY)
  const refresh = Cookies.get(REFRESH_TOKEN_KEY)

  if (!access || !refresh) {
    logAuthAction('Get Auth Tokens', 'No tokens found')
    return null
  }

  logAuthAction('Get Auth Tokens', 'Tokens found')
  return { access, refresh }
}

export function clearAuth(): void {
  logAuthAction('Clear Auth')
  Cookies.remove(ACCESS_TOKEN_KEY)
  Cookies.remove(REFRESH_TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  const tokens = getAuthTokens()
  const isAuth = !!tokens?.access
  logAuthAction('Check Authentication', { isAuthenticated: isAuth })
  return isAuth
} 