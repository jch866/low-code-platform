import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { join } from 'path'
import { writeFileSync } from 'fs'

// 当前配置文件域名
const mngYapi = 'http://192.168.70.210' // yapi
const mngDev = 'http://gp-common-dev.eigpay.com' // dev
const mngSit = 'http://gp-common-sit.eigpay.com' // sit
const environment = 'dev' // dev
let mng = ''
if (environment === 'yapi') {
  mng = mngYapi
} else if (environment === 'dev') {
  mng = mngDev
} else if (environment === 'sit') {
  mng = mngSit
}

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: 'jsdom', // Chrome 调试浏览器
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      all: true,
      include: ['package/**', 'src/**'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/cypress/**',
        '**/.{idea,git,cache,output,temp}/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
        '@eigpay/com/**',
        '**/test/**'
      ],
      extension: ['js', 'vue']
    },
    exclude: [
      '**/cypress/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      '@eigpay/com/**',
      '**/test/**'
    ],
    transformMode: {
      web: [/\.[jt]sx$/]
    }
  },
  css: {
    postcss: './postcss.config.js',
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/assets/base.scss" as *;'
      }
    }
  },
  plugins: [
    vue(),
    (function () {
      let basePath = ''
      return {
        name: 'vite:micro-app',
        apply: 'build',
        configResolved(config) {
          basePath = `${config.base}${config.build.assetsDir}/`
        },
        // writeBundle 钩子可以拿到完整处理后的文件，但已经无法修改
        writeBundle(options, bundle) {
          for (const chunkName in bundle) {
            if (Object.prototype.hasOwnProperty.call(bundle, chunkName)) {
              const chunk = bundle[chunkName]
              if (chunk.fileName && chunk.fileName.endsWith('.js')) {
                chunk.code = chunk.code.replace(
                  /(from|import\()(\s*['"])(\.\.?\/)/g,
                  (all, $1, $2, $3) => {
                    return all.replace($3, $3, './')
                  }
                )
                const fullPath = join(options.dir, chunk.fileName)
                writeFileSync(fullPath, chunk.code)
              }
            }
          }
        }
      }
    })()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@package': '@eigpay/components'
    },
    dedupe: ['vue']
  },
  server: {
    port: 8100, // listen port 8100
    open: true, // auto open while server started
    host: true,
    proxy: {
      // '/mock': {
      //   target: `${mng}`,
      //   logLevel: 'debug',
      //   changeOrigin: true
      // }
      '/pay-admin-boot': {
        target: 'http://frogdev.eigpay.com',
        logLevel: 'debug',
        changeOrigin: true
      }
    }
  },
  output: {
    // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
    globals: {
      vue: 'Vue'
    }
  },
  external: ['vue'],
  base: `/low-code-platform/`
})
