// layers/auth/app/composables/useAuthRoles.ts

import { APP_ROUTES, NAVIGATION_PERMISSIONS, type NavigationPermissionKey } from '~~/layers/base/shared/routes'
import { AUTH_ROLES, AUTH_ROLE_GROUPS, type AuthRole } from '~~/layers/auth/shared/types'

export const useAuthRoles = () => {
  const { user } = useFirebaseAuth()

  // Get user's custom claims (including roles)
  const getUserClaims = async () => {
    if (!user.value) return null
    
    try {
      const idTokenResult = await user.value.getIdTokenResult()
      return idTokenResult.claims || {}
    } catch (error) {
      console.error('Error getting user claims:', error)
      return null
    }
  }

  // Get user roles from Firebase claims
  const getUserRoles = async (): Promise<AuthRole[]> => {
    const claims = await getUserClaims()
    if (!claims || !claims.roles) return []
    
    // Handle different possible structures of roles claim
    if (Array.isArray(claims.roles)) {
      return claims.roles as AuthRole[]
    }
    
    // If roles is a single string, convert to array
    if (typeof claims.roles === 'string') {
      return [claims.roles as AuthRole]
    }
    
    return []
  }

  // Check if user has a specific role
  const hasRole = async (role: AuthRole): Promise<boolean> => {
    const userRoles = await getUserRoles()
    return userRoles.includes(role)
  }

  // Check if user has any of the specified roles
  const hasAnyRole = async (roles: AuthRole[]): Promise<boolean> => {
    const userRoles = await getUserRoles()
    return roles.some(role => userRoles.includes(role))
  }

  // Check if user has all of the specified roles
  const hasAllRoles = async (roles: AuthRole[]): Promise<boolean> => {
    const userRoles = await getUserRoles()
    return roles.every(role => userRoles.includes(role))
  }

  // Core role checks using constants
  const isAdmin = async (): Promise<boolean> => {
    return await hasRole(AUTH_ROLES.ADMIN)
  }

  const canManageDemoUsers = async (): Promise<boolean> => {
    return await hasAnyRole([...AUTH_ROLE_GROUPS.ADMINS])
  }

  const canAccessDemoUsers = async (): Promise<boolean> => {
    return await hasAnyRole([...AUTH_ROLE_GROUPS.ADMINS])
  }

  const canAccessPrimeUsers = async (): Promise<boolean> => {
    return await hasAnyRole([...AUTH_ROLE_GROUPS.SALES_TEAM])
  }

  const canManagePrimeUsers = async (): Promise<boolean> => {
    return await hasAnyRole([...AUTH_ROLE_GROUPS.SALES_TEAM])
  }

  const canViewPrimeUserDetails = async (): Promise<boolean> => {
    return await hasAnyRole([...AUTH_ROLE_GROUPS.SALES_TEAM])
  }

  // NAVIGATION-SPECIFIC PERMISSION CHECKS
  const canAccessDashboard = async (): Promise<boolean> => {
    return true // All authenticated users can access dashboard (checked by auth middleware)
  }

  const canAccessOrderActivity = async (): Promise<boolean> => {
    return await hasAnyRole([...AUTH_ROLE_GROUPS.SALES_TEAM])
  }

  const canAccessServiceManagement = async (): Promise<boolean> => {
    return await hasAnyRole([...AUTH_ROLE_GROUPS.PRODUCT_MANAGERS])
  }

  const canAccessSentientSectors = async (): Promise<boolean> => {
    return await hasAnyRole([...AUTH_ROLE_GROUPS.PRODUCT_MANAGERS])
  }

  const canAccessPortfolioManagement = async (): Promise<boolean> => {
    return await hasAnyRole([...AUTH_ROLE_GROUPS.PRODUCT_MANAGERS])
  }

  const canAccessMyProfile = async (): Promise<boolean> => {
    return true // All authenticated users can access their own profile
  }

  // Navigation permission function map
const navigationPermissionChecks = {
    [NAVIGATION_PERMISSIONS.DASHBOARD]: canAccessDashboard,
    [NAVIGATION_PERMISSIONS.MY_PROFILE]: canAccessMyProfile,
    [NAVIGATION_PERMISSIONS.USER_MANAGEMENT]: canAccessDemoUsers
  }

  // Reactive properties for commonly needed checks
  const userRoles = ref<AuthRole[]>([])
  const isAdminUser = ref(false)
  const canManageUsersReactive = ref(false)
  const canManagePrimeUsersReactive = ref(false)
  const canViewPrimeUserDetailsReactive = ref(false)

  // Reactive navigation permissions
  const navigationPermissions = ref<Record<NavigationPermissionKey, boolean>>({
    [NAVIGATION_PERMISSIONS.DASHBOARD]: false,
    [NAVIGATION_PERMISSIONS.USER_MANAGEMENT]: false,
    [NAVIGATION_PERMISSIONS.MY_PROFILE]: false,
  })

  // Watch for user changes and update reactive properties
  watchEffect(async () => {
    if (user.value) {
      try {
        const roles = await getUserRoles()
        userRoles.value = roles
        isAdminUser.value = roles.includes(AUTH_ROLES.ADMIN)
        canManageUsersReactive.value = roles.includes(AUTH_ROLES.ADMIN)
        canManagePrimeUsersReactive.value = AUTH_ROLE_GROUPS.SALES_TEAM.some(role => roles.includes(role))
        canViewPrimeUserDetailsReactive.value = AUTH_ROLE_GROUPS.SALES_TEAM.some(role => roles.includes(role))

        // Update navigation permissions
        for (const [permissionKey, checkFunction] of Object.entries(navigationPermissionChecks)) {
          navigationPermissions.value[permissionKey as NavigationPermissionKey] = await checkFunction()
        }
      } catch (error) {
        console.error('Error updating user roles:', error)
        userRoles.value = []
        isAdminUser.value = false
        canManageUsersReactive.value = false
        canManagePrimeUsersReactive.value = false
        canViewPrimeUserDetailsReactive.value = false

        // Reset all navigation permissions on error
        Object.keys(navigationPermissions.value).forEach(key => {
          navigationPermissions.value[key as NavigationPermissionKey] = false
        })
      }
    } else {
      userRoles.value = []
      isAdminUser.value = false
      canManageUsersReactive.value = false
      canManagePrimeUsersReactive.value = false
      canViewPrimeUserDetailsReactive.value = false

      // Reset all navigation permissions when not authenticated
      Object.keys(navigationPermissions.value).forEach(key => {
        navigationPermissions.value[key as NavigationPermissionKey] = false
      })
    }
  })

  return {
    // Existing functionality
    getUserClaims,
    getUserRoles,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    canManageUsers: canManageDemoUsers,
    canManagePrimeUsers,
    canViewPrimeUserDetails,
    
    // Navigation-specific functionality
    canAccessDashboard,
    canAccessDemoUsers,
    canAccessOrderActivity,
    canAccessPrimeUsers,
    canAccessServiceManagement,
    canAccessSentientSectors,
    canAccessPortfolioManagement,
    canAccessMyProfile,
    
    // Reactive properties
    userRoles: readonly(userRoles),
    isAdminUser: readonly(isAdminUser),
    canManageUsersReactive: readonly(canManageUsersReactive),
    canManagePrimeUsersReactive: readonly(canManagePrimeUsersReactive),
    canViewPrimeUserDetailsReactive: readonly(canViewPrimeUserDetailsReactive),
    navigationPermissions: readonly(navigationPermissions)
  }
}