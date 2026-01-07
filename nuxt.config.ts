// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/fonts'
  ],
  fonts: { 
    families: [  
      { name: 'Inter', provider: 'google' }, 
    ]
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
    apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://api1.goldcitycrm.com',
    siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://tr1.goldcitycrm.com'
    }
  },
  app: {
    // Cloudflare Flexible SSL için base URL
    baseURL: '/',
    cdnURL: process.env.NUXT_PUBLIC_SITE_URL || undefined,
    head: {
      title: 'Valdori CRM',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#1E40AF' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-chrome-192x192.png' },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/android-chrome-512x512.png' }
      ]
    }
  },
  imports: {
    dirs: ['stores', 'composables']
  },
  // Cloudflare için gerekli
  nitro: {
    preset: 'node-server'
  }
})
