import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
// import { join } from 'path'
// import { writeFileSync } from 'fs'

// https://vitejs.dev/config/
import baseConfig from './vite.base.config'
import { resolve } from 'path'

const plugins =
  process.env.NODE_ENV === 'production'
    ? [
        viteStaticCopy({
          targets: [
            {
              src: 'package/**/src/**/*',
              dest: 'package'
            }
          ],
          flatten: false
        })
      ]
    : []

export default defineConfig({
  ...baseConfig,
  publicDir: false,
  build: {
    outDir: 'dist/lib',
    lib: {
      entry: resolve(__dirname, '../package/build.js'),
      name: 'index',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  plugins: [...baseConfig.plugins, ...plugins]
})
