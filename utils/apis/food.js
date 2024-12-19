import request from '@/utils/request'

// 商品相关接口
export const foodApi = {
  // 获取分类列表
  getCategories: () => request({
    url: '/food/categories'
  }),

  // 获取分类下的商品
  getFoodsByCategory: (categoryId) => request({
    url: '/food/list',
    params: { categoryId }
  }),

  // 获取推荐商品
  getRecommendFoods: () => request({
    url: '/food/recommend'
  }),

  // 搜索商品
  searchFoods: (keyword) => request({
    url: '/food/search',
    params: { keyword }
  })
} 