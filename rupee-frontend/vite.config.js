import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL
 console.log(apiUrl)
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target:'http://192.168.2.186:3001/',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})