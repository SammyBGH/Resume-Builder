import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ✅ Load environment variables
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default defineConfig({
  plugins: [react()],

  // ✅ Server config for local development
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: API_BASE_URL,
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: API_BASE_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // ✅ Build settings for deployment
  build: {
    outDir: 'dist',
    sourcemap: false,
  },

  // ✅ Optimize for Vercel static hosting
  preview: {
    port: 4173,
    strictPort: true,
  },
});
