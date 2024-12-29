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
      <text class="amount">￥{{ order?.totalAmount || '0.00' }}</text>
    </view>

    <!-- 支付按钮 -->
    <view class="pay-action">
      <button class="pay-button" @click="handlePay">
        {{ selectedPayment === 'wxpay' ? '微信支付' : '支付宝支付' }} ￥{{ order?.totalAmount || '0.00' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useOrderStore } from '@/stores'
import { paymentApi } from '@/utils/api'

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
  if (!order.value) return

  uni.showLoading({
    title: '支付中...'
  })
  
  try {
    // 创建支付订单
    const payRes = await paymentApi.createPayment({
      orderId: order.value.id,
      paymentMethod: selectedPayment.value,
      amount: order.value.totalAmount
    })

    if (payRes.code === 0) {
      // 根据支付方式调用不同的支付
      if (selectedPayment.value === 'wxpay') {
        await handleWxPay(payRes.data)
      } else if (selectedPayment.value === 'alipay') {
        await handleAliPay(payRes.data)
      }
    } else {
      handlePayError(new Error(payRes.message))
    }
  } catch (error) {
    handlePayError(error)
  }
}

// 处理微信支付
const handleWxPay = async (payData) => {
  const wxRes = await paymentApi.wxPay(payData)
  if (wxRes.code === 0) {
    // #ifdef MP-WEIXIN
    uni.pay({
      ...wxRes.data,
      success: () => handlePaySuccess(),
      fail: (err) => handlePayError(err)
    })
    // #endif
    
    // #ifdef APP-PLUS
    uni.getProvider({
      service: 'payment',
      success: function (res) {
        if (res.provider.indexOf('wxpay') > -1) {
          uni.payWithWeixin({
            ...wxRes.data,
            success: () => handlePaySuccess(),
            fail: (err) => handlePayError(err)
          })
        } else {
          handlePayError(new Error('当前环境不支持微信支付'))
        }
      }
    })
    // #endif
    
    // #ifdef H5
    window.location.href = wxRes.data.mweb_url
    // #endif
  } else {
    handlePayError(new Error(wxRes.message))
  }
}

// 处理支付宝支付
const handleAliPay = async (payData) => {
  const aliRes = await paymentApi.aliPay(payData)
  if (aliRes.code === 0) {
    // #ifdef APP-PLUS
    uni.getProvider({
      service: 'payment',
      success: function (res) {
        if (res.provider.indexOf('alipay') > -1) {
          uni.payWithAlipay({
            orderInfo: aliRes.data.orderString,
            success: () => handlePaySuccess(),
            fail: (err) => handlePayError(err)
          })
        } else {
          handlePayError(new Error('当前环境不支持支付宝支付'))
        }
      }
    })
    // #endif
    
    // #ifdef H5
    const div = document.createElement('div')
    div.innerHTML = aliRes.data.form
    document.body.appendChild(div)
    document.forms[0].submit()
    // #endif
  } else {
    handlePayError(new Error(aliRes.message))
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
  uni.showToast({
    title: error.message || '支付失败',
    icon: 'none'
  })
  // 跳转到支付结果页
  uni.redirectTo({
    url: `/pages/payment/result?status=fail&message=${error.message || '支付失败'}`
  })
}

onMounted(async () => {
  // 获取订单信息
  order.value = orderStore.currentOrder
  if (!order.value) {
    uni.showToast({
      title: '订单信息不存在',
      icon: 'none',
      success: () => {
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    })
    return
  }

  // 获取支付方式列表
  const payRes = await paymentApi.getPaymentMethods()
  if (payRes.code === 0) {
    paymentMethods.value = payRes.data
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