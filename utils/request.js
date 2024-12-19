// 封装请求方法

// 使用环境变量配置
const baseURL = import.meta.env.VITE_APP_BASE_API || '/api'

// 请求拦截器
const requestInterceptor = (config) => {
  const token = uni.getStorageSync('token')
  if (token) {
    config.header = {
      ...config.header,
      'Authorization': `Bearer ${token}`
    }
  }
  return config
}

// 响应拦截器
const responseInterceptor = (response) => {
	
  if (response.statusCode === 401) {
    // 清除token
    uni.removeStorageSync('token')
    uni.showModal({
      title: '提示',
      content: '登录已过期，请重新登录',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({
            url: '/pages/login/login'
          })
        }
      }
    })
    return Promise.reject(new Error('Unauthorized'))
  }
  return response.data
}

// 统一请求方法
const request = (options) => {
  // 处理请求配置
  const config = requestInterceptor(options)
  
  // 发起请求
  return new Promise((resolve, reject) => {
    uni.request({
      url: baseURL + config.url,
      method: config.method || 'GET',
      data: config.data,
      header: config.header,
      success: (res) => {
        resolve(responseInterceptor(res))
      },
      fail: (err) => {
        uni.showToast({
          title: '网络错误',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

export default request 