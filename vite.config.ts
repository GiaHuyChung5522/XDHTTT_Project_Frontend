import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    
  },
  server: {
    proxy: {
      // ✅ Proxy tất cả API calls đến Backend (Backend có global prefix 'api')
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true
      },
      // ✅ Proxy các routes cụ thể để đảm bảo tương thích
      '/product': {
        target: 'http://localhost:3000/api',
        changeOrigin: true,
        secure: false,
        ws: true
      },
      '/products': {
        target: 'http://localhost:3000/api',
        changeOrigin: true,
        secure: false,
        ws: true
      },
      '/auth': {
        target: 'http://localhost:3000/api',
        changeOrigin: true,
        secure: false,
        ws: true
      },
      '/user': {
        target: 'http://localhost:3000/api',
        changeOrigin: true,
        secure: false,
        ws: true
      },
      '/order': {
        target: 'http://localhost:3000/api',
        changeOrigin: true,
        secure: false,
        ws: true
      },
      '/category': {
        target: 'http://localhost:3000/api',
        changeOrigin: true,
        secure: false,
        ws: true
      },
      '/dashboard': {
        target: 'http://localhost:3000/api',
        changeOrigin: true,
        secure: false,
        ws: true
      },
      '/payment': {
        target: 'http://localhost:3000/api',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
})
