<template>
  <view class="pay-container" v-if="order">
    <!-- 配送方式选择 -->
    <view class="delivery-select">
      <view class="section-title">取餐方式</view>
      <view class="delivery-options">
        <view 
          class="delivery-option" 
          :class="{ active: order.deliveryType === 'delivery' }"
          @click="switchDeliveryType('delivery')"
        >
          <text class="option-name">外卖配送</text>
        </view>
        <view 
          class="delivery-option" 
          :class="{ active: order.deliveryType === 'selfPickup' }"
          @click="switchDeliveryType('selfPickup')"
        >
          <text class="option-name">到店自提</text>
          <view class="sub-options" v-if="order.deliveryType === 'selfPickup'">
            <text 
              class="sub-option"
              :class="{ active: pickupType === 'dineIn' }"
              @click.stop="switchPickupType('dineIn')"
            >堂食</text>
            <text 
              class="sub-option"
              :class="{ active: pickupType === 'takeout' }"
              @click.stop="switchPickupType('takeout')"
            >打包</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 配送地址，外卖时显示 -->
    <view 
      class="delivery-address" 
      v-if="order.deliveryType === 'delivery'"
      @click="selectAddress"
    >
      <view v-if="selectedAddress" class="address-info">
        <view class="address-header">
          <text class="name">{{ selectedAddress.name }}</text>
          <text class="phone">{{ selectedAddress.phone }}</text>
        </view>
        <view class="address-detail">
          {{ selectedAddress.province }}{{ selectedAddress.city }}{{ selectedAddress.district }}{{ selectedAddress.detail }}
        </view>
      </view>
      <view v-else class="no-address">
        <text>请选择配送地址</text>
      </view>
      <text class="arrow">></text>
    </view>

    <!-- 订单信息 -->
    <view class="order-info">
      <view class="order-header">
        <text class="title">订单信息</text>
        <text class="type">({{ order.deliveryType === 'selfPickup' ? '自取' : '外卖' }})</text>
      </view>
      
      <!-- 商品列表 -->
      <view class="goods-list">
        <view 
          class="goods-item"
          v-for="item in order.goods"
          :key="item.id"
        >
          <image 
            :src="item.image" 
            class="goods-image"
            mode="aspectFill"
          ></image>
          <view class="goods-info">
            <text class="goods-name">{{ item.name }}</text>
            <view class="goods-price-wrap">
              <text class="goods-price">￥{{ item.price }}</text>
              <text class="goods-quantity">x{{ item.quantity }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 费用明细 -->
      <view class="fee-details">
        <view class="fee-item">
          <text>商品金额</text>
          <text class="fee">￥{{ order.goodsAmount }}</text>
        </view>
        
        <!-- 配送费，仅外卖时显示 -->
        <view class="fee-item" v-if="order.deliveryType === 'delivery'">
          <text>配送费</text>
          <text class="fee">￥{{ deliveryFee }}</text>
        </view>
        
        <!-- 打包费，外卖或自取打包时显示 -->
        <view class="fee-item" v-if="order.deliveryType === 'delivery' || (order.deliveryType === 'selfPickup' && pickupType === 'takeout')">
          <text>打包费</text>
          <text class="fee">￥{{ packagingFee }}</text>
        </view>
      </view>
      
      <!-- 订单金额 -->
      <view class="order-amount">
        <text>合计</text>
        <text class="amount">￥{{ totalAmount }}</text>
      </view>
    </view>
    
    <!-- 支付方式 -->
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
    
    <!-- 支付按钮 -->
    <view class="pay-action">
      <button class="pay-button" @click="handlePay">
        {{ selectedPayment === 'wxpay' ? '微信支付' : '支付宝支付' }} ￥{{ totalAmount }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useOrderStore, useAddressStore } from '@/stores'
import { paymentApi } from '@/utils/api'

const orderStore = useOrderStore()
const addressStore = useAddressStore()
const order = ref(null)
const pickupType = ref('dineIn')
const selectedAddress = ref(null)
const paymentMethods = ref([])
const selectedPayment = ref('wxpay') // 默认微信支付

// 配送费和打包费的固定值
const deliveryFee = 5.00
const packagingFee = 2.00

// 计算总金额
const totalAmount = computed(() => {
  if (!order.value || !order.value.goodsAmount) return '0.00'
  
  let total = Number(order.value.goodsAmount)
  
  // 外卖需要加配送费和打包费
  if (order.value && order.value.deliveryType === 'delivery') {
    total += deliveryFee + packagingFee
  }
  // 自取且打包需要加打包费
  else if (order.value && order.value.deliveryType === 'selfPickup' && pickupType.value === 'takeout') {
    total += packagingFee
  }
  
  return total.toFixed(2)
})

// 切换配送方式
const switchDeliveryType = async (type) => {
  if (!order.value || order.value.deliveryType === type) return
  
  order.value.deliveryType = type
  // 切换到外卖时，检查是否有地址
  if (type === 'delivery' && !selectedAddress.value) {
    const defaultAddress = await addressStore.getDefaultAddress()
    if (defaultAddress) {
      selectedAddress.value = defaultAddress
      order.value.address = defaultAddress
    }
  }
}

// 切换自取类型
const switchPickupType = (type) => {
  if (!order.value) return
  
  pickupType.value = type
  // 重新计算总金额
  order.value.totalAmount = totalAmount.value
}

// 选择地址
const selectAddress = () => {
  uni.navigateTo({
    url: '/pages/address/list?select=true',
    events: {
      // 监听地址选择事件
      addressSelected: (address) => {
        selectedAddress.value = address
        if (order.value) {
          order.value.address = address
          // 如果地址有打包设置，更新订单的打包状态
          if (address.needPackaging !== undefined) {
            order.value.needPackaging = address.needPackaging
          }
        }
      }
    }
  })
}

// 监听配送方式变化
watch(() => order.value && order.value.deliveryType, (newType, oldType) => {
  if (newType === oldType) return // 避免重复触发
  
  if (newType === 'delivery' && !selectedAddress.value) {
    uni.showToast({
      title: '请选择配送地址',
      icon: 'none'
    })
  }
}, { deep: false }) // 不需要深度监听

// 选择支付方式
const selectPayment = (method) => {
  selectedPayment.value = method.id
}

// 处理支付
const handlePay = async () => {
  if (!order.value) return
  
  // 外卖必须选择地址
  if (order.value.deliveryType === 'delivery' && !selectedAddress.value) {
    uni.showToast({
      title: '请选择配送地址',
      icon: 'none'
    })
    return
  }

  uni.showLoading({
    title: '支付中...'
  })
  
  try {
    // 创建支付订单
    const payRes = await paymentApi.createPayment({
      orderId: order.value.id,
      paymentMethod: selectedPayment.value,
      amount: totalAmount.value,
      subject: '淄博烧烤订单',
      body: order.value.goods.map(item => item.name).join(','),
      deliveryType: order.value.deliveryType,
      address: selectedAddress.value,
      pickupType: pickupType.value
    })

    if (payRes.code === 0) {
      // 根据支付方式调用不同的支付
      if (selectedPayment.value === 'wxpay') {
        // 调用微信支付
        const wxRes = await paymentApi.wxPay(payRes.data)
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
      } else if (selectedPayment.value === 'alipay') {
        // 调用支付宝支付
        const aliRes = await paymentApi.aliPay(payRes.data)
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
    } else {
      handlePayError(new Error(payRes.message))
    }
  } catch (error) {
    handlePayError(error)
  }
}

// 支付成功处理
const handlePaySuccess = () => {
  uni.hideLoading()
  uni.showToast({
    title: '支付成功',
    icon: 'success',
    duration: 2000,
    success: () => {
      // 清空购物车和当前订单
      orderStore.clearCurrentOrder()
      // 跳转到订单列表页
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/order/index'
        })
      }, 2000)
    }
  })
}

