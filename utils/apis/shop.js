import request from '@/utils/request'

// 门店相关接口
export const shopApi = {
  // 获取门店列表
  getShopList() {
    return request({
      url: '/shop/list',
      method: 'GET'
    })
  },

  // 获取门店详情
  getShopDetail(id) {
    return request({
      url: '/shop/detail',
      method: 'GET',
      params: { id }
    })
  },

  // 获取当前门店信息
  getCurrentShop() {
    return request({
      url: '/shop/current',
      method: 'GET'
    })
  }
} 