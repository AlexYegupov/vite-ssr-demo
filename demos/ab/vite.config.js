import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    hmr: {
      port: 3005, // https://github.com/vitejs/vite/issues/14328#issuecomment-1897675256
    },
    port: 8907 /* Should be unique */
  },
  plugins: [react()],
  build: {
    minify: false,
  },
})
