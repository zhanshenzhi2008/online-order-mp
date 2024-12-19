// 用户数据
export const users = [
  {
    id: '1',
    phone: '13800138000',
    password: '123456',
    nickname: '张三',
    avatar: '/static/avatar/user1.png',
    gender: 1,
    birthday: '1990-01-01',
    token: 'mock-token-1'
  }
]

// 用户相关接口
export const userApi = {
  // 登录
  'user/login': (data) => {
    const user = users.find(u => u.phone === data.phone && u.password === data.password)
    if (user) {
      return { code: 0, data: { ...user, token: user.token }, message: '登录成功' }
    }
    return { code: 1, message: '手机号或密码错误' }
  },

  // 注册
  'user/register': (data) => {
    const existUser = users.find(u => u.phone === data.phone)
    if (existUser) {
      return { code: 1, message: '手机号已注册' }
    }
    
    const newUser = {
      id: Date.now().toString(),
      phone: data.phone,
      password: data.password,
      nickname: data.nickname || `用户${data.phone.slice(-4)}`,
      avatar: '/static/avatar/default.png',
      gender: 0,
      birthday: '',
      token: `mock-token-${Date.now()}`
    }
    users.push(newUser)
    return { code: 0, data: { ...newUser, token: newUser.token }, message: '注册成功' }
  },

  // 获取用户信息
  'user/info': () => ({
    code: 0,
    data: users[0]
  }),

  // 更新用户信息
  'user/update': (data) => {
    const user = users.find(u => u.id === data.id)
    if (user) {
      Object.assign(user, data)
      return { code: 0, data: user, message: '更新成功' }
    }
    return { code: 1, message: '用户不存在' }
  }
} 