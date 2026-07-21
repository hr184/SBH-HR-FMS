import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'recharts',
      'date-fns'
    ]
  },
  server: {
    host: '0.0.0.0',
    port: 7878,
    strictPort: true
  },
  preview: {
    host: '0.0.0.0',
    port: 7878,
    strictPort: true
  }
});