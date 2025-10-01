// layers/auth/shared/types.ts

/**
 * Centralized authentication role constants
 * These match exactly with the backend UserApplicationRoles.cs
 */
export const AUTH_ROLES = {
  ADMIN: 'admin',
  SUPPORT: 'support',
  PRODUCT_OWNER: 'product-owner',
  SALES_ADMIN: 'sales-admin',
  SALES_REP: 'sales-rep'
} as const

/**
 * Array of all valid roles for easier iteration and validation
 */
export const VALID_AUTH_ROLES = Object.values(AUTH_ROLES)

/**
 * Type for valid auth roles
 */
export type AuthRole = typeof AUTH_ROLES[keyof typeof AUTH_ROLES]

/**
 * Check if a given string is a valid auth role
 */
export function isValidAuthRole(role: string): role is AuthRole {
  return VALID_AUTH_ROLES.includes(role as AuthRole)
}

/**
 * Role display names for UI components
 */
export const AUTH_ROLE_LABELS: Record<AuthRole, string> = {
  [AUTH_ROLES.ADMIN]: 'Admin',
  [AUTH_ROLES.SUPPORT]: 'Support',
  [AUTH_ROLES.PRODUCT_OWNER]: 'Product Owner',
  [AUTH_ROLES.SALES_ADMIN]: 'Sales Admin',
  [AUTH_ROLES.SALES_REP]: 'Sales Rep'
}

/**
 * Convert role to display label
 */
export function getAuthRoleLabel(role: AuthRole): string {
  return AUTH_ROLE_LABELS[role] || role.charAt(0).toUpperCase() + role.slice(1)
}

/**
 * Role groups for permission checking
 */
export const AUTH_ROLE_GROUPS = {
  ADMINS: [AUTH_ROLES.ADMIN],
  SUPPORT_STAFF: [AUTH_ROLES.ADMIN, AUTH_ROLES.SUPPORT],
  PRODUCT_MANAGERS: [AUTH_ROLES.ADMIN, AUTH_ROLES.PRODUCT_OWNER],
  SALES_TEAM: [AUTH_ROLES.ADMIN, AUTH_ROLES.SUPPORT, AUTH_ROLES.SALES_ADMIN, AUTH_ROLES.SALES_REP],
  ALL_AUTHENTICATED: [AUTH_ROLES.ADMIN, AUTH_ROLES.SUPPORT, AUTH_ROLES.PRODUCT_OWNER, AUTH_ROLES.SALES_ADMIN, AUTH_ROLES.SALES_REP]
} as const satisfies Record<string, AuthRole[]>

// Auth-specific types
export interface DemoUser {
  id: string
  displayName: string
  email: string
  emailVerified: boolean
  disabled: boolean
  roles: AuthRole[]
  phoneNumber?: string
  tenantId?: string
  createdAt?: string
  lastSignInAt?: string
}

export interface CreateUserRequest {
  email: string
  name: string
  password?: string
  initialRoles?: AuthRole[]
}

export interface UpdateUserRequest {
  email: string
  name: string
  isActive: boolean
}

export interface UserRolesResponse {
  userId: string
  roles: AuthRole[]
}