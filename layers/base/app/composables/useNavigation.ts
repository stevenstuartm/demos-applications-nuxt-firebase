// layers/base/app/composables/useNavigation.ts

import { APP_ROUTES, ROUTE_PERMISSION_MAP, type AppRoute, type NavigationPermissionKey } from '~~/layers/base/shared/routes'

export const useNavigation = () => {
  const { navigationPermissions } = useAuthRoles()

  // Helper to check if a specific route is accessible
  const canAccessRoute = (routePath: AppRoute): boolean => {
    const permissionKey = ROUTE_PERMISSION_MAP[routePath]
    
    // If no permission required (null), assume it's accessible
    if (!permissionKey) return true
    
    return navigationPermissions.value[permissionKey] || false
  }

  // Helper to get available routes for current user
  const getAvailableRoutes = computed((): AppRoute[] => {
    return Object.entries(APP_ROUTES)
      .map(([_, routePath]) => routePath as AppRoute)
      .filter(routePath => canAccessRoute(routePath))
  })

  // Helper to navigate safely (only if user has access)
  const navigateToRoute = async (routePath: AppRoute) => {
    if (canAccessRoute(routePath)) {
      await navigateTo(routePath)
    } else {
      const { error: toastError } = useAppToast()
      toastError('You do not have permission to access this page.', 'Access Denied')
    }
  }

  // Helper to get the default route for a user based on their permissions
  const getDefaultRoute = computed((): AppRoute => {
    const availableRoutes = getAvailableRoutes.value
    
    // Priority order for default route selection
    const routePriority: AppRoute[] = [
      APP_ROUTES.DASHBOARD,
      APP_ROUTES.USER_MANAGEMENT
    ]

    for (const route of routePriority) {
      if (availableRoutes.includes(route)) {
        return route
      }
    }

    // Fallback to dashboard if somehow no routes are available
    return APP_ROUTES.DASHBOARD
  })


// Get route label for display purposes
  const getRouteLabel = (routePath: AppRoute): string => {
    const routeLabels: Record<AppRoute, string> = {
      [APP_ROUTES.LOGIN]: 'Login',
      [APP_ROUTES.RESET_PASSWORD]: 'Reset Password',
      [APP_ROUTES.DASHBOARD]: 'Dashboard',
      [APP_ROUTES.MY_PROFILE]: 'My Profile',
      [APP_ROUTES.USER_MANAGEMENT]: 'Demo Users'
    }
    
    return routeLabels[routePath] || routePath
  }

  return {
    // Route access checking
    canAccessRoute,
    getAvailableRoutes,
    getDefaultRoute,
    
    // Navigation utilities
    navigateToRoute,
    getRouteLabel,
    
    // Direct access to permissions
    navigationPermissions: readonly(navigationPermissions),
    
    // Route constants for easy access
    ROUTES: APP_ROUTES
  }
}