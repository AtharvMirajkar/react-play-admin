import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    host: true, // Allow external access (needed on Render)
    port: 3000, // Optional: Render sets PORT via env, Vite will respect $PORT during preview
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
