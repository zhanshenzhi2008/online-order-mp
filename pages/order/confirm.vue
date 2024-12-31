<template>
  <view class="confirm-container">
    <!-- 配送方式 -->
    <view class="delivery-info">
      <text class="label">配送方式</text>
      <view class="delivery-switch">
        <view 
          class="switch-item" 
          :class="{ active: deliveryType === 'selfPickup' }"
          @tap="switchDeliveryType('selfPickup')"
        >到店自取</view>
        <view 
          class="switch-item" 
          :class="{ active: deliveryType === 'delivery' }"
          @tap="switchDeliveryType('delivery')"
        >外卖配送</view>
      </view>
    </view>

    <!-- 自取方式选择 -->
    <view class="pickup-type" v-if="deliveryType === 'selfPickup'">
      <text class="label">就餐方式</text>
      <view class="type-switch">
        <view 
          class="switch-item" 
          :class="{ active: pickupType === 'dineIn' }"
          @tap="pickupType = 'dineIn'"
        >堂食</view>
        <view 
          class="switch-item" 
          :class="{ active: pickupType === 'takeout' }"
          @tap="pickupType = 'takeout'"
        >打包</view>
      </view>
    </view>

    <!-- 收货地址 -->
    <view class="address-card" v-if="deliveryType === 'delivery'" @tap="goToAddress">
      <block v-if="selectedAddress">
        <view class="address-info">
          <view class="user-info">
            <text class="name">{{ selectedAddress.name }}</text>
            <text class="phone">{{ selectedAddress.phone }}</text>
          </view>
          <view class="address">{{ selectedAddress.address }}</view>
        </view>
      </block>
      <block v-else>
        <view class="no-address">
          <text>请选择收货地址</text>
        </view>
      </block>
      <text class="arrow">></text>
    </view>

    <!-- 商品列表 -->
    <view class="goods-list">
      <view class="goods-item" v-for="item in cartList" :key="item.id">
        <image class="goods-image" :src="item.image" mode="aspectFill"></image>
        <view class="goods-info">
          <text class="goods-name">{{ item.name }}</text>
          <view class="goods-bottom">
            <text class="goods-price">￥{{ item.price }}</text>
            <text class="goods-quantity">x{{ item.quantity }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="order-info">
      <view class="info-item">
        <text class="label">商品金额</text>
        <text class="value">￥{{ totalAmount }}</text>
      </view>
      
      <!-- 配送费 -->
      <view class="info-item" v-if="deliveryType === 'delivery'">
        <text class="label">配送费</text>
        <text class="value">￥{{ deliveryFee }}</text>
      </view>
      
      <!-- 打包费 -->
      <view class="info-item" v-if="needPackagingFee">
        <text class="label">打包费</text>
        <text class="value">￥{{ packagingFee }}</text>
      </view>
      
      <view class="info-item total">
        <text class="label">合计</text>
        <text class="value">￥{{ finalAmount }}</text>
      </view>
    </view>

    <!-- 备注 -->
    <view class="remark-section">
      <text class="label">备注</text>
      <input 
        class="remark-input" 
        type="text" 
        v-model="remark" 
        placeholder="请输入备注信息"
      />
    </view>

    <!-- 底部支付按钮 -->
    <view class="bottom-bar">
      <view class="price-section">
        <text class="price-label">实付金额：</text>
        <text class="price-value">￥{{ finalAmount }}</text>
      </view>
      <button class="pay-button" @tap="submitOrder">提交订单</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCartStore, useAddressStore, useOrderStore } from '@/stores'

const cartStore = useCartStore()
const addressStore = useAddressStore()
const orderStore = useOrderStore()

const deliveryType = ref('delivery')
const selectedAddress = ref(null)
const remark = ref('')
const deliveryFee = ref(5)
const packagingFee = ref(2)
const cartList = ref([])
const pickupType = ref('dineIn')

// 计算商品总金额
const totalAmount = computed(() => {
  return cartList.value.reduce((total, item) => total + item.price * item.quantity, 0)
})

// 计算是否需要打包费
const needPackagingFee = computed(() => {
  return deliveryType.value === 'delivery' || 
    (deliveryType.value === 'selfPickup' && pickupType.value === 'takeout')
})

// 计算最终支付金额
const finalAmount = computed(() => {
  let amount = totalAmount.value
  // 如果是外卖，加配送费
  if (deliveryType.value === 'delivery') {
    amount += deliveryFee.value
  }
  // 如果需要打包，加打包费
  if (needPackagingFee.value) {
    amount += packagingFee.value
  }
  return amount
})

// 初始化数据
const initData = async (options = {}) => {
  deliveryType.value = options.deliveryType || 'delivery'
  cartList.value = cartStore.cartList
  
  // 如果是外卖配送，获取默认地址
  if (deliveryType.value === 'delivery') {
    const defaultAddr = await addressStore.getDefaultAddress()
    if (!selectedAddress.value) {
      selectedAddress.value = defaultAddr
    }
  }
}

// 跳转到地址选择
const goToAddress = () => {
  if (deliveryType.value !== 'delivery') return
  
  uni.navigateTo({
    url: '/pages/address/list?from=order',
    success: () => {
      // 监听页面返回事件
      uni.$once('addressSelected', (address) => {
        selectedAddress.value = address
      })
    }
  })
}

