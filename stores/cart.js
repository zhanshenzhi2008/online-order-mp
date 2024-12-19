import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: {}  // 使用对象存储，key 为食品 id，value 为数量
  }),

  getters: {
    totalCount: (state) => {
      return Object.values(state.items).reduce((sum, count) => sum + count, 0)
    },
    
    getItemQuantity: (state) => (foodId) => {
      return state.items[foodId] || 0
    },

    cartList: (state) => {
      return Object.entries(state.items).map(([foodId, quantity]) => ({
        id: foodId,
        quantity,
      }))
    }
  },

  actions: {
    addItem(food) {
      if (!this.items[food.id]) {
        this.items[food.id] = 0
      }
      this.items[food.id]++
      return { code: 0, message: 'success' }
    },

    removeItem(foodId) {
      if (this.items[foodId] && this.items[foodId] > 0) {
        this.items[foodId]--
        if (this.items[foodId] === 0) {
          delete this.items[foodId]
        }
        return { code: 0, message: 'success' }
      }
      return { code: -1, message: '商品不存在或数量为0' }
    },

    getItem(foodId) {
      return {
        code: 0,
        data: {
          quantity: this.items[foodId] || 0
        }
      }
    },

    getCartList() {
      return {
        code: 0,
        data: this.cartList
      }
    },

    clearCart() {
      this.items = {}
    }
  }
}) 