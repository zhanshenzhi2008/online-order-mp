// 购物车数据
export const carts = []

// 购物车相关接口
export const cartApi = {
  // 添加到购物车
  'POST /cart/add': (data) => {
    const { foodId, quantity = 1, specs = [], additions = [] } = data
    const existItem = carts.find(item => 
      item.foodId === foodId && 
      JSON.stringify(item.specs) === JSON.stringify(specs) &&
      JSON.stringify(item.additions) === JSON.stringify(additions)
    )
    
    if (existItem) {
      existItem.quantity += quantity
    } else {
      carts.push({
        id: Date.now().toString(),
        ...data,
        quantity
      })
    }
    return { code: 0, data: carts }
  },

  // 更新购物车商品数量
  'POST /cart/update': (data) => {
    const { id, quantity } = data
    const item = carts.find(item => item.id === id)
    if (item) {
      item.quantity = quantity
    }
    return { code: 0, data: carts }
  },

  // 删除购物车商品
  'POST /cart/remove': (data) => {
    const { id } = data
    const index = carts.findIndex(item => item.id === id)
    if (index > -1) {
      carts.splice(index, 1)
    }
    return { code: 0, data: carts }
  },

  // 清空购物车
  'POST /cart/clear': () => {
    carts.length = 0
    return { code: 0, data: carts }
  },

  // 获取购物车列表
  'GET /cart/list': () => {
    return { code: 0, data: carts }
  }
} 