import { defineStore } from 'pinia'
import { orderApi } from '@/utils/api'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orderList: [],
    currentOrder: null,
    loading: false,
    error: null
  }),

  actions: {
    // 获取订单列表
    async getOrderList(params = {}) {
      this.loading = true
      this.error = null
      try {
        const res = await orderApi.getOrders(params)
        if (res.code === 0) {
          this.orderList = res.data
          return { success: true }
        } else {
          throw new Error(res.message || '获取订单列表失败')
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

    // 获取订单详情
    async getOrderDetail(id) {
      this.loading = true
      this.error = null
      try {
        const res = await orderApi.getOrderDetail(id)
        if (res.code === 0) {
          this.currentOrder = res.data
          return { success: true }
        } else {
          throw new Error(res.message || '获取订单详情失败')
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

    // 取消订单
    async cancelOrder(order) {
      if (this.currentOrder && this.currentOrder.id === order.id) {
        this.currentOrder = null
      }

      this.loading = true
      this.error = null
      try {
        const res = await orderApi.cancelOrder(order.id)
        if (res.code === 0) {
          await this.getOrderList()
          return { success: true }
        } else {
          throw new Error(res.message || '取消失败')
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

    // 支付订单
    async payOrder(order) {
      if (this.currentOrder && this.currentOrder.id === order.id) {
        this.currentOrder = null
      }

      this.loading = true
      this.error = null
      try {
        const res = await orderApi.payOrder(order.id)
        if (res.code === 0) {
          await this.getOrderList()
          return { success: true }
        } else {
          throw new Error(res.message || '支付失败')
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

    // 确认收货
    async confirmOrder(order) {
      if (this.currentOrder && this.currentOrder.id === order.id) {
        this.currentOrder = null
      }

      this.loading = true
      this.error = null
      try {
        const res = await orderApi.confirmOrder(order.id)
        if (res.code === 0) {
          await this.getOrderList()
          return { success: true }
        } else {
          throw new Error(res.message || '确认收货失败')
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

    // 删除订单
    async deleteOrder(order) {
      if (this.currentOrder && this.currentOrder.id === order.id) {
        this.currentOrder = null
      }

      this.loading = true
      this.error = null
      try {
        const res = await orderApi.deleteOrder(order.id)
        if (res.code === 0) {
          await this.getOrderList()
          return { success: true }
        } else {
          throw new Error(res.message || '删除失败')
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
    }
  }
}) 