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
  }),

  // 上传头像
  uploadAvatar(filePath) {
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: request.baseURL + '/user/upload/avatar',
        filePath: filePath,
        name: 'file',
        success: (uploadRes) => {
          const res = JSON.parse(uploadRes.data)
          resolve(res)
        },
        fail: (error) => {
          reject(error)
        }
      })
    })
  },

  // 获取用户设置
  getSettings: () => request({
    url: '/user/settings'
  }),

  // 更新用户设置
  updateSettings: (data) => request({
    url: '/user/settings/update',
    method: 'POST',
    data
  })
} 