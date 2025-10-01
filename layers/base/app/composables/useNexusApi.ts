// layers/base/app/composables/useDemoApi.ts
// Generic API utilities that can be shared across layers

export const useDemoApi = () => {
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
        const apiUrl = config.public.demoApiUrl as string;

        if (!apiUrl) {
            throw new Error('DEMO_DEMOS_API_URL environment variable is not configured');
        }

        return `${apiUrl.replace(/\/$/, '')}${endpoint}`;
    }

    return {
        getAuthHeaders,
        handleApiError,
        getApiUrl
    }
}