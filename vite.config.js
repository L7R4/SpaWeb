import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'css': path.resolve(__dirname, './src/css'),
      'icons': path.resolve(__dirname, './src/assets/icons'),
      'fonts': path.resolve(__dirname, './src/assets/fonts'),
    },
  },
})