// 切换配送方式
const switchDeliveryType = (type) => {
  if (deliveryType.value === type) return
  
  uni.showModal({
    title: '切换配送方式',
    content: '切换配送方式可能会影响配送费用，是否继续？',
    success: async (res) => {
      if (res.confirm) {
        deliveryType.value = type
        if (type === 'delivery') {
          const defaultAddr = await addressStore.getDefaultAddress()
          if (!selectedAddress.value) {
            selectedAddress.value = defaultAddr
          }
        } else {
          selectedAddress.value = null
        }
      }
    }
  })
}

// 页面加载时初始化数据
onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  initData(currentPage.options)
})

// 提交订单
const submitOrder = async () => {
  if (deliveryType.value === 'delivery' && !selectedAddress.value) {
    uni.showToast({
      title: '请选择收货地址',
      icon: 'none'
    })
    return
  }

  try {
    const orderData = {
      goods: cartList.value,
      totalAmount: totalAmount.value,
      finalAmount: finalAmount.value,
      deliveryType: deliveryType.value,
      pickupType: deliveryType.value === 'selfPickup' ? pickupType.value : null, // 添加自取方式
      deliveryFee: deliveryType.value === 'delivery' ? deliveryFee.value : 0,
      address: selectedAddress.value,
      remark: remark.value,
      createTime: new Date().toISOString(),
      status: '待支付'
    }

    const res = await orderStore.createOrder(orderData)
    if (res.success) {
      cartStore.clearCart()
      uni.redirectTo({
        url: `/pages/pay/pay?orderId=${res.data.id}`
      })
    } else {
      throw new Error(res.message)
    }
  } catch (error) {
    uni.showToast({
      title: error.message || '创建订单失败',
      icon: 'none'
    })
  }
}
</script>

<style lang="scss">
.confirm-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 120rpx;
}

.delivery-info {
  background: #fff;
  padding: 30rpx;
  margin-top: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .label {
    font-size: 28rpx;
    color: #333;
  }
  
  .delivery-switch {
    display: flex;
    background: #f5f5f5;
    border-radius: 32rpx;
    padding: 4rpx;
    
    .switch-item {
      padding: 8rpx 24rpx;
      font-size: 24rpx;
      color: #666;
      border-radius: 28rpx;
      transition: all 0.3s;
      
      &.active {
        background: #91683d;
        color: #fff;
      }
      
      &:active {
        opacity: 0.8;
      }
    }
  }
}

.address-card {
  background: #fff;
  padding: 30rpx;
  margin-top: 20rpx;
  display: flex;
  align-items: flex-start;
  
  .address-info {
    flex: 1;
    margin-right: 20rpx;
    min-width: 0;
    
    .user-info {
      margin-bottom: 10rpx;
      display: flex;
      align-items: center;
      
      .name {
        font-size: 28rpx;
        color: #333;
        margin-right: 20rpx;
        font-weight: bold;
      }
      
      .phone {
        font-size: 28rpx;
        color: #666;
      }
    }
    
    .address {
      font-size: 26rpx;
      color: #666;
      line-height: 1.4;
      word-break: break-all;
    }
  }
  
  .no-address {
    flex: 1;
    font-size: 28rpx;
    color: #999;
  }
  
  .arrow {
    margin-left: 20rpx;
    color: #999;
    font-size: 24rpx;
    flex-shrink: 0;
  }
}

.goods-list {
  background: #fff;
  margin-top: 20rpx;
  padding: 0 30rpx;
  
  .goods-item {
    display: flex;
    padding: 30rpx 0;
    border-bottom: 1rpx solid #f5f5f5;
    
    &:last-child {
      border-bottom: none;
    }
    
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
      
      .goods-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .goods-price {
          font-size: 32rpx;
          color: #ff6b81;
          font-weight: bold;
        }
        
        .goods-quantity {
          font-size: 26rpx;
          color: #999;
        }
      }
    }
  }
}

.order-info {
  background: #fff;
  margin-top: 20rpx;
  padding: 30rpx;
  
  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    &.total {
      padding-top: 20rpx;
      border-top: 1rpx solid #f5f5f5;
      
      .label, .value {
        font-weight: bold;
        color: #333;
      }
    }
    
    .label {
      font-size: 28rpx;
      color: #666;
    }
    
    .value {
      font-size: 28rpx;
      color: #333;
    }
  }
}

.remark-section {
  background: #fff;
  margin-top: 20rpx;
  padding: 30rpx;
  
  .label {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 20rpx;
    display: block;
  }
  
  .remark-input {
    width: 100%;
    height: 80rpx;
    background: #f5f5f5;
    border-radius: 8rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
  }
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100rpx;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  
  .price-section {
    flex: 1;
    
    .price-label {
      font-size: 28rpx;
      color: #333;
    }
    
    .price-value {
      font-size: 36rpx;
      color: #ff6b81;
      font-weight: bold;
    }
  }
  
  .pay-button {
    width: 240rpx;
    height: 80rpx;
    line-height: 80rpx;
    background: #ff6b81;
    color: #fff;
    font-size: 32rpx;
    border-radius: 40rpx;
    text-align: center;
    margin: 0;
    
    &:active {
      opacity: 0.9;
    }
  }
}

.pickup-type {
  background: #fff;
  padding: 30rpx;
  margin-top: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .label {
    font-size: 28rpx;
    color: #333;
  }
  
  .type-switch {
    display: flex;
    background: #f5f5f5;
    border-radius: 32rpx;
    padding: 4rpx;
    
    .switch-item {
      padding: 8rpx 24rpx;
      font-size: 24rpx;
      color: #666;
      border-radius: 28rpx;
      transition: all 0.3s;
      
      &.active {
        background: #91683d;
        color: #fff;
      }
      
      &:active {
        opacity: 0.8;
      }
    }
  }
}
</style> 