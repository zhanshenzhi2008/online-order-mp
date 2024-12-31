import { defineStore } from 'pinia'
import { ref } from 'vue'
import { shopApi } from '@/utils/api'

export const useShopStore = defineStore('shop', () => {
  const currentShop = ref(null)
  const shopList = ref([])

  // 获取门店列表
  const getShopList = async () => {
    try {
      const res = await shopApi.getShopList()
      if (res.code === 0) {
        shopList.value = res.data
        return res.data
      }
      return []
    } catch (error) {
      console.error('获取门店列表失败:', error)
      return []
    }
  }

  // 设置当前门店
  const setCurrentShop = (shop) => {
    currentShop.value = shop
  }

  // 获取门店详情
  const fetchShopDetail = async () => {
    if (currentShop.value) {
      return currentShop.value
    }
    try {
      const res = await shopApi.getCurrentShop()
      if (res.code === 0) {
        currentShop.value = res.data
        return res.data
      }
      return null
    } catch (error) {
      console.error('获取门店详情失败:', error)
      return null
    }
  }

  return {
    currentShop,
    shopList,
    getShopList,
    setCurrentShop,
    fetchShopDetail
  }
}) 