import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // alias: {
    //   '@app': path.resolve(__dirname, 'src/pages'),
    // },
  },
  server: {
    proxy: {
      // Intercept API calls to `/api` and forward them to the actual backend
      '/api/v1': {
        target:"http://192.168.3.193:3001/",
        changeOrigin: true,
        secure: false
        
      },
    },
  },
})
