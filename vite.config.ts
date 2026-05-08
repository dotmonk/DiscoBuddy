import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/DiscoBuddy/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'DiscoBuddy',
        short_name: 'DiscoBuddy',
        description: 'Audio visualization that reacts to your microphone',
        theme_color: '#0a0a0f',
        background_color: '#0a0a0f',
        display: 'fullscreen',
        orientation: 'landscape',
        start_url: '/DiscoBuddy/',
        scope: '/DiscoBuddy/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      }
    })
  ],
  build: {
    outDir: 'dist',
    target: 'es2020'
  }
});
