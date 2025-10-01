// layers/auth/app/plugins/firebase.client.ts
import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey as string,
    authDomain: config.public.firebaseAuthDomain as string,
    projectId: config.public.firebaseProjectId as string,
    storageBucket: config.public.firebaseStorageBucket as string,
    messagingSenderId: config.public.firebaseMessagingSenderId as string,
    appId: config.public.firebaseAppId as string
  }

  // Validate required config
  if (!firebaseConfig.apiKey || !firebaseConfig.authDomain) {
    console.error('Firebase configuration is incomplete. Please check your environment variables.')
    return
  }

  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)

    // Optional: Connect to auth emulator in development
    // if (process.dev) {
    //   connectAuthEmulator(auth, 'http://localhost:9099')
    // }

    console.log('Firebase initialized successfully')

    return {
      provide: {
        firebase: app,
        auth: auth
      }
    }
  } catch (error) {
    console.error('Failed to initialize Firebase:', error)
  }
})