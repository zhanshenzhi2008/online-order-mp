import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrderStore = defineStore('order', () => {
  const cartList = ref([])
  const currentOrder = ref(null) // 添加当前订单状态

  // 获取订单列表
  const getOrderList = async () => {
    // TODO: 这里替换为实际的 API 调用
    // 目前使用模拟数据
    return [
      {
        id: 1,
        orderNo: 'ORDER2024001',
        status: '制作中',
        totalAmount: 99.00,
        createTime: '2024-03-20 14:30:00',
        goods: [{
          id: 1,
          name: '烤羊肉串',
          price: 3.00,
          quantity: 10,
          image: '/static/images/goods/yangrou.png'
        }]
      }
    ]
  }

  // 设置当前订单
  const setCurrentOrder = (order) => {
    currentOrder.value = order
  }

  // 清除当前订单
  const clearCurrentOrder = () => {
    currentOrder.value = null
  }

  return {
    cartList,
    currentOrder,
    getOrderList,
    setCurrentOrder,
    clearCurrentOrder
  }
}) 