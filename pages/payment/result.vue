<template>
  <view class="result-container">
    <view class="result-content">
      <!-- 状态图标 -->
      <view class="status-icon" :class="status">
        <text v-if="status === 'success'" class="success-icon">✓</text>
        <text v-else class="fail-icon">✕</text>
      </view>
      
      <!-- 状态文本 -->
      <text class="status-text">{{ statusText }}</text>
      <text v-if="message" class="error-message">{{ message }}</text>
      
      <!-- 订单信息 -->
      <view v-if="order" class="order-info">
        <view class="info-item">
          <text class="label">订单金额</text>
          <text class="value">￥{{ order.totalAmount }}</text>
        </view>
        <view class="info-item">
          <text class="label">订单编号</text>
          <text class="value">{{ order.orderNo }}</text>
        </view>
        <view class="info-item">
          <text class="label">支付时间</text>
          <text class="value">{{ order.payTime }}</text>
        </view>
      </view>
    </view>
    
    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button 
        class="action-button primary" 
        @click="viewOrder"
      >查看订单</button>
      <button 
        class="action-button" 
        @click="backToHome"
      >返回首页</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrderStore } from '@/stores'
import { paymentApi } from '@/utils/api'

const orderStore = useOrderStore()
const status = ref('success')
const message = ref('')
const order = ref(null)

// 计算状态文本
const statusText = computed(() => {
  return status.value === 'success' ? '支付成功' : '支付失败'
})

// 查看订单
const viewOrder = () => {
  if (order.value) {
    uni.redirectTo({
      url: `/pages/order/detail?id=${order.value.id}`
    })
  }
}

// 返回首页
const backToHome = () => {
  uni.switchTab({
    url: '/pages/index/index'
  })
}

onMounted(() => {
  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  if (currentPage && currentPage.options) {
    status.value = currentPage.options.status || 'success'
    message.value = currentPage.options.message || ''
  }
  
  // 获取订单信息
  order.value = orderStore.currentOrder
})
</script>

<style lang="scss" scoped>
.result-container {
  min-height: 100vh;
  background: #fff;
  padding: 60rpx 30rpx;
  display: flex;
  flex-direction: column;
  
  .result-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60rpx 0;
    
    .status-icon {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 40rpx;
      
      &.success {
        background: #52c41a;
        
        .success-icon {
          color: #fff;
          font-size: 60rpx;
        }
      }
      
      &.fail {
        background: #ff4d4f;
        
        .fail-icon {
          color: #fff;
          font-size: 60rpx;
        }
      }
    }
    
    .status-text {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
    }
    
    .error-message {
      font-size: 28rpx;
      color: #999;
      margin-bottom: 40rpx;
    }
    
    .order-info {
      width: 100%;
      padding: 30rpx;
      background: #f5f5f5;
      border-radius: 12rpx;
      
      .info-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20rpx;
        
        &:last-child {
          margin-bottom: 0;
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
  }
  
  .action-buttons {
    display: flex;
    gap: 20rpx;
    padding: 30rpx;
    
    .action-button {
      flex: 1;
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      border-radius: 44rpx;
      font-size: 32rpx;
      
      &.primary {
        background: #ff6b81;
        color: #fff;
      }
      
      &:not(.primary) {
        background: #f5f5f5;
        color: #333;
      }
      
      &:active {
        opacity: 0.8;
      }
    }
  }
}
</style> 