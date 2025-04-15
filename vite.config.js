import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    host: '127.0.0.1', // pastikan aksesnya dari IP yang sama
    port: 5173,         // atau ganti ke port lain kalau bentrok
    hmr: {
      protocol: 'ws',
      host: '127.0.0.1',
      port: 5173,
    }
  }
})
