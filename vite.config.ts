import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const alertsApiTarget =
    env.VITE_ALERTS_API_TARGET ?? 'https://live-data-1015949672422.europe-west1.run.app/'

  return {
    plugins: [
      react(),
      basicSsl()
    ],
    server: {
      proxy: {
        '/alerts-api': {
          target: alertsApiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/alerts-api/, ''),
        },
        '/live': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
        '/socket.io': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
  }
})
