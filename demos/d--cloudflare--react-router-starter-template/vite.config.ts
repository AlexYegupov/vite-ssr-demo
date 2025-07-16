import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    cloudflare({ 
      viteEnvironment: { name: "ssr" }
    }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
  build: {
    sourcemap: true,
    minify: process.env.NODE_ENV === 'production',
    rollupOptions: {
      output: {
        sourcemapExcludeSources: false
      }
    }
  },
  // Enable sourcemaps for development
  css: {
    devSourcemap: true,
  },
  // Ensure sourcemaps work in development mode
  optimizeDeps: {
    esbuildOptions: {
      sourcemap: true
    }
  },
  server: {
    sourcemapIgnoreList: false
  }
});
