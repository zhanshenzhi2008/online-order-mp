import { defineStore } from 'pinia'

export const useStoreStore = defineStore('store', {
  state: () => ({
    currentStore: {
      id: 1,
      name: '深圳来福士广场店',
      isOpen: true,
      rating: 4.8,
      monthlySales: 2390,
      distance: 1.2,
      notice: '前方43份制作中',
      businessHours: '10:00-22:00',
      address: '深圳市福田区深南大道来福士广场',
      phone: '0755-1234567'
    }
  }),
  
  getters: {
    isStoreOpen: (state) => {
      if (!state.currentStore.isOpen) return false
      
      const now = new Date()
      const currentTime = now.getHours() * 100 + now.getMinutes()
      
      const [start, end] = state.currentStore.businessHours.split('-')
      const startTime = parseInt(start.replace(':', ''))
      const endTime = parseInt(end.replace(':', ''))
      
      return currentTime >= startTime && currentTime <= endTime
    }
  },
  
  actions: {
    updateStoreInfo(storeInfo) {
      this.currentStore = {
        ...this.currentStore,
        ...storeInfo
      }
    },
    
    toggleStoreStatus() {
      this.currentStore.isOpen = !this.currentStore.isOpen
    },
    
    async fetchStoreDetail() {
      try {
        // const res = await api.getStoreDetail(this.currentStore.id)
        // this.updateStoreInfo(res.data)
      } catch (error) {
        console.error('获取店铺信息失败:', error)
        uni.showToast({
          title: '获取店铺信息失败',
          icon: 'none'
        })
      }
    }
  }
}) 