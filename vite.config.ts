import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_URL || 'http://localhost:8000'
  const apiPrefix = env.VITE_API_PREFIX || '/api'

  return {
    plugins: [react(), basicSsl()],
    server: {
      proxy: {
        [apiPrefix]: {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
