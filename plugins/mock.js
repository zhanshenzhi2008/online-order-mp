// Mock 插件
export const mockPlugin = (mockApis) => {
  return {
    name: 'vite-plugin-mock',
    configureServer({ middlewares }) {
      middlewares.use(async (req, res, next) => {
        // 跳过非 API 请求
        if (!req.url.startsWith('/api/')) {
          return next()
        }

        const url = new URL(req.url, `http://${req.headers.host}`)
        const path = url.pathname.replace('/api', '') // 移除 /api/ 前缀
        const method = req.method

        // 解析请求体
        let body = ''
        req.on('data', chunk => {
          body += chunk
        })

        await new Promise((resolve) => {
          req.on('end', () => {
            try {
              // 遍历所有 mock 接口定义
              for (const api of Object.values(mockApis)) {
                if (Array.isArray(api)) {
                  for (const item of api) {
                    const [itemMethod, itemPath] = Object.keys(item)[0].split(' ')
                    const apiPath = itemPath.slice(1) // 移除开头的 /
                    
                    if (path === apiPath && method === itemMethod) {
                      const handler = item[`${itemMethod} ${itemPath}`]
                      const params = method === 'GET'
                        ? Object.fromEntries(url.searchParams)
                        : body ? JSON.parse(body) : {}

                      try {
                        const result = handler(params)
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify(result))
                        return
                      } catch (error) {
                        console.error(`[Mock] API error: ${path}`, error)
                        res.statusCode = 500
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify({
                          code: 1,
                          message: error.message || '接口错误'
                        }))
                        return
                      }
                    }
                  }
                }
              }

              // 没有找到匹配的接口
              console.warn(`[Mock] API not found: ${method} ${path}`)
              res.statusCode = 404
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                code: 1,
                message: `API not found: ${method} ${path}`
              }))
            } catch (error) {
              console.error('[Mock] Server error:', error)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                code: 1,
                message: error.message || '服务器错误'
              }))
            }
            resolve()
          })
        })
      })
    }
  }
} 