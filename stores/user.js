import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userApi } from '@/utils/api'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  const settings = ref({
    orderNotification: true,
    promotionNotification: true,
    systemNotification: true,
    locationAccess: true
  })

  // 更新用户信息
  const updateUserInfo = (info) => {
    userInfo.value = info
  }

  // 获取用户设置
  const getSettings = async () => {
    try {
      const res = await userApi.getSettings()
      if (res.code === 0) {
        settings.value = { ...settings.value, ...res.data }
      }
      return settings.value
    } catch (error) {
      console.error('获取设置失败:', error)
      return settings.value
    }
  }

  // 更新用户设置
  const updateSettings = async (newSettings) => {
    try {
      const res = await userApi.updateSettings(newSettings)
      if (res.code === 0) {
        settings.value = { ...settings.value, ...newSettings }
        return true
      }
      throw new Error(res.message || '更新设置失败')
    } catch (error) {
      console.error('更新设置失败:', error)
      throw error
    }
  }

  return {
    userInfo,
    settings,
    updateUserInfo,
    getSettings,
    updateSettings
  }
}) 