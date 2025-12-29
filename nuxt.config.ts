// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['@/assets/css/tailwind.css'],
  modules: ['@nuxt/icon', '@nuxt/image', '@nuxtjs/tailwindcss'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  app: {
    baseURL: "/jairam-chatbot/"
  },
  runtimeConfig: {
    // Add your Google API key to an env var named GOOGLE_API_KEY
    // or put it here (do NOT commit your real key).
    googleApiKey: process.env.GOOGLE_API_KEY || ''
  }
})
