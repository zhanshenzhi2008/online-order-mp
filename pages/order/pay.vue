<template>
  <view class="pay-container">
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
      
      <!-- 订单金额 -->
      <view class="order-amount">
        <text>合计</text>
        <text class="amount">￥{{ order.totalAmount }}</text>
      </view>
    </view>
    
    <!-- 支付按钮 -->
    <view class="pay-action">
      <button class="pay-button" @click="handlePay">
        确认支付 ￥{{ order.totalAmount }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useOrderStore } from '@/stores'

const orderStore = useOrderStore()
const order = ref(orderStore.currentOrder)

// 处理支付
const handlePay = () => {
  uni.showLoading({
    title: '支付中...'
  })
  
  // 模拟支付过程
  setTimeout(() => {
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
  }, 1500)
}

onMounted(() => {
  if (!order.value) {
    uni.showToast({
      title: '订单信息不存在',
      icon: 'none',
      success: () => {
        uni.navigateBack()
      }
    })
  }
})
</script>

<style lang="scss" scoped>
.pay-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
  
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