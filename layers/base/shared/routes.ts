// layers/base/shared/routes.ts

/**
 * Centralized definition of all application routes
 * This ensures consistency across navigation, middleware, and components
 */
export const APP_ROUTES = {
  // Public routes
  LOGIN: '/login',
  RESET_PASSWORD: '/reset-password',
  
  // Main application routes
  DASHBOARD: '/',
  MY_PROFILE: '/my-profile',
  USER_MANAGEMENT: '/user-management',
} as const

/**
 * Type for valid route paths
 */
export type AppRoute = typeof APP_ROUTES[keyof typeof APP_ROUTES]

/**
 * Public routes that don't require authentication
 */
export const PUBLIC_ROUTES = [
  APP_ROUTES.LOGIN,
  APP_ROUTES.RESET_PASSWORD
] as const

/**
 * Permission keys that correspond to navigation access
 */
export const NAVIGATION_PERMISSIONS = {
  DASHBOARD: 'dashboard',
  MY_PROFILE: 'myProfile',
  USER_MANAGEMENT: 'userManagement', 
} as const

/**
 * Type for navigation permission keys
 */
export type NavigationPermissionKey = typeof NAVIGATION_PERMISSIONS[keyof typeof NAVIGATION_PERMISSIONS]

/**
 * Mapping between routes and their required permissions
 */
export const ROUTE_PERMISSION_MAP: Record<AppRoute, NavigationPermissionKey | null> = {
  [APP_ROUTES.LOGIN]: null, // Public route
  [APP_ROUTES.RESET_PASSWORD]: null, // Public route
  [APP_ROUTES.DASHBOARD]: NAVIGATION_PERMISSIONS.DASHBOARD,
  [APP_ROUTES.MY_PROFILE]: NAVIGATION_PERMISSIONS.MY_PROFILE,
  [APP_ROUTES.USER_MANAGEMENT]: NAVIGATION_PERMISSIONS.USER_MANAGEMENT,
} as const