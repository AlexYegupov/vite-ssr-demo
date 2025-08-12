import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Determine whether to generate sourcemaps based on environment
// In development, always generate sourcemaps
// In production, use SOURCEMAPS_GENERATE_PROD env variable
const enableSourcemaps =
  process.env.NODE_ENV !== "production" ||
  process.env.SOURCEMAPS_GENERATE_PROD === "true";

export default defineConfig({
  plugins: [
    cloudflare({
      viteEnvironment: { name: "ssr" },
    }),
    reactRouter(),
    tsconfigPaths(),
  ],
  build: {
    sourcemap: enableSourcemaps,
    minify: process.env.NODE_ENV === "production",
    rollupOptions: {
      output: {
        sourcemapExcludeSources: false,
      },
    },
  },
  css: {
    devSourcemap: enableSourcemaps,
  },
  optimizeDeps: {
    esbuildOptions: {
      sourcemap: enableSourcemaps,
    },
  },
  server: {
    // In development, always include sourcemaps
    sourcemapIgnoreList: false,
  },
});
