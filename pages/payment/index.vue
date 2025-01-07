<template>
  <view class="payment-container">
    <!-- 支付方式选择 -->
    <view class="payment-methods">
      <view class="section-title">支付方式</view>
      <view class="method-list">
        <view 
          class="method-item"
          v-for="method in paymentMethods"
          :key="method.id"
          :class="{ active: selectedPayment === method.id }"
          @click="selectPayment(method)"
        >
          <image :src="method.icon" class="method-icon" mode="aspectFit"></image>
          <text class="method-name">{{ method.name }}</text>
          <text class="check-icon" v-if="selectedPayment === method.id">✓</text>
        </view>
      </view>
    </view>

    <!-- 支付金额 -->
    <view class="payment-amount">
      <text class="label">支付金额</text>
      <text class="amount">￥{{ order && order.totalAmount || '0.00' }}</text>
    </view>

    <!-- 支付按钮 -->
    <view class="pay-action">
      <button class="pay-button" @click="handlePay">
        {{ selectedPayment === 'wxpay' ? '微信支付' : '支付宝支付' }} ￥{{ order && order.totalAmount || '0.00' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useOrderStore } from '@/stores'
import { paymentApi } from '@/utils/api'
import { orderApi } from '@/utils/api'

const orderStore = useOrderStore()
const order = ref(null)
const paymentMethods = ref([])
const selectedPayment = ref('wxpay')

// 选择支付方式
const selectPayment = (method) => {
  selectedPayment.value = method.id
}

// 处理支付
const handlePay = async () => {
  if (!order.value || !order.value.id) {
    uni.showToast({
      title: '订单信息不存在',
      icon: 'none'
    })
    return
  }

  try {
    uni.showLoading({
      title: '支付中...',
      mask: true
    })
    
    // 创建支付订单
    const payRes = await paymentApi.createPayment({
      orderId: order.value.id,
      paymentMethod: selectedPayment.value,
      amount: order.value.finalAmount || order.value.totalAmount
    })

    if (payRes && payRes.code === 0 && payRes.data) {
      // 根据支付方式调用不同的支付
      if (selectedPayment.value === 'wxpay') {
        await handleWxPay(payRes.data)
      } else if (selectedPayment.value === 'alipay') {
        await handleAliPay(payRes.data)
      }
    } else {
      throw new Error((payRes && payRes.message) || '创建支付订单失败')
    }
  } catch (error) {
    handlePayError(error)
  }
}

// 处理微信支付
const handleWxPay = async (payData) => {
  try {
    const wxRes = await paymentApi.wxPay(payData)
    if (wxRes && wxRes.code === 0 && wxRes.data) {
      // #ifdef MP-WEIXIN
      uni.requestPayment({
        ...wxRes.data,
        success: () => handlePaySuccess(),
        fail: (err) => handlePayError(err)
      })
      // #endif
      
      // #ifdef H5
      if (wxRes.data.mweb_url) {
        window.location.href = wxRes.data.mweb_url
      } else {
        throw new Error('获取支付链接失败')
      }
      // #endif
    } else {
      throw new Error((wxRes && wxRes.message) || '发起支付失败')
    }
  } catch (error) {
    handlePayError(error)
  }
}

// 处理支付宝支付
const handleAliPay = async (payData) => {
  try {
    const aliRes = await paymentApi.aliPay(payData)
    if (aliRes && aliRes.code === 0 && aliRes.data) {
      // #ifdef H5
      if (aliRes.data.form) {
        const div = document.createElement('div')
        div.innerHTML = aliRes.data.form
        document.body.appendChild(div)
        document.forms[0].submit()
      } else {
        throw new Error('获取支付表单失败')
      }
      // #endif
    } else {
      throw new Error((aliRes && aliRes.message) || '发起支付失败')
    }
  } catch (error) {
    handlePayError(error)
  }
}

// 支付成功处理
const handlePaySuccess = () => {
  uni.hideLoading()
  // 跳转到支付结果页
  uni.redirectTo({
    url: '/pages/payment/result?status=success'
  })
}

// 支付失败处理
const handlePayError = (error) => {
  uni.hideLoading()
  console.error('支付失败:', error)
  const errMsg = error.errMsg || error.message || '支付失败'
  uni.showToast({
    title: errMsg,
    icon: 'none'
  })
  // 跳转到支付结果页
  uni.redirectTo({
    url: `/pages/payment/result?status=fail&message=${encodeURIComponent(errMsg)}`
  })
}

onMounted(async () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const orderId = currentPage && currentPage.options && currentPage.options.orderId

  if (!orderId) {
    uni.showToast({
      title: '订单ID不存在',
      icon: 'none',
      success: () => {
        setTimeout(() => {
          // 改为跳转到订单列表页面
          uni.switchTab({
            url: '/pages/order/index'
          })
        }, 1500)
      }
    })
    return
  }

  try {
    // 获取订单信息
    const res = await orderApi.getOrderDetail({ id: orderId })
    if (res && res.code === 0 && res.data) {
      order.value = res.data
      // 如果订单已支付，直接跳转到支付结果页
      if (order.value.status === 'paid' || order.value.status === 'completed') {
        uni.redirectTo({
          url: '/pages/payment/result?status=success'
        })
        return
      }
    } else {
      throw new Error('订单信息不存在')
    }

    // 获取支付方式列表
    const payRes = await paymentApi.getPaymentMethods()
    if (payRes && payRes.code === 0 && payRes.data) {
      paymentMethods.value = payRes.data
    } else {
      throw new Error('获取支付方式失败')
    }
  } catch (error) {
    uni.showToast({
      title: error.message || '加载失败',
      icon: 'none',
      success: () => {
        setTimeout(() => {
          // 改为跳转到订单列表页面
          uni.switchTab({
            url: '/pages/order/index'
          })
        }, 1500)
      }
    })
  }
})
</script>

<style lang="scss" scoped>
.payment-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
  
  .payment-methods {
    background: #fff;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }

    .method-list {
      .method-item {
        display: flex;
        align-items: center;
        padding: 20rpx 0;
        border-bottom: 1rpx solid #eee;

        &:last-child {
          border-bottom: none;
        }

        &.active {
          .method-name {
            color: #ff6b81;
          }
        }

        .method-icon {
          width: 48rpx;
          height: 48rpx;
          margin-right: 20rpx;
        }

        .method-name {
          flex: 1;
          font-size: 28rpx;
          color: #333;
        }

        .check-icon {
          font-size: 32rpx;
          color: #ff6b81;
        }
      }
    }
  }

  .payment-amount {
    background: #fff;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .label {
      font-size: 28rpx;
      color: #333;
    }

    .amount {
      font-size: 36rpx;
      font-weight: bold;
      color: #ff6b81;
    }
  }
  
  .pay-action {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 20rpx 30rpx;
    padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    background: #fff;
    
    .pay-button {
      width: 100%;
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      background: #ff6b81;
      color: #fff;
      border-radius: 44rpx;
      font-size: 32rpx;
      border: none;
      
      &:active {
        opacity: 0.8;
      }
    }
  }
}
</style> 