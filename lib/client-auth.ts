'use client'

import { AuthTokens, LoginCredentials, AuthResponse, AuthError, AUTH_DEBUG } from '@/types/auth'
import Cookies from 'js-cookie'
import { API_CONFIG } from './api-config'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

const ACCESS_TOKEN_KEY = 'sb-access-token'
const REFRESH_TOKEN_KEY = 'sb-refresh-token'

const COOKIE_OPTIONS = {
  expires: 7,
  path: '/',
  sameSite: 'strict'
} as const

// Constants
const AUTH_TOKEN_KEY = 'sb_auth_token'
const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password']

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
    
    // Also store in localStorage for our auth protection
    localStorage.setItem(AUTH_TOKEN_KEY, data.access)

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
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return isTokenValid()
}

// Get token from localStorage
export function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  }
  return null
}

// Set token in localStorage
export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  }
}

// Check if token is valid
export function isTokenValid() {
  // First check localStorage
  const token = getAuthToken()
  
  // If not in localStorage, check cookies
  const cookieToken = Cookies.get(ACCESS_TOKEN_KEY)
  
  // Use whichever token is available
  const authToken = token || cookieToken
  
  if (!authToken) return false
  
  try {
    const decoded: any = jwtDecode(authToken)
    const currentTime = Date.now() / 1000
    
    // Check if token is expired
    return decoded.exp > currentTime
  } catch (error) {
    console.error('Error decoding token:', error)
    return false
  }
}

// Auth protection hook
export function useAuthProtection() {
  const router = useRouter()
  const pathname = usePathname()
  
  useEffect(() => {
    // Add a small delay to ensure localStorage is available
    const checkAuth = setTimeout(() => {
      const isAuthenticated = isTokenValid()
      
      // Check if current path is a public route (more robust matching)
      const isPublicRoute = PUBLIC_ROUTES.some(route => 
        pathname === route || 
        pathname.startsWith(`${route}/`) ||
        pathname === `${route}`
      )
      
      console.log('Auth check:', { isAuthenticated, isPublicRoute, pathname })
      
      // If on a public route but authenticated, redirect to dashboard
      if (isPublicRoute && isAuthenticated) {
        console.log('Redirecting to dashboard from public route')
        router.replace('/dashboard')
      }
      
      // If on a protected route but not authenticated, redirect to login
      if (!isPublicRoute && !isAuthenticated) {
        console.log('Redirecting to login from protected route')
        router.replace('/login')
      }
    }, 100)
    
    return () => clearTimeout(checkAuth)
  }, [pathname, router])
  
  return { isAuthenticated: isTokenValid() }
} 