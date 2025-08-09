import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // nơi json-server đang chạy
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // bỏ /api khi gửi sang backend
      }
    }
  }
});
  