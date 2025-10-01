// layers/auth/app/middleware/role-based.ts

import { APP_ROUTES } from '~~/layers/base/shared/routes'

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return

  try {
    const { isAuthenticated, waitForAuth } = useFirebaseAuth()
    const { 
      canAccessDemoUsers,
      canAccessOrderActivity,
      canAccessPrimeUsers,
      canAccessServiceManagement,
      canAccessSentientSectors,
      canAccessPortfolioManagement,
      canAccessMyProfile
    } = useAuthRoles()
    const { error: toastError } = useAppToast()
    
    // Wait for auth initialization
    await waitForAuth()
    
    // Check if user is authenticated first
    if (!isAuthenticated.value) {
      return navigateTo({
        path: APP_ROUTES.LOGIN,
        query: { redirect: to.fullPath }
      })
    }
    
    // Route-specific permission checks using centralized constants
    const routePermissionChecks: Record<string, () => Promise<boolean>> = {
      [APP_ROUTES.MY_PROFILE]: canAccessMyProfile,
      [APP_ROUTES.USER_MANAGEMENT]: canAccessDemoUsers
    }
    
    const checkPermission = routePermissionChecks[to.path]
    
    if (checkPermission) {
      const hasAccess = await checkPermission()
      
      if (!hasAccess) {
        toastError('You do not have permission to access this page.', 'Access Denied')
        return navigateTo(APP_ROUTES.DASHBOARD)
      }
    }
    
  } catch (error) {
    console.error('Role-based middleware error:', error)
    const { error: toastError } = useAppToast()
    toastError('Authentication error. Please try signing in again.', 'Authentication Error')
    return navigateTo(APP_ROUTES.LOGIN)
  }
})