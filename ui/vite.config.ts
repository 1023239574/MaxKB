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
  proxyConf['/dev'] = {
    target: 'http://127.0.0.1:8080/',
    changeOrigin: true,
    /* bypass(req, res, options) {
      const proxyURL = options.target + options.rewrite(req.url)
      console.log('proxyURL', proxyURL)
      req.headers['x-req-proxyURL'] = proxyURL // 设置未生效
      res.setHeader('x-req-proxyURL', proxyURL) // 设置响应头可以看到
    }, */
    rewrite: (path) => path.replace(/^\/dev/, ''),
    //rewrite: (path) => path.replace(ENV.VITE_BASE_PATH, '/damage_gpu/')
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
      proxy: proxyConf
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
