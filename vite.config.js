// Cấu hình Vite cho dự án và test
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Sử dụng jsdom để mô phỏng trình duyệt
    environment: 'jsdom',
    // Tích hợp Jest DOM matcher
    setupFiles: ['./setupTests.js'],
    // Quét các file test có đuôi .test.js
    glob: ['**/*.test.js'],
  },
});