import request from '@/utils/request'

// 支付相关接口
export const paymentApi = {
  // 获取支付方式列表
  getPaymentMethods() {
    return request({
      url: '/payment/methods',
      method: 'GET'
    })
  },

  // 创建支付订单
  createPayment(data) {
    return request({
      url: '/payment/create',
      method: 'POST',
      data
    })
  },

  // 查询支付结果
  queryPayment(orderId) {
    return request({
      url: '/payment/query',
      method: 'GET',
      params: { orderId }
    })
  },

  // 微信支付
  wxPay(data) {
    return request({
      url: '/payment/wxpay',
      method: 'POST',
      data
    })
  },

  // 支付宝支付
  aliPay(data) {
    return request({
      url: '/payment/alipay',
      method: 'POST',
      data
    })
  }
}
 