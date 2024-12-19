import request from '@/utils/request'

// 用户相关接口
export const userApi = {
  // 登录
  login: (data) => request({
    url: '/user/login',
    method: 'POST',
    data
  }),

  // 获取用户信息
  getUserInfo: () => request({
    url: '/user/info'
  }),

  // 更新用户信息
  updateUserInfo: (data) => request({
    url: '/user/update',
    method: 'POST',
    data
  })
} 