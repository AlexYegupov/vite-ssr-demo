import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Загрузка переменных окружения
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    server: {
      hmr: {
        port: 8851, // https://github.com/vitejs/vite/issues/14328#issuecomment-1897675256
      },
      //? host: env.VITE_HOST,
      //? port: env.VITE_PORT
    },
    preview: {
      //? host: env.VITE_HOST,
      //? port: env.VITE_PORT
    },
    plugins: [react()],
    build: {
      // outDir: 'dist',
      minify: env.VITE_MINIMIZE,
      rollupOptions: {
        // Ваши настройки rollup
      }
    }
  };
});
