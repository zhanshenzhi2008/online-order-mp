import request from '@/utils/request'

// 订单相关接口
export const orderApi = {
  // 创建订单
  createOrder: (data) => request({
    url: '/order/create',
    method: 'POST',
    data
  }),

  // 获取订单列表
  getOrders: (params) => request({
    url: '/order/list',
    params
  }),

  // 获取订单详情
  getOrderDetail: (id) => request({
    url: '/order/detail',
    params: { id }
  }),

  // 取消订单
  cancelOrder: (id) => request({
    url: '/order/cancel',
    method: 'POST',
    data: { id }
  }),

  // 支付订单
  payOrder: (id) => request({
    url: '/order/pay',
    method: 'POST',
    data: { id }
  }),

  // 确认收货
  confirmOrder: (id) => request({
    url: '/order/confirm',
    method: 'POST',
    data: { id }
  }),

  // 申请退款
  refundOrder: (id) => request({
    url: '/order/refund',
    method: 'POST',
    data: { id }
  })
} 