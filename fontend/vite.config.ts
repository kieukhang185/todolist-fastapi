// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    /// for dev
    // proxy: {
    //   '/api': 'http://localhost:8000',
    //   '/auth': 'http://localhost:8001',
    // }
  },
  build: {
    outDir: 'dist',
  }
});
