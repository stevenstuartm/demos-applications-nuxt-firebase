// layers/base/shared/types.ts

import type { NavigationPermissionKey } from './routes'

// Navigation-specific types (these belong in base as they're used across all layers)
export interface NavigationPermissions extends Record<NavigationPermissionKey, boolean> {}

export interface NavigationMenuItem {
  label: string
  icon?: string
  to?: string
  authConstraint?: NavigationPermissionKey
  description?: string
  children?: NavigationMenuItem[]
}

// Generic API response types (shared across all layers)
export interface PagedResponse<T> {
  data: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}