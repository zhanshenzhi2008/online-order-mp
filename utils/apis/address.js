import request from '@/utils/request'

// 地址相关接口
export const addressApi = {
  // 获取地址列表
  getAddressList: () => request({
    url: '/address/list'
  }),

  // 添加地址
  addAddress: (data) => request({
    url: '/address/add',
    method: 'POST',
    data
  }),

  // 更新地址
  updateAddress: (data) => request({
    url: '/address/update',
    method: 'POST',
    data
  }),

  // 删除地址
  deleteAddress: (id) => request({
    url: '/address/delete',
    method: 'POST',
    data: { id }
  }),

  // 设置默认地址
  setDefaultAddress: (id) => request({
    url: '/address/setDefault',
    method: 'POST',
    data: { id }
  }),

  // 获取默认地址
  getDefaultAddress: () => request({
    url: '/address/default'
  })
} 