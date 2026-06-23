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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) return 'vendor-react';
          if (id.includes('node_modules/@tanstack/react-query')) return 'vendor-query';
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/clsx') || id.includes('node_modules/tailwind-merge') || id.includes('node_modules/class-variance-authority')) return 'vendor-ui';
          if (id.includes('node_modules/socket.io')) return 'vendor-socket';
          if (id.includes('node_modules/recharts')) return 'vendor-charts';
          if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/react-hot-toast')) return 'vendor-forms';
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
      registerType: 'autoUpdate',
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
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/tutors'),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'api-tutors', expiration: { maxEntries: 50, maxAgeSeconds: 60 * 30 } }
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/tuitions'),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'api-tuitions', expiration: { maxEntries: 50, maxAgeSeconds: 60 * 30 } }
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
