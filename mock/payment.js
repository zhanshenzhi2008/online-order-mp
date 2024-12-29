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
  'payment/methods': () => {
    return {
      code: 0,
      data: paymentMethods,
      message: 'success'
    }
  },

  // 创建支付订单
  'payment/create': (params) => {
    return {
      code: 0,
      data: {
        orderId: params.orderId || Date.now(),
        paymentMethod: params.paymentMethod,
        amount: params.amount,
        outTradeNo: `PAY${Date.now()}`,
        createTime: new Date().toISOString(),
        deliveryType: params.deliveryType === 'selfPickup' ? '自提' : '外卖'
      },
      message: 'success'
    }
  },

  // 微信支付
  'payment/wxpay': (params) => {
    return {
      code: 0,
      data: {
        // 微信支付参数格式
        timeStamp: String(Math.floor(Date.now() / 1000)), // 时间戳需要是字符串格式的秒级时间戳
        nonceStr: Math.random().toString(36).substr(2, 15), // 随机字符串
        package: 'prepay_id=wx' + Date.now(), // 统一下单接口返回的 prepay_id 参数值
        signType: 'MD5',
        paySign: 'mock_sign_data', // 签名
        // H5支付链接
        mweb_url: 'https://wx.tenpay.com/cgi-bin/mmpayweb-bin/checkmweb'
      },
      message: 'success'
    }
  },

  // 支付宝支付
  'payment/alipay': (params) => {
    return {
      code: 0,
      data: {
        // APP支付参数
        orderString: `alipay_sdk=alipay-sdk-php-20180705&app_id=2021000000000000&biz_content={"timeout_express":"30m","product_code":"QUICK_MSECURITY_PAY","total_amount":"${params.amount}","out_trade_no":"${params.orderId}"}&charset=UTF-8&format=json&method=alipay.trade.app.pay&notify_url=https://api.example.com/notify&sign_type=RSA2&timestamp=${new Date().toISOString()}&version=1.0&sign=mock_sign_data`,
        // H5支付表单
        form: `<form action="https://openapi.alipay.com/gateway.do" method="POST">
          <input type="hidden" name="biz_content" value='{"out_trade_no":"${params.orderId}","total_amount":"${params.amount}","subject":"订单支付"}'>
          <!-- 其他支付参数 -->
        </form>`
      },
      message: 'success'
    }
  },

  // 查询支付结果
  'payment/query': (params) => {
    return {
      code: 0,
      data: {
        orderId: params.orderId,
        status: 'SUCCESS',
        payTime: new Date().toISOString(),
        paymentMethod: 'wxpay',
        amount: '99.00',
        transactionId: `TRANS${Date.now()}`
      },
      message: 'success'
    }
  }
} 