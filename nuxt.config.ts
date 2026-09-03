// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from "@primeuix/themes/aura";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/base.css", "~/assets/css/components/button.css"],
  components: [
    { path: "~/components", pathPrefix: false },
  ],
  ssr: true,
  nitro: {
    hooks: {
      "rollup:before"(_nitro, rollupConfig) {
        if (!Array.isArray(rollupConfig.plugins)) {
          return;
        }

        rollupConfig.plugins = rollupConfig.plugins.filter((plugin) => {
          return (
            plugin &&
            typeof plugin === "object" &&
            "name" in plugin &&
            plugin.name !== "inject"
          );
        });
      },
    },
  },
  modules: [
    "@nuxt/eslint",
    "@primevue/nuxt-module",
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
