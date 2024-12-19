import { defineStore } from 'pinia'

export const useDeliveryStore = defineStore('delivery', {
  state: () => ({
    mode: 'takeout', // 配送方式：takeout-外送，pickup-自提
    address: null, // 配送地址
    store: null, // 自提门店
    deliveryFee: 0, // 配送费
    minOrderAmount: 20, // 起送价
    estimatedTime: 30, // 预计送达/取餐时间（分钟）
    baseDeliveryTime: 20, // 基础配送时间
    basePreparationTime: 15, // 基础出餐时间
    distanceTime: 10, // 距离增加时间
  }),

  getters: {
    // 是否为外送模式
    isTakeout: (state) => state.mode === 'takeout',
    
    // 是否为自提模式
    isPickup: (state) => state.mode === 'pickup',
    
    // 是否满足起送价
    isReachMinAmount: (state) => (cartAmount) => {
      return cartAmount >= state.minOrderAmount
    },
    
    // 获取配送方式文本
    modeText: (state) => {
      return state.mode === 'takeout' ? '外送' : '自提'
    },
    
    // 获取预计时间文本
    estimatedTimeText: (state) => {
      if (state.mode === 'takeout') {
        return `约${state.estimatedTime}分钟送达`
      } else {
        return '提前下单门店自提'
      }
    }
  },

  actions: {
    // 切换配送方式
    setMode(mode) {
      this.mode = mode
      // 根据配送方式更新相关配置
      if (mode === 'takeout') {
        this.deliveryFee = 5
        this.minOrderAmount = 20
        this.calculateEstimatedTime()
      } else {
        this.deliveryFee = 0
        this.minOrderAmount = 0
        this.estimatedTime = this.basePreparationTime
      }
    },

    // 设置配送地址
    setAddress(address) {
      this.address = address
      // 根据地址重新计算配送费和预计送达时间
      this.calculateDeliveryFee()
      this.calculateEstimatedTime()
    },

    // 设置自提门店
    setStore(store) {
      this.store = store
      if (this.mode === 'pickup') {
        this.estimatedTime = this.basePreparationTime
      }
    },

    // 计算配送费
    calculateDeliveryFee() {
      if (!this.address || this.mode !== 'takeout') {
        this.deliveryFee = 0
        return
      }
      // 这里可以根据地址距离等计算配送费
      // 示例：基础配送费 + 距离费用
      const baseFee = 5
      const distanceFee = 0 // 可以根据实际距离计算
      this.deliveryFee = baseFee + distanceFee
    },

    // 计算预计送达/取餐时间
    calculateEstimatedTime() {
      if (this.mode === 'takeout') {
        // 外送模式：基础出餐时间 + 基础配送时间 + 距离时间
        this.estimatedTime = this.basePreparationTime + this.baseDeliveryTime
        
        if (this.address) {
          // 如果有地址，可以根据距离增加配送时间
          // 这里可以添加实际的距离计算逻辑
          this.estimatedTime += this.distanceTime
        }
      } else {
        // 自提模式：固定出餐时间
        this.estimatedTime = this.basePreparationTime
      }
    },

    // 重置状态
    reset() {
      this.mode = 'takeout'
      this.address = null
      this.store = null
      this.deliveryFee = 0
      this.minOrderAmount = 20
      this.estimatedTime = this.basePreparationTime + this.baseDeliveryTime
    }
  }
}) 