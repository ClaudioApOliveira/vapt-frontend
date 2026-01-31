// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: ['@nuxtjs/tailwindcss'],

  css: ['~/assets/css/main.css'],
  
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || ''
    }
  },

  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:8080/api',
        changeOrigin: true
      }
    }
  },

  routeRules: {
    '/api/**': {
      proxy: process.env.NUXT_PUBLIC_API_BASE 
        ? `${process.env.NUXT_PUBLIC_API_BASE}/api/**` 
        : 'http://localhost:8080/api/**'
    }
  }
})
