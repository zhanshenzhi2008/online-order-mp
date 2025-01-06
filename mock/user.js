// 用户数据
export const users = [
  {
    id: '1',
    nickname: '张三',
    avatar: '/static/images/avatar.png',
    phone: '13800138000',
    settings: {
      orderNotification: true,
      promotionNotification: true,
      systemNotification: true,
      locationAccess: true
    }
  }
]

// 用户相关接口
export const userApi = {
  // 用户登录
  'POST /user/login': (data) => {
    const { phone, code } = data
    // 模拟验证码检查
    if (code !== '123456') {
      return { code: 1, message: '验证码错误' }
    }
    let user = users.find(u => u.phone === phone)
    if (!user) {
      user = {
        id: Date.now().toString(),
        phone,
        nickname: `用户${phone.slice(-4)}`,
        avatar: '/static/images/avatar.png',
        settings: {
          orderNotification: true,
          promotionNotification: true,
          systemNotification: true,
          locationAccess: true
        }
      }
      users.push(user)
    }
    return { code: 0, data: user }
  },

  // 获取用户信息
  'GET /user/info': () => {
    return { code: 0, data: users[0] }
  },

  // 更新用户信息
  'POST /user/update': (data) => {
    const user = users[0]
    Object.assign(user, data)
    return { code: 0, data: user }
  },

  // 获取用户设置
  'GET /user/settings': () => {
    return {
      code: 0,
      data: users[0].settings
    }
  },

  // 更新用户设置
  'POST /user/settings/update': (data) => {
    const user = users[0]
    user.settings = {
      ...user.settings,
      ...data
    }
    return {
      code: 0,
      data: user.settings
    }
  }
} 