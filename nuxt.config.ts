// nuxt.config.ts
export default defineNuxtConfig({
    compatibilityDate: 'latest',
    devtools: { enabled: false },
    future: {
        compatibilityVersion: 4
    },

    ssr: true,

    typescript: {
        typeCheck: true
    },

    extends: [
        './layers/base',
        './layers/auth'
    ],

    // Make Firebase config available via runtime config only
    runtimeConfig: {
        public: {
            firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
            firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
            firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
            demoApiUrl: process.env.DEMO_DEMOS_API_URL
        }
    }
});