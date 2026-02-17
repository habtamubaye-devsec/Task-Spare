export type Role = 'ADMIN' | 'MANAGER' | 'MEMBER'
export type SystemRole = 'SUPER_ADMIN' | 'USER'

export interface User {
  id: string
  name: string
  email: string
  role?: Role | null
  systemRole?: SystemRole
  organizationId?: string | null
  verified?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
}
