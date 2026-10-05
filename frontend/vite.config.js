import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Serve built assets under /static/ so Django + WhiteNoise can serve them
  // in production (the React build is served by Django itself).
  base: '/static/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // In dev, forward API calls to the Django dev server.
      '/api': 'http://localhost:8000',
    },
  },
})
