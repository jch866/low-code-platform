import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import markdown from 'vite-plugin-md'
import { viteStaticCopy } from 'vite-plugin-static-copy'
// import { join } from 'path'
// import { writeFileSync } from 'fs'

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
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      all: true,
      include: ['package/**', 'src/**'],
      exclude: [
        'coverage/**',
        'dist/**',
        'package/*/docs/**',
        'package/*/test{,s}/**',
        '**/*.d.ts',
        'cypress/**',
        'test{,s}/**',
        'test{,-*}.{js,cjs,mjs,ts,tsx,jsx}',
        '**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx}',
        '**/*{.,-}spec.{js,cjs,mjs,ts,tsx,jsx}',
        '**/__tests__/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
        '**/.{eslint,mocha,prettier}rc.{js,cjs,yml}'
      ],
      extension: ['js', 'vue']
    },
    transformMode: {
      web: [/\.[jt]sx$/]
    }
  },
  build: {
    sourcemap: 'inline'
  },
  css: {
    postcss: './postcss.config.js'
  },
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    markdown(),
    ...plugins
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@package': fileURLToPath(new URL('./package', import.meta.url))
    }
  },
  server: {
    port: 8000,
    open: true,
    host: true
  },
  base: `/`
})
