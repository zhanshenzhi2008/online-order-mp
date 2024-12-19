<template>
  <view class="mine-container">
    <!-- 用户信息区域 -->
    <view class="user-info" @tap="goToLogin">
      <block v-if="userInfo">
        <image :src="userInfo.avatar" mode="aspectFill" class="avatar"></image>
        <view class="info">
          <text class="nickname">{{userInfo.nickname}}</text>
          <text class="phone">{{userInfo.phone}}</text>
        </view>
      </block>
      <block v-else>
        <image src="/static/images/default-avatar.png" mode="aspectFill" class="avatar"></image>
        <view class="info">
          <text class="login-tip">点击登录</text>
        </view>
      </block>
    </view>

    <!-- 订单区域 -->
    <view class="order-section">
      <view class="section-header">
        <text class="title">我的订单</text>
        <view class="more" @tap="goToOrderList">
          <text>全部订单</text>
          <text class="arrow">></text>
        </view>
      </view>
      <view class="order-types">
        <view class="type-item" 
          v-for="type in orderTypes" 
          :key="type.name"
          @tap="navigateTo(type.url)">
          <image :src="type.icon" mode="aspectFit"></image>
          <text>{{type.name}}</text>
          <text class="badge" v-if="type.count">{{type.count}}</text>
        </view>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="function-list">
      <view class="function-item" 
        v-for="item in functionList" 
        :key="item.name"
        @tap="navigateTo(item.url)">
        <view class="left">
          <image :src="item.icon" mode="aspectFit"></image>
          <text>{{item.name}}</text>
        </view>
        <text class="arrow">></text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

// 订单类型
const orderTypes = ref([
  { name: '待付款', icon: '/static/images/order/pending.png', url: '/pages/order/list?status=pending' },
  { name: '待发货', icon: '/static/images/order/preparing.png', url: '/pages/order/list?status=preparing' },
  { name: '待收货', icon: '/static/images/order/delivering.png', url: '/pages/order/list?status=delivering' },
  { name: '已完成', icon: '/static/images/order/completed.png', url: '/pages/order/list?status=completed' }
])

// 功能列表
const functionList = ref([
  { name: '收货地址', icon: '/static/images/functions/address.png', url: '/pages/address/list' },
  { name: '设置', icon: '/static/images/functions/settings.png', url: '/pages/settings/index' }
])

// 获取用户信息
const getUserInfo = async () => {
  await userStore.getUserInfo()
}

// 去登录
const goToLogin = () => {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({
      url: '/pages/login/login'
    })
  }
}

// 跳转到订单列表
const goToOrderList = () => {
  if (userStore.isLoggedIn) {
    uni.navigateTo({
      url: '/pages/order/list'
    })
  } else {
    goToLogin()
  }
}

// 跳转到指定页面
const navigateTo = (url) => {
  if (userStore.isLoggedIn) {
    uni.navigateTo({ url })
  } else {
    goToLogin()
  }
}

onMounted(() => {
  if (userStore.isLoggedIn) {
    getUserInfo()
  }
})
</script>

<style lang="scss">
.mine-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20rpx;
  
  .user-info {
    display: flex;
    align-items: center;
    padding: 40rpx 30rpx;
    background: #fff;
    margin-bottom: 20rpx;
    
    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      margin-right: 30rpx;
    }
    
    .info {
      .nickname {
        font-size: 32rpx;
        font-weight: bold;
        margin-bottom: 10rpx;
      }
      
      .phone {
        font-size: 28rpx;
        color: #666;
      }
      
      .login-tip {
        font-size: 32rpx;
        color: #999;
      }
    }
  }
  
  .order-section {
    background: #fff;
    margin-bottom: 20rpx;
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 30rpx;
      border-bottom: 1px solid #eee;
      
      .title {
        display: flex;
        align-items: center;
        font-size: 32rpx;
        font-weight: bold;
        height: 44rpx;
        line-height: 44rpx;
      }
      
      .more {
        font-size: 28rpx;
        color: #999;
        
        .arrow {
          margin-left: 10rpx;
        }
      }
    }
    
    .order-types {
      display: flex;
      padding: 30rpx 0;
      
      .type-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        
        image {
          width: 60rpx;
          height: 60rpx;
          margin-bottom: 10rpx;
        }
        
        text {
          font-size: 24rpx;
          color: #333;
        }
        
        .badge {
          position: absolute;
          top: -10rpx;
          right: 50%;
          transform: translateX(20rpx);
          background: #f00;
          color: #fff;
          font-size: 20rpx;
          padding: 0 10rpx;
          border-radius: 20rpx;
          min-width: 30rpx;
          height: 30rpx;
          line-height: 30rpx;
          text-align: center;
        }
      }
    }
  }
  
  .function-list {
    background: #fff;
    
    .function-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 30rpx;
      border-bottom: 1px solid #eee;
      
      .left {
        display: flex;
        align-items: center;
        height: 44rpx;
        
        image {
          width: 40rpx;
          height: 40rpx;
          margin-right: 20rpx;
        }
        
        text {
          font-size: 32rpx;
          font-weight: bold;
          line-height: 44rpx;
          height: 44rpx;
        }
      }
      
      .arrow {
        font-size: 28rpx;
        color: #999;
        line-height: 44rpx;
        height: 44rpx;
      }
    }
  }
}
</style> 