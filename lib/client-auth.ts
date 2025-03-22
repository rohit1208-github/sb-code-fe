'use client'

import { AuthTokens, LoginCredentials, AuthResponse } from '@/types/auth'
import Cookies from 'js-cookie'

const AUTH_TOKEN_KEY = 'sb-auth-token'
const USER_KEY = 'sb-user'

// This will be replaced with actual API call later
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  // Hardcoded check for now
  if (credentials.username === 'johnny' && credentials.password === '1234') {
    const response = {
      tokens: {
        accessToken: 'dummy-access-token',
        refreshToken: 'dummy-refresh-token'
      },
      user: {
        id: '1',
        username: 'johnny',
        role: 'admin'
      }
    }
    
    // Store tokens in cookies
    Cookies.set(AUTH_TOKEN_KEY, JSON.stringify(response.tokens), {
      expires: 7, // 7 days
      path: '/',
      sameSite: 'strict'
    })

    // Store user info
    Cookies.set(USER_KEY, JSON.stringify(response.user), {
      expires: 7,
      path: '/',
      sameSite: 'strict'
    })

    return response
  }
  throw new Error('Invalid credentials')
}

export function getStoredAuth(): AuthTokens | null {
  const stored = Cookies.get(AUTH_TOKEN_KEY)
  if (!stored) return null
  return JSON.parse(stored)
}

export function getStoredUser() {
  const stored = Cookies.get(USER_KEY)
  if (!stored) return null
  return JSON.parse(stored)
}

export function clearAuth() {
  Cookies.remove(AUTH_TOKEN_KEY, { path: '/' })
  Cookies.remove(USER_KEY, { path: '/' })
}

export function isAuthenticated(): boolean {
  return !!getStoredAuth()
} 