import { defineStore } from 'pinia'
import { ref } from 'vue'
import { orderApi } from '@/utils/api'

export const useOrderStore = defineStore('order', () => {
  const currentOrder = ref(null)
  const orderList = ref([])

  // 创建订单
  const createOrder = async (orderData) => {
    try {
      const res = await orderApi.createOrder(orderData)
      if (res.code === 0) {
        currentOrder.value = res.data
        return {
          success: true,
          data: res.data
        }
      }
      return {
        success: false,
        message: res.message || '创建订单失败'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '创建订单失败'
      }
    }
  }

  // 获取订单列表
  const getOrderList = async (status = '') => {
    try {
      const res = await orderApi.getOrders({ status })
      if (res.code === 0) {
        orderList.value = res.data
      }
      return res.data
    } catch (error) {
      console.error('获取订单列表失败:', error)
      return []
    }
  }

  // 支付订单
  const payOrder = async (orderId) => {
    try {
      const res = await orderApi.payOrder(orderId)
      return res.code === 0
    } catch (error) {
      return false
    }
  }

  // 取消订单
  const cancelOrder = async (orderId) => {
    try {
      const res = await orderApi.cancelOrder(orderId)
      return res.code === 0
    } catch (error) {
      return false
    }
  }

  // 确认收货
  const confirmOrder = async (orderId) => {
    try {
      const res = await orderApi.confirmOrder(orderId)
      return res.code === 0
    } catch (error) {
      return false
    }
  }

  // 获取当前订单
  const getCurrentOrder = async () => {
    if (currentOrder.value) {
      return currentOrder.value
    }

    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const orderId = currentPage && currentPage.options && currentPage.options.orderId

    if (!orderId) {
      return null
    }

    try {
      const res = await orderApi.getOrderDetail({ id: orderId })
      if (res && res.code === 0 && res.data) {
        currentOrder.value = res.data
        return res.data
      }
      return null
    } catch (error) {
      console.error('获取订单详情失败:', error)
      return null
    }
  }

  return {
    currentOrder,
    orderList,
    createOrder,
    getOrderList,
    payOrder,
    cancelOrder,
    confirmOrder,
    getCurrentOrder
  }
}) 