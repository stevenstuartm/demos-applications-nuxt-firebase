<script setup lang="ts">
import type { DemoUser } from "~~/layers/auth/shared/types";
import { formatLastSignIn, getRoleClass } from "../utils/user-functions";
import { VALID_AUTH_ROLES, getAuthRoleLabel, type AuthRole } from "~~/layers/auth/shared/types";

const { addUserRole, removeUserRole } = useAuthApi();
const { error: toastError } = useAppToast();

const props = defineProps<{ user: DemoUser | null }>();

interface Emits {
  (e: 'close'): void
}

const emit = defineEmits<Emits>()

// Modal state
const users = ref<DemoUser[]>( [] as DemoUser[] );
const addingRole = ref<boolean>( false );
const removingRoles = ref<Set<string>>( new Set() );
const selectedRole = ref<AuthRole>();

const selectedUser = computed<DemoUser>( () => {
  selectedRole.value = undefined;
  addingRole.value = false;
  removingRoles.value.clear();

  return props.user as DemoUser;
} );

// Available roles for selection - filtered to exclude roles the user already has
const availableRolesForUser = computed( () => {
  if ( !selectedUser.value ) {
    return [];
  }

  return VALID_AUTH_ROLES
      .filter( role => !selectedUser.value!.roles.includes( role ) )
      .map( role => ( {
        label: getAuthRoleLabel(role),
        value: role
      } ) );
} );

// Check if a role can be removed (prevent removing the last role from demo users)
const canRemoveRole = computed( () => ( role: AuthRole ) => {
  if ( !selectedUser.value ) return false;
  
  // If user has more than one role, they can remove any role
  if ( selectedUser.value.roles.length > 1 ) return true;
  
  // If user has only one role, they cannot remove it
  return false;
} );

// Add role to user
async function addRole() {
  if ( !selectedRole.value || !selectedUser.value || selectedUser.value.roles.includes( selectedRole.value ) ) {
    return;
  }

  const roleToAdd = selectedRole.value;
  addingRole.value = true;
  try {
    const updatedUser = await addUserRole( selectedUser.value.id, roleToAdd );
    selectedUser.value.roles = [ ...updatedUser.roles ];

    // Update the user in the main list
    const index = users.value.findIndex( u => u.id === updatedUser.id );
    if ( index !== -1 ) {
      users.value[ index ] = updatedUser;
    }

    selectedRole.value = undefined;
   
  } catch ( error ) {
    toastError( 'Failed to add role' );
  } finally {
    addingRole.value = false;
  }
}

// Remove role from user
async function removeRole( role: AuthRole ) {
  if ( !selectedUser.value || !selectedUser.value.roles.includes( role ) ) return
  
  // Check if this is the user's last role
  if ( !canRemoveRole.value( role ) ) {
    toastError( 'Cannot remove the last role from a user. Users must have at least one role assigned.', 'Remove Role Failed' )
    return
  }

  removingRoles.value.add( role )
  try {
    const updatedUser = await removeUserRole( selectedUser.value.id, role )
    selectedUser.value.roles = [ ...updatedUser.roles ];

    // Update the user in the main list
    const index = users.value.findIndex( u => u.id === updatedUser.id )
    if ( index !== -1 ) {
      users.value[ index ] = updatedUser
    }

  } catch ( error ) {
    toastError( 'Failed to remove role' )
  } finally {
    removingRoles.value.delete( role )
  }
}

// Helper functions like PrimeUserDetails
function getUserInitials(user: DemoUser): string {
  const displayName = user.displayName || user.email;
  const parts = displayName.split(/[\s@]/);
  if (parts.length >= 2 && parts[0]?.[0] && parts[1]?.[0]) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return displayName.substring(0, 2).toUpperCase();
}

const userDisplayName = computed(() => {
  if (!selectedUser.value) return '';
  return selectedUser.value.displayName || selectedUser.value.email || 'Unknown User';
})

const userInitials = computed(() => {
  if (!selectedUser.value) return '';
  return getUserInitials(selectedUser.value);
})

