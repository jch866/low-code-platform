import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import markdown from 'vite-plugin-md'
// import { join } from 'path'
// import { writeFileSync } from 'fs'

// https://vitejs.dev/config/

export default defineConfig({
  css: {
    postcss: './postcss.config.js'
  },
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    markdown()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('../src', import.meta.url)),
      '@package': fileURLToPath(new URL('../package', import.meta.url))
    }
  }
})
