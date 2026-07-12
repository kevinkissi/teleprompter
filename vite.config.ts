import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the app also works when hosted from a sub-path (e.g. GitHub Pages).
  base: './',
  plugins: [
    react(),
    VitePWA({
      // 'prompt' (not 'autoUpdate'): a new build is precached in the background but the
      // new service worker WAITS — it never force-reloads the page, so an update can't
      // interrupt a live prompting session or reset the scroll position. The update
      // activates on the next natural app launch.
      registerType: 'prompt',
      // The app shell + all built assets are precached so the app is fully usable offline.
      includeAssets: ['icons/apple-touch-icon.png', 'icons/favicon.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // Never let the network block the reading screen. If offline, serve cached shell.
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'Teleprompter',
        short_name: 'Prompter',
        description:
          'Offline teleprompter with mirroring, rotation, and smooth WPM-based auto-scroll.',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'any',
        start_url: './',
        scope: './',
        categories: ['productivity', 'utilities'],
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
})