// 支付失败处理
const handlePayError = (error) => {
  uni.hideLoading()
  uni.showToast({
    title: error.message || '支付失败',
    icon: 'none',
    success: () => {
      // 不清空订单信息，让用户可以重试支付
      setTimeout(() => {
        // 返回上一页
        uni.navigateBack()
      }, 1500)
    }
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
          // 返回到点餐页面
          uni.switchTab({
            url: '/pages/menu/menu'
          })
        }, 1500)
      }
    })
    return
  }

  // 保存商品金额
  order.value.goodsAmount = order.value.totalAmount

  // 如果是外卖，获取默认地址
  if (order.value.deliveryType === 'delivery') {
    const defaultAddress = await addressStore.getDefaultAddress()
    if (defaultAddress) {
      selectedAddress.value = defaultAddress
      order.value.address = defaultAddress
    }
  }

  // 只在首次加载时获取支付方式列表
  if (!paymentMethods.value.length) {
    const payRes = await paymentApi.getPaymentMethods()
    if (payRes.code === 0) {
      paymentMethods.value = payRes.data
    }
  }
})
</script>

<style lang="scss" scoped>
.pay-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
  
  .delivery-select {
    background: #fff;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }

    .delivery-options {
      display: flex;
      gap: 20rpx;

      .delivery-option {
        flex: 1;
        height: 88rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #f5f5f5;
        border-radius: 12rpx;
        position: relative;
        transition: all 0.3s;

        &.active {
          background: #91683d;
          color: #fff;
        }

        .option-name {
          font-size: 28rpx;
        }

        .sub-options {
          position: absolute;
          left: 0;
          right: 0;
          bottom: -80rpx;
          background: #fff;
          padding: 20rpx;
          border-radius: 12rpx;
          box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
          display: flex;
          gap: 20rpx;
          z-index: 1;

          .sub-option {
            flex: 1;
            height: 60rpx;
            line-height: 60rpx;
            text-align: center;
            background: #f5f5f5;
            border-radius: 8rpx;
            font-size: 26rpx;
            color: #666;

            &.active {
              background: #91683d;
              color: #fff;
            }
          }
        }
      }
    }
  }
  
  .delivery-address {
    background: #fff;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
    
    .address-info {
      flex: 1;
      
      .address-header {
        margin-bottom: 12rpx;
        
        .name {
          font-size: 28rpx;
          font-weight: bold;
          margin-right: 20rpx;
        }
        
        .phone {
          font-size: 26rpx;
          color: #666;
        }
      }
      
      .address-detail {
        font-size: 26rpx;
        color: #333;
        line-height: 1.4;
      }
    }
    
    .no-address {
      flex: 1;
      font-size: 28rpx;
      color: #999;
    }
    
    .arrow {
      font-size: 32rpx;
      color: #999;
      margin-left: 20rpx;
    }
    
    &:active {
      opacity: 0.8;
    }
  }
  
  .order-info {
    background: #fff;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    
    .order-header {
      display: flex;
      align-items: center;
      margin-bottom: 30rpx;
      
      .title {
        font-size: 32rpx;
        font-weight: bold;
      }
      
      .type {
        font-size: 24rpx;
        color: #666;
        margin-left: 12rpx;
      }
    }
    
    .goods-list {
      .goods-item {
        display: flex;
        padding: 20rpx 0;
        border-bottom: 1rpx solid #eee;
        
        .goods-image {
          width: 120rpx;
          height: 120rpx;
          border-radius: 8rpx;
          margin-right: 20rpx;
        }
        
        .goods-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          
          .goods-name {
            font-size: 28rpx;
            color: #333;
          }
          
          .goods-price-wrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .goods-price {
              font-size: 28rpx;
              color: #ff6b81;
            }
            
            .goods-quantity {
              font-size: 24rpx;
              color: #999;
            }
          }
        }
      }
    }
    
    .fee-details {
      padding: 20rpx 0;
      border-top: 1rpx solid #eee;
      
      .fee-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16rpx;
        font-size: 26rpx;
        color: #666;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .fee {
          color: #333;
        }
      }
    }
    
    .order-amount {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 30rpx;
      font-size: 28rpx;
      
      .amount {
        font-size: 36rpx;
        font-weight: bold;
        color: #ff6b81;
      }
    }
  }
  
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