// NOTE: This file is for future use with the backend API
// Currently not in use as we're using client-side auth for development

import { AuthTokens, LoginCredentials, AuthResponse } from '@/types/auth'
import { cookies } from 'next/headers'

const AUTH_COOKIE_NAME = 'sb-auth'

export function setAuthCookies(tokens: AuthTokens) {
  const cookieStore = cookies()
  cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(tokens), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  })
}

export function getAuthCookies(): AuthTokens | null {
  const cookieStore = cookies()
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME)
  if (!authCookie) return null
  return JSON.parse(authCookie.value)
}

export function clearAuthCookies() {
  const cookieStore = cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
}

// This will be implemented when we have the backend API
export async function serverLogin(credentials: LoginCredentials): Promise<AuthResponse> {
  throw new Error('Not implemented')
} 