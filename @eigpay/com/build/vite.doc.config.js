import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
// import { join } from 'path'
// import { writeFileSync } from 'fs'

import baseConfig from './vite.base.config'

// https://vitejs.dev/config/

const plugins =
  process.env.NODE_ENV === 'production'
    ? [
        viteStaticCopy({
          targets: [
            {
              src: 'package/**/docs/**/*.vue',
              dest: 'package'
            }
          ],
          flatten: false
        })
      ]
    : []

export default defineConfig({
  ...baseConfig,
  build: {
    sourcemap: 'inline',
    outDir: 'dist/doc'
  },
  plugins: [...baseConfig.plugins, ...plugins]
})
