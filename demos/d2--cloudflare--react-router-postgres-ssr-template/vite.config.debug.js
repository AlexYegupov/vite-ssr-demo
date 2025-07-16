import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [cloudflare({ viteEnvironment: { name: "ssr" } }), reactRouter()],
  build: {
    sourcemap: true, // Всегда генерировать sourcemaps
  },
  server: {
    sourcemapIgnoreList: false, // Не игнорировать никакие файлы при генерации sourcemaps
  },
});
