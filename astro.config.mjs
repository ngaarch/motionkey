// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://zelora-unlock.vercel.app",
  output: "static",
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  adapter: vercel({ webAnalytics: { enabled: false } }),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
