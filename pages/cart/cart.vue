<template>
  <view class="cart-page">
    <!-- 购物车列表 -->
    <view class="cart-list" v-if="cartItems.length > 0">
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
    </view>
    
    <!-- 空购物车提示 -->
    <view class="empty-cart" v-else>
      <text>购物车是空的</text>
      <button class="go-menu-btn" @tap="goToMenu">去点餐</button>
    </view>
    
    <!-- 底部结算栏 -->
    <view class="checkout-bar" v-if="cartItems.length > 0">
      <view class="total-info">
        <text class="total-count">共 {{totalCount}} 件</text>
        <text class="total-price">¥{{totalPrice}}</text>
      </view>
      <button class="checkout-btn" @tap="goToCheckout">去结算</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { cartApi } from '@/utils/api'

const cartItems = ref([])
const loading = ref(false)

// 计算总数量
const totalCount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

// 计算总价格
const totalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
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
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
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

// 去点餐
const goToMenu = () => {
  uni.switchTab({
    url: '/pages/menu/menu'
  })
}

// 去结算
const goToCheckout = () => {
  uni.navigateTo({
    url: '/pages/order/checkout'
  })
}

onMounted(() => {
  fetchCartData()
})
</script>

<style lang="scss">
.cart-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: calc(120rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

.cart-list {
  padding: 20rpx;
  
  .cart-item {
    background: #fff;
    border-radius: 12rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .item-info {
      flex: 1;
      margin-right: 20rpx;
      
      .name {
        font-size: 32rpx;
        color: #333;
        margin-bottom: 10rpx;
      }
      
      .price {
        font-size: 36rpx;
        color: #f00;
        font-weight: bold;
      }
    }
    
    .quantity-control {
      display: flex;
      align-items: center;
      gap: 12rpx;
      
      .control-btn {
        width: 56rpx;
        height: 56rpx;
        line-height: 52rpx;
        text-align: center;
        color: #fff;
        border-radius: 50%;
        font-size: 36rpx;
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
        font-size: 32rpx;
        color: #333;
        min-width: 40rpx;
        text-align: center;
      }
    }
  }
}

.empty-cart {
  padding: 100rpx 40rpx;
  text-align: center;
  
  text {
    font-size: 32rpx;
    color: #999;
    margin-bottom: 40rpx;
    display: block;
  }
  
  .go-menu-btn {
    width: 300rpx;
    height: 80rpx;
    line-height: 80rpx;
    background: #f00;
    color: #fff;
    font-size: 32rpx;
    border-radius: 40rpx;
    margin: 0 auto;
  }
}

.checkout-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
  padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  
  .total-info {
    flex: 1;
    margin-right: 20rpx;
    
    .total-count {
      font-size: 28rpx;
      color: #666;
      margin-right: 20rpx;
    }
    
    .total-price {
      font-size: 36rpx;
      color: #f00;
      font-weight: bold;
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
</style> 	