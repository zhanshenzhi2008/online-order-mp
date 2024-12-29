<template>
  <view class="mine-container">
    <!-- 用户信息区域 -->
    <view class="user-info" @tap="goToLogin">
      <view class="avatar-wrap">
        <image 
          class="avatar" 
          :src="userInfo && userInfo.avatar ? userInfo.avatar : '/static/images/default-avatar.png'" 
          mode="aspectFill"
        ></image>
      </view>
      <view class="info-content">
        <text class="nickname">{{ userInfo && userInfo.nickname ? userInfo.nickname : '点击登录' }}</text>
        <text class="phone" v-if="userInfo && userInfo.phone">{{ userInfo.phone }}</text>
      </view>
      <text class="arrow">></text>
    </view>

    <!-- 功能列表 -->
    <view class="menu-list">
      <view class="menu-item" @tap="goToAddress">
        <view class="menu-left">
          <image class="menu-icon" src="/static/images/mine/address.png"></image>
          <text class="menu-name">收货地址</text>
        </view>
        <text class="arrow">></text>
      </view>

      <view class="menu-item" @tap="goToCoupons">
        <view class="menu-left">
          <image class="menu-icon" src="/static/images/mine/coupon.png"></image>
          <text class="menu-name">优惠券</text>
        </view>
        <text class="count" v-if="couponCount">{{ couponCount }}张可用</text>
        <text class="arrow">></text>
      </view>

      <view class="menu-item" @tap="goToInvoice">
        <view class="menu-left">
          <image class="menu-icon" src="/static/images/mine/invoice.png"></image>
          <text class="menu-name">发票管理</text>
        </view>
        <text class="arrow">></text>
      </view>

      <view class="menu-item" @tap="goToSettings">
        <view class="menu-left">
          <image class="menu-icon" src="/static/images/mine/settings.png"></image>
          <text class="menu-name">设置</text>
        </view>
        <text class="arrow">></text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const userInfo = ref(null)
const couponCount = ref(0) // 可用优惠券数量

// 跳转到登录页
const goToLogin = () => {
  if (!userInfo.value) {
    uni.navigateTo({
      url: '/pages/login/login'
    })
  }
}

// 跳转到地址管理
const goToAddress = () => {
  uni.navigateTo({
    url: '/pages/address/list'
  })
}

// 跳转到优惠券页面
const goToCoupons = () => {
  uni.navigateTo({
    url: '/pages/coupon/list'
  })
}

// 跳转到发票管理页面
const goToInvoice = () => {
  uni.navigateTo({
    url: '/pages/invoice/list'
  })
}

// 跳转到设置页面
const goToSettings = () => {
  uni.navigateTo({
    url: '/pages/settings/index'
  })
}

onMounted(() => {
  userInfo.value = userStore.userInfo
  // TODO: 获取优惠券数量
  couponCount.value = 2 // 临时写死的数据
})
</script>

<style lang="scss">
.mine-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  
  .user-info {
    display: flex;
    align-items: center;
    padding: 40rpx 32rpx;
    background: #fff;
    margin-bottom: 20rpx;
    
    .avatar-wrap {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 24rpx;
      
      .avatar {
        width: 100%;
        height: 100%;
      }
    }
    
    .info-content {
      flex: 1;
      
      .nickname {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 8rpx;
        display: block;
      }
      
      .phone {
        font-size: 26rpx;
        color: #999;
      }
    }
    
    .arrow {
      font-size: 28rpx;
      color: #999;
    }
  }
  
  .menu-list {
    background: #fff;
    
    .menu-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 32rpx;
      border-bottom: 1rpx solid #f5f5f5;
      
      &:last-child {
        border-bottom: none;
      }
      
      .menu-left {
        display: flex;
        align-items: center;
        
        .menu-icon {
          width: 40rpx;
          height: 40rpx;
          margin-right: 20rpx;
        }
        
        .menu-name {
          font-size: 28rpx;
          color: #333;
        }
      }
      
      .arrow {
        font-size: 28rpx;
        color: #999;
      }
      
      &:active {
        background: #f9f9f9;
      }
      
      .count {
        font-size: 24rpx;
        color: #ff6b81;
        margin-right: 10rpx;
      }
    }
  }
}
</style> 