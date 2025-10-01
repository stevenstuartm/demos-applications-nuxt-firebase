import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({

    css: ['./layers/base/app/assets/css/main.css'],

    modules: [
        '@nuxt/ui',
        '@nuxtjs/google-fonts',
        '@nuxtjs/mdc',
        '@vueuse/nuxt'
    ],

    mdc: {
        highlight: {
            theme: 'material-theme-palenight',
            langs: [
                'html',
                'markdown',
                'vue',
                'typescript',
                'javascript',
            ],
        },
    },

    vite: {
        plugins: [tailwindcss()]
    }
});
