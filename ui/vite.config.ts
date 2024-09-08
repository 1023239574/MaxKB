import { fileURLToPath, URL } from 'node:url'
import type { ProxyOptions } from 'vite'
import { defineConfig, loadEnv } from 'vite'

import vue from '@vitejs/plugin-vue'
import DefineOptions from 'unplugin-vue-define-options/vite'

const envDir = './env'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const ENV = loadEnv(mode, envDir)
  const proxyConf: Record<string, string | ProxyOptions> = {}
  proxyConf['/api'] = {
    target: 'http://127.0.0.1:8080',
    changeOrigin: true,
    rewrite: (path) => path.replace(ENV.VITE_BASE_PATH, '/')
  }
  return {
    preflight: false,
    lintOnSave: false,
    base: ENV.VITE_BASE_PATH,
    envDir: envDir,
    plugins: [vue(), DefineOptions()],
    server: {
      cors: true,
      host: '0.0.0.0',
      port: Number(ENV.VITE_APP_PORT),
      strictPort: true,
      // proxy: proxyConf
      proxy: {
        // [VITE_API_URL_PREFIX]: 'http://127.0.0.1:3000/',
        '/test': {
          target: 'https://172.26.10.15:9093', // 目标服务器地址
          changeOrigin: true, // 是否改变请求源
          secure: false,
          rewrite: (path: any) => path.replace(/^\/test/, ''), // 重写路径
        },
      },
    },
    build: {
      outDir: 'dist/ui'
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