function handleClose() {
  emit('close')
}
</script>

<template>
  <!-- Modal Overlay -->
  <div class="content-container-primary fixed inset-0 bg-opacity-80 flex items-center justify-center z-50 overflow-y-auto" @click="handleClose">
    <div class="content-container-secondary shadow-xl max-w-4xl w-full mx-4 my-4" @click.stop>
      <!-- Header -->
      <div class="px-6 py-4 text-content">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0 h-10 w-10">
              <div class="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                <span class="text-sm font-medium text-white">
                  {{ userInitials }}
                </span>
              </div>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-content">{{ userDisplayName }}</h2>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <UButton
              @click="handleClose"
              class="button-primary"
            >Close</UButton>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 py-6">
        <div v-if="selectedUser">
          <div class="mb-6 content-container-primary">
            <h3 class="text-sm font-medium text-primary mb-3">User Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-primary">Display Name</label>
                <p class="mt-1 text-content text-sm">{{ selectedUser.displayName || 'Not set' }}</p>
              </div>
              <div>
                <label class="text-primary">Email</label>
                <p class="mt-1 text-content text-sm">{{ selectedUser.email }}</p>
              </div>
              <div>
                <label class="text-primary">User ID</label>
                <p class="mt-1 font-mono break-all text-content text-xs">{{ selectedUser.id }}</p>
              </div>
              <div>
                <label class="text-primary">Phone Number</label>
                <p class="mt-1 text-content text-sm">{{ selectedUser.phoneNumber || 'Not set' }}</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label class="text-primary mb-2">Account Status</label>
              <UBadge color="success">
                {{ selectedUser.disabled ? 'Disabled':'Active' }}
              </UBadge>
            </div>
            <div>
              <label class="text-primary mb-2">Email Verification</label>
              <UBadge color="success">
                {{ selectedUser.emailVerified ? 'Verified':'Not Verified' }}
              </UBadge>
            </div>
          </div>

          <div class="border-t pt-6">
            <h4 class="text-primary mb-4">Role Management</h4>

            <div class="mb-4">
              <label class="text-primary mb-2">Current Roles</label>
              <div class="flex flex-wrap gap-2">
                    <span
                        v-for="role in selectedUser.roles"
                        :key="role"
                        :class="getRoleClass(role)"
                        class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {{ role }}
                      <UButton
                          @click.stop="removeRole(role)"
                          :disabled="removingRoles.has(role) || !canRemoveRole(role)"
                          class="ml-1 bg-transparent hover:bg-gray-200 p-1 rounded-full"
                          :title="canRemoveRole(role) ? 'Remove role' : 'Cannot remove the last role'"
                      >
                        <Icon name="i-lucide-x" class="h-3 w-3"/>
                      </UButton>
                    </span>
                <span v-if="selectedUser.roles.length === 0" class="text-content text-sm italic">
                      No roles assigned
                    </span>
              </div>
            </div>

            <div>
              <label class="block text-primary mb-2">Add Role</label>
              <div class="flex gap-2">
                <USelect v-model="selectedRole" :disabled="addingRole" placeholder="Select a role..."
                         :items="availableRolesForUser" value-key="value" class="w-40 text-primary flex-1 rounded-md px-3 py-2"
                         @click.stop
                         @change.stop/>
                <UButton @click.stop="addRole"
                        :disabled="!selectedRole || selectedUser.roles.includes(selectedRole) || addingRole"
                        class="button-primary">
                  {{ addingRole ? 'Adding...':'Add Role' }}
                </UButton>
              </div>
            </div>
          </div>

          <div class="border-t pt-6 mt-6">
            <h4 class="text-primary mb-4">Account History</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-primary">Created At</label>
                <p class="mt-1 text-content text-sm">
                  {{ selectedUser.createdAt ? new Date( selectedUser.createdAt ).toLocaleString():'Unknown' }}
                </p>
              </div>
              <div>
                <label class="block text-primary">Last Sign In</label>
                <p class="mt-1 text-content text-sm">
                  {{ formatLastSignIn( selectedUser.lastSignInAt ) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>