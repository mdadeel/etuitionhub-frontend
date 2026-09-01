import path from "path"
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { VitePWA } from 'vite-plugin-pwa'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // ponytail: pages are already lazy-loaded; let Vite split components naturally
          if (id.includes('pages/AiAssistant')) return 'ai-assistant';
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) return 'vendor-react';
          if (id.includes('node_modules/@tanstack/react-query')) return 'vendor-query';
          if (id.includes('node_modules/lucide-react')) return 'vendor-icons';
          if (id.includes('node_modules/clsx') || id.includes('node_modules/tailwind-merge') || id.includes('node_modules/class-variance-authority') || id.includes('node_modules/zustand')) return 'vendor-utils';
          if (id.includes('node_modules/socket.io')) return 'vendor-socket';
          if (id.includes('node_modules/simple-peer') || id.includes('node_modules/wrtc')) return 'vendor-webrtc';
          if (id.includes('node_modules/recharts')) return 'vendor-charts';
          if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/react-hot-toast')) return 'vendor-forms';
          if (id.includes('node_modules/firebase')) return 'vendor-firebase';
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) return 'vendor-i18n';
        },
      },
    },
  },
  plugins: [
    react(),
    nodePolyfills({
      include: ['util', 'process', 'buffer', 'events'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'e-tuitionBD',
        short_name: 'e-tuitionBD',
        description: 'Connect with top-rated tutors across Bangladesh.',
        theme_color: '#2563EB',
        background_color: '#F5F7FA',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // ponytail: app-shell-only precache — 453 lazy JS chunks (13MB) must not
        // download on every fresh visit (BD low-bandwidth mandate); browser HTTP
        // cache handles repeat loads. No /api runtime caching: StaleWhileRevalidate
        // served stale lists after mutations and cached PII-bearing authed responses.
        globPatterns: ['index.html', 'assets/*.css', 'manifest.webmanifest', 'favicon.ico', 'pwa-192x192.png', 'pwa-512x512.png'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
