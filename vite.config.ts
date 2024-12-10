import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import sass from 'sass-embedded';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        implementation: sass,
        api: 'modern-compiler'
      }
    }
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src')
    }
  }
});