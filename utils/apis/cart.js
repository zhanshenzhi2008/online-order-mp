import request from '@/utils/request'

// 购物车相关接口
export const cartApi = {
  // 获取购物车列表
  getCartList: () => request({
    url: '/cart/list'
  }),

  // 添加菜品到购物车
  addToCart: (data) => request({
    url: '/cart/add',
    method: 'POST',
    data
  }),

  // 减少菜品数量
  decrease: (data) => request({
    url: '/cart/decrease',
    method: 'POST',
    data
  }),

  // 清空购物车
  clearCart: () => request({
    url: '/cart/clear',
    method: 'POST'
  })
} 