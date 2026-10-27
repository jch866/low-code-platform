import { defineConfig } from 'vite'
// import { join } from 'path'
// import { writeFileSync } from 'fs'

// https://vitejs.dev/config/

import baseConfig from './vite.base.config'

export default defineConfig({
  ...baseConfig,
  build: {
    sourcemap: 'inline'
  },
  server: {
    port: 8000,
    open: true,
    host: true
  },
  base: `/`
})
