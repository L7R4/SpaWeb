import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import manifest from './public/manifest.json';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({
      manifest, // Usa el archivo separado
      registerType: 'autoUpdate',
      workbox: {
        navigateFallback: '/iniciar_sesion', // Página por defecto
      },
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png']
    }),
  ],
  server: {
    host: true, // Esto permite conexiones desde cualquier IP
    port: 4173, // Opcional: especifica un puerto
  },
  resolve: {
    alias: {
      'css': path.resolve(__dirname, './src/css'),
      'icons': path.resolve(__dirname, './src/assets/icons'),
      'fonts': path.resolve(__dirname, './src/assets/fonts'),
    },
  },
})
