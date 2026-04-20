// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from "@primeuix/themes/aura";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/components/button.css"],
  ssr: true,
  modules: [
    "@primevue/nuxt-module",

    "@nuxt/content",
    "@pinia/nuxt",
    "@nuxt/icon",
    "@nuxtjs/tailwindcss",
  ],
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
  },
});