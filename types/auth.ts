export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  tokens: AuthTokens
  user: {
    id: string
    username: string
    role: string
  }
}

export interface AuthError {
  message: string
  code: string
} 