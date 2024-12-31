import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMenuStore = defineStore('menu', () => {
  const deliveryType = ref('selfPickup') // 默认自提

  // 设置配送方式
  const setDeliveryType = (type) => {
    if (type && type !== deliveryType.value) {
      deliveryType.value = type
    }
  }

  return {
    deliveryType,
    setDeliveryType
  }
}) 