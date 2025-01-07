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
  // 获取支付方式列表
  'GET /payment/methods': () => {
    return {
      code: 0,
      data: paymentMethods
    }
  },

  // 创建支付订单
  'POST /payment/create': (data) => {
    if (!data || !data.orderId || !data.paymentMethod) {
      return {
        code: 1,
        message: '参数错误'
      }
    }

    return {
      code: 0,
      data: {
        paymentId: `PAY${Date.now()}`,
        orderId: data.orderId,
        amount: data.amount,
        qrcode: 'data:image/png;base64,xxx', // 模拟支付二维码
        expireTime: Date.now() + 15 * 60 * 1000 // 15分钟后过期
      }
    }
  },

  // 微信支付
  'POST /payment/wxpay': (data) => {
    if (!data || !data.paymentId) {
      return {
        code: 1,
        message: '参数错误'
      }
    }

    // 模拟微信支付参数
    return {
      code: 0,
      data: {
        appId: 'wx123456789',
        timeStamp: String(Date.now()),
        nonceStr: 'nonceStr123',
        package: 'prepay_id=wx123456789',
        signType: 'MD5',
        paySign: 'paySign123',
        mweb_url: 'https://wx.tenpay.com/pay.html' // H5支付链接
      }
    }
  },

  // 支付宝支付
  'POST /payment/alipay': (data) => {
    if (!data || !data.paymentId) {
      return {
        code: 1,
        message: '参数错误'
      }
    }

    // 模拟支付宝支付表单
    return {
      code: 0,
      data: {
        form: `<form action="https://openapi.alipay.com/gateway.do" method="POST">
          <input type="hidden" name="biz_content" value="...">
          <input type="hidden" name="sign" value="...">
        </form>`
      }
    }
  },

  // 查询支付状态
  'GET /payment/status': (params) => {
    if (!params || !params.paymentId) {
      return {
        code: 1,
        message: '参数错误'
      }
    }

    // 模拟80%的概率支付成功
    const success = Math.random() < 0.8
    return {
      code: 0,
      data: {
        paymentId: params.paymentId,
        status: success ? 'success' : 'pending',
        message: success ? '支付成功' : '等待支付'
      }
    }
  }
} 