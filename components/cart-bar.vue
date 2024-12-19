<template>
  <view class="cart-bar" v-if="totalCount > 0">
    <!-- 购物车图标 -->
    <view class="cart-icon" @tap="toggleCartPanel">
      <view class="badge" v-if="totalCount">{{totalCount}}</view>
      <image src="/static/images/cart.png" mode="widthFix"></image>
    </view>
    
    <!-- 价格信息 -->
    <view class="cart-info">
      <view class="cart-total">
        <text class="price">¥{{totalPrice}}</text>
        <text class="count">共{{totalCount}}件</text>
      </view>
    </view>
    
    <!-- 结算按钮 -->
    <button class="checkout-btn" @tap="goToCheckout">去结算</button>

    <!-- 购物车面板 -->
    <view class="cart-panel" v-if="showPanel" @tap.stop>
      <view class="panel-header">
        <text class="title">购物车</text>
        <text class="clear" @tap="clearCart">清空</text>
      </view>
      
      <scroll-view class="cart-list" scroll-y>
        <view class="cart-item" v-for="item in cartItems" :key="item.food_id">
          <view class="item-info">
            <text class="name">{{item.name}}</text>
            <text class="price">¥{{item.price}}</text>
          </view>
          <view class="quantity-control">
            <button class="control-btn minus" @tap="handleDecrease(item)">-</button>
            <text class="quantity">{{item.quantity}}</text>
            <button class="control-btn plus" @tap="handleIncrease(item)">+</button>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 遮罩层 -->
    <view class="mask" v-if="showPanel" @tap="toggleCartPanel"></view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { cartApi } from '@/utils/api'

const cartItems = ref([])
const loading = ref(false)
const showPanel = ref(false)

// 计算总数量
const totalCount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

// 计算总价格
const totalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0).toFixed(2)
})

// 获取购物车数据
const fetchCartData = async () => {
  try {
    loading.value = true
    const res = await cartApi.getCartList()
    if (res.code === 0) {
      cartItems.value = res.data
    }
  } catch (error) {
    console.error('Failed to fetch cart:', error)
  } finally {
    loading.value = false
  }
}

// 增加数量
const handleIncrease = async (item) => {
  try {
    const res = await cartApi.addToCart({
      food_id: item.food_id,
      quantity: 1
    })
    if (res.code === 0) {
      await fetchCartData()
    }
  } catch (error) {
    uni.showToast({
      title: '操作失败',
      icon: 'none'
    })
  }
}

// 减少数量
const handleDecrease = async (item) => {
  try {
    const res = await cartApi.decrease({
      food_id: item.food_id
    })
    if (res.code === 0) {
      await fetchCartData()
    }
  } catch (error) {
    uni.showToast({
      title: '操作失败',
      icon: 'none'
    })
  }
}

// 清空购物车
const clearCart = async () => {
  try {
    const res = await cartApi.clearCart()
    if (res.code === 0) {
      cartItems.value = []
      showPanel.value = false
      uni.showToast({
        title: '已清空',
        icon: 'success'
      })
    }
  } catch (error) {
    uni.showToast({
      title: '操作失败',
      icon: 'none'
    })
  }
}

// 切换购物车面板
const toggleCartPanel = () => {
  showPanel.value = !showPanel.value
}

// 去结算
const goToCheckout = () => {
  uni.navigateTo({
    url: '/pages/order/checkout'
  })
}

// 选择地址
const selectAddress = () => {
  uni.navigateTo({
    url: '/pages/address/list'
  })
}

onMounted(() => {
  fetchCartData()
})

// 暴露给父组件的方法
defineExpose({
  refresh: fetchCartData
})
</script>

<style lang="scss" scoped>
.cart-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100rpx;
  background: #333;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  z-index: 100;
  
  .cart-icon {
    position: relative;
    width: 80rpx;
    height: 80rpx;
    margin-right: 20rpx;
    
    image {
      width: 100%;
      height: 100%;
    }
    
    .badge {
      position: absolute;
      top: -10rpx;
      right: -10rpx;
      min-width: 36rpx;
      height: 36rpx;
      line-height: 36rpx;
      text-align: center;
      background: #f00;
      color: #fff;
      border-radius: 18rpx;
      font-size: 24rpx;
      padding: 0 8rpx;
    }
  }
  
  .cart-info {
    flex: 1;
    
    .cart-total {
      .price {
        font-size: 36rpx;
        color: #fff;
        font-weight: bold;
        margin-right: 20rpx;
      }
      
      .count {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
  
  .checkout-btn {
    width: 200rpx;
    height: 80rpx;
    line-height: 80rpx;
    background: #f00;
    color: #fff;
    font-size: 32rpx;
    border-radius: 40rpx;
    text-align: center;
  }
}

.cart-panel {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 100rpx;
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  z-index: 101;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    border-bottom: 1rpx solid #eee;
    
    .title {
      font-size: 32rpx;
      font-weight: bold;
    }
    
    .clear {
      font-size: 28rpx;
      color: #999;
    }
  }
  
  .cart-list {
    flex: 1;
    overflow-y: auto;
    
    .cart-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx;
      border-bottom: 1rpx solid #eee;
      
      .item-info {
        flex: 1;
        margin-right: 20rpx;
        
        .name {
          font-size: 28rpx;
          color: #333;
          margin-bottom: 10rpx;
        }
        
        .price {
          font-size: 32rpx;
          color: #f00;
          font-weight: bold;
        }
      }
      
      .quantity-control {
        display: flex;
        align-items: center;
        gap: 12rpx;
        
        .control-btn {
          width: 48rpx;
          height: 48rpx;
          line-height: 44rpx;
          text-align: center;
          color: #fff;
          border-radius: 50%;
          font-size: 32rpx;
          font-weight: bold;
          padding: 0;
          
          &.minus {
            background: #999;
          }
          
          &.plus {
            background: #f00;
          }
        }
        
        .quantity {
          font-size: 28rpx;
          color: #333;
          min-width: 40rpx;
          text-align: center;
        }
      }
    }
  }
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

// 适配底部安全区
.cart-bar {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style> 