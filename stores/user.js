import { defineStore } from 'pinia'
import { userApi } from '@/utils/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: uni.getStorageSync('token') || '',
    userInfo: null,
    loading: false,
    error: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token
  },

  actions: {
    setToken(token) {
      this.token = token
      if (token) {
        uni.setStorageSync('token', token)
      } else {
        uni.removeStorageSync('token')
      }
    },

    async login(data) {
      this.loading = true
      this.error = null
      try {
        const res = await userApi.login(data)
        if (res.code === 0) {
          this.setToken(res.data.token)
          this.userInfo = res.data
          return { success: true }
        } else {
          throw new Error(res.message || '登录失败')
        }
      } catch (error) {
        this.error = error.message
        return {
          success: false,
          message: error.message
        }
      } finally {
        this.loading = false
      }
    },

    async getUserInfo() {
      if (!this.token) return
      
      this.loading = true
      this.error = null
      try {
        const res = await userApi.getUserInfo()
        if (res.code === 0) {
          this.userInfo = res.data
          return { success: true }
        } else {
          throw new Error(res.message || '获取用户信息失败')
        }
      } catch (error) {
        this.error = error.message
        if (error.message.includes('401')) {
          this.logout()
        }
        return {
          success: false,
          message: error.message
        }
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.setToken('')
      this.userInfo = null
      uni.reLaunch({
        url: '/pages/login/login'
      })
    }
  }
}) 