import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: { port: 8907 /* Should be unique */ },
  plugins: [react()],
  build: {
    minify: false,
    rollupOptions: {
      // https://rollupjs.org/configuration-options/
      output: {
        // chunking configuration
        // manualChunks: function(id) {
        //   console.log(`MC:`, id)
        //   if (id.includes('src/todos'))
        //     return 'todos'
        //   if (id.includes('src/lazy'))
        //     return 'lazy'
        // },
        manualChunks: {
          //vendor_react: ['react'],
          vendor_lodash: ['lodash'],
        }
      }
    }
  },
})
