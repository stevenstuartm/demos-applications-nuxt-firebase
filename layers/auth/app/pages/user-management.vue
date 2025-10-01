<script setup lang="ts">
import { type DemoUser, VALID_AUTH_ROLES, type AuthRole } from "~~/layers/auth/shared/types";
import ManageUser from "../components/ManageUser.vue";
import { formatLastSignIn, getRoleClass } from "../utils/user-functions";

definePageMeta({
  middleware: 'role-based'
})

const { getUsers } = useAuthApi();
const { error: toastError } = useAppToast();

// Reactive state
const users = ref<DemoUser[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const selectedUser = ref<DemoUser | null>(null);
const searchTerm = ref('');
const noRoleFilter = '---';
const roleFilter = ref<AuthRole | string>(noRoleFilter);

// Role filter options - properly bound to VALID_AUTH_ROLES
const roleFilterOptions = computed(() => [
  { label: 'All Roles', value: noRoleFilter },
  ...VALID_AUTH_ROLES.map(role => ({
    label: role.charAt(0).toUpperCase() + role.slice(1),
    value: role
  }))
]);

// Filtered users based on search and role filter
const filteredUsers = computed(() => {
  let filtered = users.value;

  // Apply search filter
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase();
    filtered = filtered.filter(user =>
        user.displayName?.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.id.toLowerCase().includes(search)
    );
  }

  // Apply role filter
  if (roleFilter.value) {
    filtered = filtered.filter(user =>
        roleFilter.value === noRoleFilter || user.roles.includes(roleFilter.value as AuthRole)
    );
  }

  return filtered;
});

// Load users from API
const loadUsers = async () => {
  try {
    loading.value = true;
    error.value = null;

    users.value = (await getUsers()).data;
  } catch (err: any) {
    const msg = 'Failed to load users';
    console.error(msg, err);
    error.value = err.message || msg;
    toastError(msg);
  } finally {
    loading.value = false;
  }
}

// Refresh users
const refreshUsers = async () => {
  await loadUsers();
}

// Load users on component mount
onMounted(() => {
  loadUsers();
});

// Handle user selection
function selectUser(user: DemoUser) {
  console.log('Selecting user:', user); // Debug log
  selectedUser.value = user;
}

function closeModal() {
  selectedUser.value = null;
}

// Renamed to match PrimeUserTable pattern
function closeUserDetails() {
  selectedUser.value = null;
}

function getUserInitials(user: DemoUser): string {
  const displayName = user.displayName || user.email;
  const parts = displayName.split(/[\s@]/);
  if (parts.length >= 2 && parts[0]?.[0] && parts[1]?.[0]) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return displayName.substring(0, 2).toUpperCase();
}
</script>

<!-- layers/auth/app/pages/user-management.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <UCard  class="content-container-secondary">
      <div>
        <h1 class="text-2xl font-bold text-primary">User Management</h1>
      </div>
    </UCard>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p class="text-gray-600 mt-4">Loading users...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 mb-4">
        <Icon name="i-lucide-alert-circle" class="h-12 w-12 mx-auto"/>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Failed to load users</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <UButton @click="refreshUsers"  class="button-secondary">
        Try Again
      </UButton>
    </div>

    <!-- Users Table -->
    <UCard v-else-if="users.length > 0"  class="content-container-secondary">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-primary">Users</h2>

          <!-- Search and Filters -->
          <div class="flex gap-2">
            <UInput
                v-model="searchTerm"
                placeholder="Search users..."
                class="w-64"
            >
              <template #leading>
                <Icon name="i-lucide-search"/>
              </template>
            </UInput>

            <USelect v-model="roleFilter" :items="roleFilterOptions" value-key="value" class="w-40 text-primary select-primary-text"/>

            <!-- Refresh Button -->
            <UButton @click="refreshUsers" :loading="loading"  class="button-primary">
              Refresh
            </UButton>
            
          </div>
        </div>
      </div>

      <div class="overflow-x-auto table-container">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="table-header">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
              User
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
              Roles
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
              Last Sign In
            </th>
          </tr>
          </thead>
          <tbody class="table-body divide-y divide-gray-200">
          <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-700 cursor-pointer" @click="selectUser(user)">
            <!-- User Info -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span class="text-primary-700 font-medium text-sm">
                        {{ getUserInitials(user) }}
                      </span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-content">
                    {{ user.displayName || 'No name' }}
                  </div>
                  <div class="text-sm text-content">{{ user.email }}</div>
                  <div class="text-xs text-content">ID: {{ user.id.substring(0, 8) }}...</div>
                </div>
              </div>
            </td>

            <!-- Status -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="space-y-1">
                <UBadge :color="user.disabled ? 'error' : 'success'" size="sm">
                  {{ user.disabled ? 'Disabled' : 'Active' }}
                </UBadge>
                <UBadge
                    :color="user.emailVerified ? 'success' : 'warning'"
                    size="sm"
                    class="block"
                >
                  {{ user.emailVerified ? 'Verified' : 'Unverified' }}
                </UBadge>
              </div>
            </td>

            <!-- Roles -->
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1">
                <UBadge
                    v-for="role in user.roles"
                    :key="role"
                    
                    :class="getRoleClass(role)"
                    size="sm"
                >
                  {{ role }}
                </UBadge>
                <UBadge v-if="user.roles.length === 0"  size="sm">
                  No roles
                </UBadge>
              </div>
            </td>

            <!-- Last Sign In -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatLastSignIn(user.lastSignInAt) }}
            </td>

          </tr>
          </tbody>
        </table>
      </div>
    </UCard>

    <!-- Empty State -->
    <UCard v-else class="content-container-primary">
      <div class="text-center py-12">
        <Icon name="i-lucide-users" class="h-12 w-12 text-gray-400 mx-auto mb-4"/>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No users found</h3>
        <p class="text-gray-600">There are no users in the system yet.</p>
      </div>
    </UCard>

    <!-- User Details Modal - Direct rendering like PrimeUserTable -->
    <ManageUser
      v-if="selectedUser"
      :user="selectedUser"
      @close="closeUserDetails"
    />
  </div>
</template>