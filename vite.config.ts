import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
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
