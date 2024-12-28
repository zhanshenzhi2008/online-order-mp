import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const cartList = ref([])

  // 添加到购物车
  const addToCart = (goods) => {
    const existItem = cartList.value.find(item => item.id === goods.id)
    if (existItem) {
      existItem.quantity += 1
    } else {
      cartList.value.push({
        ...goods,
        quantity: 1
      })
    }
  }

  // 更新购物车商品
  const updateCartItem = (goods) => {
    const index = cartList.value.findIndex(item => item.id === goods.id)
    if (index > -1) {
      if (goods.quantity > 0) {
        cartList.value[index] = goods
      } else {
        cartList.value.splice(index, 1)
      }
    }
  }

  // 清空购物车
  const clearCart = () => {
    cartList.value = []
  }

  return {
    cartList,
    addToCart,
    updateCartItem,
    clearCart
  }
}) 