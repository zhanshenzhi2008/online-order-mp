<template>
  <view class="payment-container">
    <!-- 订单信息 -->
    <view class="order-info">
      <view class="order-title">订单信息</view>
      <view class="order-amount">
        <text>支付金额</text>
        <text class="price">¥{{ orderAmount }}</text>
      </view>
      <view class="order-number">
        <text>订单编号</text>
        <text>{{ orderId }}</text>
      </view>
    </view>

    <!-- 支付方式 -->
    <view class="payment-methods">
      <view class="section-title">支付方式</view>
      <view class="method-list">
        <view 
          v-for="method in paymentMethods" 
          :key="method.id"
          class="method-item"
          :class="{ active: selectedMethod === method.id }"
          @tap="selectMethod(method.id)"
        >
          <image :src="method.icon" mode="aspectFit" class="method-icon"></image>
          <text>{{ method.name }}</text>
          <view class="check-icon" v-if="selectedMethod === method.id">✓</view>
        </view>
      </view>
    </view>

    <!-- 支付按钮 -->
    <view class="bottom-bar">
      <button class="pay-button" @tap="handlePayment" :disabled="!selectedMethod">
        确认支付 ¥{{ orderAmount }}
      </button>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useOrderStore } from '@/stores'

export default {
  setup() {
    const orderStore = useOrderStore()
    const orderAmount = ref(0)
    const orderId = ref('')
    const selectedMethod = ref('')

    const paymentMethods = ref([
      {
        id: 'wxpay',
        name: '微信支付',
        icon: '/static/images/wxpay.png'
      },
      {
        id: 'alipay',
        name: '支付宝',
        icon: '/static/images/alipay.png'
      }
    ])

    onMounted(() => {
      // 从store或路由参数获取订单信息
      const order = orderStore.currentOrder
      if (order) {
        orderAmount.value = order.totalAmount
        orderId.value = order.orderId
      }
    })

    const selectMethod = (methodId) => {
      selectedMethod.value = methodId
    }

    const handlePayment = async () => {
      if (!selectedMethod.value) return
      
      try {
        uni.showLoading({
          title: '支付处理中...'
        })

        // 调用支付接口
        const paymentResult = await orderStore.payOrder({
          orderId: orderId.value,
          paymentMethod: selectedMethod.value,
          amount: orderAmount.value
        })

        if (paymentResult.success) {
          uni.showToast({
            title: '支付成功',
            icon: 'success'
          })
          
          // 延迟跳转到订单详情页
          setTimeout(() => {
            uni.redirectTo({
              url: '/pages/order/detail?id=' + orderId.value
            })
          }, 1500)
        } else {
          throw new Error(paymentResult.message)
        }
      } catch (error) {
        uni.showToast({
          title: error.message || '支付失败，请重试',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    }

    return {
      orderAmount,
      orderId,
      paymentMethods,
      selectedMethod,
      selectMethod,
      handlePayment
    }
  }
}
</script>

<style lang="scss">
.payment-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.order-info {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .order-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
  }

  .order-amount, .order-number {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20rpx;
    font-size: 28rpx;
    color: #333;

    .price {
      color: #ff0000;
      font-size: 36rpx;
      font-weight: bold;
    }
  }
}

.payment-methods {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
  }

  .method-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1px solid #eee;
    position: relative;

    &.active {
      background-color: #f8f8f8;
    }

    .method-icon {
      width: 60rpx;
      height: 60rpx;
      margin-right: 20rpx;
    }

    .check-icon {
      position: absolute;
      right: 20rpx;
      color: #ff0000;
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

  .pay-button {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background-color: #ff0000;
    color: #fff;
    border-radius: 44rpx;
    font-size: 32rpx;
    font-weight: bold;

    &:disabled {
      background-color: #ccc;
    }
  }
}
</style> 