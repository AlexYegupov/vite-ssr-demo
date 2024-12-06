import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    hmr: {
      port: 8851, // https://github.com/vitejs/vite/issues/14328#issuecomment-1897675256
    },
    port: 8907 /* Should be unique */
  },
  plugins: [react()],
  build: {
    //minify: false,
    rollupOptions: {
      // https://rollupjs.org/configuration-options/
      output: {
        // chunking configuration
        manualChunks: function(id) {
          console.log(`MC:`, id)
          if (id.includes('src/todos')) return 'todos'
          if (id.includes('src/lazy')) return 'lazy'
          if (id.includes('src/test2')) return 'test2'
          if (id.includes('src/test-lazy-component')) return 'test-lazy-component'
          if (id.includes('src/test')) return 'test'

          const vendorMatch = id.match(/node_modules\/([^/]+)\//);
          if (vendorMatch) return `-${vendorMatch[1]}`;
        },
        /* manualChunks: {
         *   //vendor_react: ['react'],
         *   vendor_lodash: ['lodash'],
         *   //test_module: ['/src/test'],
         *   //lazy_module: ['/src/lazy']
         * }, */
        // filename configuration
        /* entryFileNames: `assets/[name].js`,
         * chunkFileNames: `assets/[name].js`,
         * assetFileNames: `assets/[name].[ext]`, */
      }
    },
  },

})
