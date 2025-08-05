import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { join as pathJoin } from "path";

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
    reactRouter({
      // Force clean paths in build output
      build: {
        assetsDir: pathJoin(__dirname, 'assets'),
        outDir: pathJoin(__dirname, 'build')
      }
    }),
    tsconfigPaths(),
  ],
  build: {
    outDir: pathJoin(__dirname, 'build'),
    emptyOutDir: true,
    sourcemap: enableSourcemaps,
    minify: process.env.NODE_ENV === "production",
    rollupOptions: {
      output: {
        sourcemapExcludeSources: false,
        // Ensure consistent path handling
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
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
