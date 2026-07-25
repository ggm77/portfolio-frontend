import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  server: {
    // The production API sends no CORS headers, so proxy it during local dev to
    // keep requests same-origin. See API_BASE_URL in src/api/client.ts.
    proxy: {
      '/api': {
        target: 'https://seohamin.com',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: isSsrBuild
      ? undefined
      : {
          input: {
            main: resolve(__dirname, 'index.html'),
            admin: resolve(__dirname, 'admin/index.html'),
          },
        },
  },
}))
