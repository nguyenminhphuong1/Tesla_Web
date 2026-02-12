import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  root: '.',
  
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.mp4', '**/*.webm', '**/*.svg'],
  
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    allowedHosts: [
      '3f06a6eedb2d.ngrok-free.app'
    ],
      hmr: {
      overlay: true
    }
  },
  
  build: {
    outDir: 'build',
    sourcemap: true
  }
}); 