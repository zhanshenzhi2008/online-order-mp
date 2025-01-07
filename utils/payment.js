export const PaymentService = {
  // 统一支付入口
  async pay(order) {
    try {
      // 1. 创建支付订单
      const payOrder = await this.createPayOrder(order)
      
      // 2. 根据环境选择支付方式
      if (isWechat()) {
        return this.wechatPay(payOrder)
      } else if (isH5()) {
        return this.h5Pay(payOrder) 
      }
    } catch (error) {
      this.handlePayError(error)
    }
  }
} 