// 支付方式列表
export const paymentMethods = [
  {
    id: 'wxpay',
    name: '微信支付',
    icon: '/static/images/payment/wxpay.png'
  },
  {
    id: 'alipay',
    name: '支付宝支付',
    icon: '/static/images/payment/alipay.png'
  }
]

// 支付相关接口
export const paymentApi = {
  // 创建支付订单
  'POST /payment/create': (data) => {
    const { orderId } = data
    return {
      code: 0,
      data: {
        paymentId: `PAY${Date.now()}`,
        orderId,
        amount: 100,
        qrcode: 'data:image/png;base64,xxx', // 模拟支付二维码
        expireTime: Date.now() + 15 * 60 * 1000 // 15分钟后过期
      }
    }
  },

  // 查询支付状态
  'GET /payment/status': (params) => {
    const { paymentId } = params
    // 模拟80%的概率支付成功
    const success = Math.random() < 0.8
    return {
      code: 0,
      data: {
        paymentId,
        status: success ? 'success' : 'pending',
        message: success ? '支付成功' : '等待支付'
      }
    }
  },

  // 取消支付
  'POST /payment/cancel': (data) => {
    const { paymentId } = data
    return {
      code: 0,
      data: {
        paymentId,
        status: 'cancelled',
        message: '支付已取消'
      }
    }
  }
} 