import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStoreStore = defineStore('store', () => {
  const currentStore = ref({
    name: '淄博烧烤店',
    rating: 4.8,
    monthlySales: 999,
    distance: 0.5,
    notice: '欢迎光临，本店特色烧烤，欢迎品尝！'
  })

  // 获取店铺详情
  const fetchStoreDetail = async () => {
    // TODO: 从后端获取店铺详情
    return currentStore.value
  }

  return {
    currentStore,
    fetchStoreDetail
  }
}) 