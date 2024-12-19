// 模拟购物车数据
let cartData = []

// 导出 cartApi 对象
export const cartApi = {
  // 获取购物车列表
  'cart/list': () => {
    return {
      code: 0,
      message: 'success',
      data: cartData
    }
  },

  // 添加菜品到购物车
  'cart/add': (data) => {
    const { food_id, quantity = 1 } = data
    
    // 查找是否已存在
    const existItem = cartData.find(item => item.food_id === food_id)
    
    if (existItem) {
      existItem.quantity += quantity
    } else {
      cartData.push({
        food_id,
        quantity,
        selected: true
      })
    }

    return {
      code: 0,
      message: 'success',
      data: {
        quantity: existItem ? existItem.quantity : quantity
      }
    }
  },

  // 减少菜品数量
  'cart/decrease': (data) => {
    const { food_id } = data
    
    const item = cartData.find(item => item.food_id === food_id)
    
    if (!item) {
      return {
        code: -1,
        message: '菜品不存在'
      }
    }

    // 先保存要返回的数量
    const newQuantity = item.quantity > 1 ? item.quantity - 1 : 0

    if (item.quantity > 1) {
      item.quantity--
    } else {
      // 数量为1时，从购物车移除
      cartData = cartData.filter(i => i.food_id !== food_id)
    }

    return {
      code: 0,
      message: 'success',
      data: {
        quantity: newQuantity
      }
    }
  },

  // 清空购物车
  'cart/clear': () => {
    cartData = []
    return {
      code: 0,
      message: 'success'
    }
  }
} 