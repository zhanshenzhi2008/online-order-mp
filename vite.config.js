import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'
import { mockPlugin } from './plugins/mock'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  process.env.VITE_APP_MOCK = process.env.VITE_APP_MOCK || 'true'
  const env = loadEnv(mode, process.cwd(), '')
  const useMock = env.VITE_APP_MOCK === 'true'
  
  // 在配置之前打印状态
  console.log('\n=== Mock Configuration ===')
  console.log('Mode:', mode)
  console.log('Mock enabled:', useMock)
  console.log('VITE_APP_MOCK:', env.VITE_APP_MOCK)
  console.log('========================\n')
  
  return {
    plugins: [
      uni(),
      useMock && {
        ...mockPlugin(),
        enforce: 'pre'
      }
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.')
      }
    },
    server: {
      port: 8080,
      host: true,
      proxy: useMock ? {} : {
        '/api': {
          target: 'http://127.0.0.1:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
}) 