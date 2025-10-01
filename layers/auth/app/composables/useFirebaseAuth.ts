import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  type User,
  type Auth
} from 'firebase/auth'
import { until } from '@vueuse/core'

// Global state to share across all component instances
const globalUser = ref<User | null>(null)
const globalLoading = ref(true)
const globalInitialized = ref(false)
let authUnsubscribe: (() => void) | null = null

export const useFirebaseAuth = () => {
  const { $auth } = useNuxtApp()

  const getAuth = (): Auth => {
    if (!$auth || typeof $auth !== 'object') {
      throw new Error('Firebase Auth not initialized. Please check your Firebase configuration.')
    }
    return $auth as Auth
  }

  // Initialize auth listener only once globally - but don't call it immediately
  const initializeAuth = () => {
    if (globalInitialized.value || authUnsubscribe) {
      return
    }

    try {
      const auth = getAuth()
      
      authUnsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        globalUser.value = firebaseUser
        globalLoading.value = false
        globalInitialized.value = true
      }, (error) => {
        console.error('Auth state change error:', error)
        globalLoading.value = false
        globalInitialized.value = true
      })
    } catch (err) {
      console.error('Failed to initialize auth listener:', err)
      globalLoading.value = false
      globalInitialized.value = true
      throw err
    }
  }

  // Computed properties for common auth states
  const isAuthenticated = computed(() => 
    globalInitialized.value && !!globalUser.value
  )
  
  const isReady = computed(() => 
    globalInitialized.value && !globalLoading.value
  )
  
  const needsEmailVerification = computed(() => 
    isAuthenticated.value && !globalUser.value?.emailVerified
  )

  // Utility function to wait for auth initialization
  const waitForAuth = async () => {
    // Initialize if not already done
    if (!globalInitialized.value && !authUnsubscribe) {
      initializeAuth()
    }
    
    if (globalInitialized.value) return
    await until(globalInitialized).toBe(true)
  }

  // Auth methods
  const signIn = async (email: string, password: string) => {
    const auth = getAuth()
    const result = await signInWithEmailAndPassword(auth, email, password)
    globalUser.value = result.user
    return result
  }

  const signOut = async () => {
    const auth = getAuth()
    await firebaseSignOut(auth)
    globalUser.value = null
  }

  const resetPassword = async (email: string) => {
    const auth = getAuth()
    await sendPasswordResetEmail(auth, email)
  }

  const resendVerification = async () => {
    if (!globalUser.value) {
      throw new Error('No user signed in')
    }
    await sendEmailVerification(globalUser.value)
  }

  const getAuthToken = async (): Promise<string> => {
    if (!globalUser.value) {
      throw new Error('User is not authenticated')
    }
    
    try {
      const token = await globalUser.value.getIdToken()
      return token
    } catch (error) {
      throw new Error('Authentication token could not be retrieved')
    }
  }

  const getFirebaseErrorMessage = (error: any): string => {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No account found with this email address.'
      case 'auth/wrong-password':
        return 'Incorrect password.'
      case 'auth/invalid-email':
        return 'Please enter a valid email address.'
      case 'auth/user-disabled':
        return 'This account has been disabled.'
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.'
      case 'auth/invalid-credential':
        return 'Invalid email or password.'
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.'
      case 'auth/email-already-verified':
        return 'Your email is already verified.'
      case 'auth/requires-recent-login':
        return 'Please sign in again to perform this action.'
      default:
        return error.message || 'An unexpected error occurred.'
    }
  }

  return {
    user: readonly(globalUser),
    loading: readonly(globalLoading),
    initialized: readonly(globalInitialized),
    isAuthenticated,
    isReady,
    needsEmailVerification,
    signIn,
    signOut,
    resetPassword,
    resendVerification,
    waitForAuth,
    getFirebaseErrorMessage,
    getAuthToken
  }
}