// layers/auth/app/composables/useAuthApi.ts
import type { DemoUser } from '~~/layers/auth/shared/types';
import type { PagedResponse, ApiError } from '~~/layers/base/shared/types';

export const useAuthApi = () => {
    const config = useRuntimeConfig();
    const { getAuthToken } = useFirebaseAuth();
    const { error: toastError } = useAppToast();

    async function getAuthHeaders() {
        const token = await getAuthToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    const handleApiError = (error: any): never => {
        console.error('API Error:', error);

        // Extract error message from different error structures
        let message = 'An unexpected error occurred';

        if (error.data?.message) {
            message = error.data.message;
        } else if (error.message) {
            message = error.message;
        } else if (typeof error === 'string') {
            message = error;
        }

        toastError(message, 'API Error');
        throw error;
    }

    function getApiUrl(endpoint: string): string {
        const apiUrl = config.public.demoexusApiUrl as string;

        if (!apiUrl) {
            throw new Error('DEMO_DEMOS_API_URL environment variable is not configured');
        }

        return `${apiUrl.replace(/\/$/, '')}${endpoint}`;
    }

    // Get all users (paginated)
    async function getUsers(): Promise<PagedResponse<DemoUser>> {
        try {
            const headers = await getAuthHeaders();
            const url = getApiUrl('/users');

            return await $fetch<PagedResponse<DemoUser>>(url, {
                method: 'GET',
                headers
            });
        } catch (error) {
            return handleApiError(error);
        }
    }

    // Get specific user by ID
    async function getUser(userId: string): Promise<DemoUser> {
        try {
            const headers = await getAuthHeaders();
            const url = getApiUrl(`/users/${encodeURIComponent(userId)}`);

            return await $fetch<DemoUser>(url, {
                method: 'GET',
                headers
            });
        } catch (error) {
            return handleApiError(error);
        }
    }

    // Add role to user
    async function addUserRole(userId: string, role: string): Promise<DemoUser> {
        try {
            const headers = await getAuthHeaders();
            const url = getApiUrl(`/users/${encodeURIComponent(userId)}/roles/${encodeURIComponent(role)}`);

            return await $fetch<DemoUser>(url, {
                method: 'POST',
                headers
            });
        } catch (error) {
            return handleApiError(error);
        }
    }

    // Remove role from user
    async function removeUserRole(userId: string, role: string): Promise<DemoUser> {
        try {
            const headers = await getAuthHeaders();
            const url = getApiUrl(`/users/${encodeURIComponent(userId)}/roles/${encodeURIComponent(role)}`);

            return await $fetch<DemoUser>(url, {
                method: 'DELETE',
                headers
            });
        } catch (error) {
            return handleApiError(error);
        }
    }

    // Batch update user roles - helper function that adds/removes roles as needed
    async function updateUserRoles(userId: string, newRoles: string[]): Promise<DemoUser> {
        try {
            // Get current user to see what roles they have
            const currentUser = await getUser(userId);
            const currentRoles = currentUser.roles || [];

            // Find roles to add and remove
            const rolesToAdd = newRoles.filter((role: string) => !currentRoles.includes(role as any));
            const rolesToRemove = currentRoles.filter((role) => !newRoles.includes(role));

            let updatedUser = currentUser;

            // Remove roles first
            for (const role of rolesToRemove) {
                updatedUser = await removeUserRole(userId, role);
            }

            // Then add new roles
            for (const role of rolesToAdd) {
                updatedUser = await addUserRole(userId, role);
            }

            return updatedUser;
        } catch (error) {
            return handleApiError(error);
        }
    }

    return {
        getUsers,
        getUser,
        addUserRole,
        removeUserRole,
        updateUserRoles
    }
}