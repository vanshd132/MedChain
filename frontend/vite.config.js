import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Make sure Vite listens on all network interfaces
    port: 5173,      // You can specify a different port if needed
  },
  build: {
    sourcemap: true, // Enable source map generation
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  }
})