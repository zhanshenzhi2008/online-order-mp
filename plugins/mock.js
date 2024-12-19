import { mockApi } from '../mock'

export function mockPlugin() {
  return {
    name: 'vite:mock',
    configureServer(server) {
      console.log('Mock plugin enabled')
      console.log('Available mock APIs:', Object.keys(mockApi))
      
      server.middlewares.use((req, res, next) => {
        console.log(`[Mock] Received request: ${req.method} ${req.url}`)
        
        if (req.url.includes('/@fs/') || 
            req.url.includes('/@id/') || 
            req.url.includes('/@vite/')) {
          return next()
        }
        
        if (req.url.endsWith('.js') || req.url.endsWith('.ts')) {
          console.log('[Mock] Module request, skipping')
          return next()
        }
        
        if (req.url.includes('.') && !req.url.endsWith('.json')) {
          console.log('[Mock] Static file request, skipping')
          return next()
        }
        
        if (!req.url.startsWith('/api/')) {
          console.log('[Mock] Not an API request, skipping')
          return next()
        }

        const urlWithoutQuery = req.url.split('?')[0]
        const path = urlWithoutQuery.replace(/^\/api\//, '')
        
        console.log(`[Mock] Processing API request: ${req.method} ${path}`)

        const mockFn = mockApi[path]

        if (!mockFn) {
          console.warn(`[Mock] API not found: ${path}`)
          console.warn('Available APIs:', Object.keys(mockApi))
          res.statusCode = 404
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            code: 1,
            message: `API not implemented: ${path}`
          }))
          return
        }

        console.log(`[Mock] Found mock handler for: ${path}`)

        let body = ''
        req.on('data', chunk => {
          body += chunk
        })

        req.on('end', () => {
          let data = {}
          
          if (body) {
            try {
              data = JSON.parse(body)
              console.log(`[Mock] Request body:`, data)
            } catch (e) {
              console.error('[Mock] Failed to parse request body:', e)
            }
          }

          const queryString = req.url.split('?')[1]
          if (queryString) {
            const queryParams = queryString.split('&').reduce((params, param) => {
              const [key, value] = param.split('=')
              params[key] = decodeURIComponent(value)
              return params
            }, {})
            data = { ...data, ...queryParams }
            console.log(`[Mock] Query parameters:`, queryParams)
          }

          try {
            console.log(`[Mock] Executing handler for ${path}`)
            const response = mockFn(data)
            console.log(`[Mock] Response for ${path}:`, response)
            
            setTimeout(() => {
              res.setHeader('Content-Type', 'application/json')
              res.setHeader('Mock-Data', 'true')
              res.end(JSON.stringify(response))
              console.log(`[Mock] Response sent for ${path}`)
            }, 300)
          } catch (error) {
            console.error('[Mock] API error:', error)
            console.error(error.stack)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({
              code: 1,
              message: error.message || '接口错误',
              path: path,
              error: error.stack
            }))
          }
        })

        req.on('error', (error) => {
          console.error('[Mock] Request error:', error)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            code: 1,
            message: 'Request error',
            error: error.message
          }))
        })
      })
    }
  }
} 