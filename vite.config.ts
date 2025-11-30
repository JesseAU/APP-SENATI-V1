import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Esto permite acceder desde tu celular si están en la misma red Wi-Fi
    port: 3000,
    open: true // Abre el navegador automáticamente
  }
})