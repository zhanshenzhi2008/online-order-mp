<template>
  <view class="mine-container">
    <!-- 用户信息区域 -->
    <view class="user-info" @tap="goToLogin">
      <view class="avatar-wrap" @tap.stop="chooseAvatar">
        <image 
          class="avatar" 
          :src="userInfo && userInfo.avatar ? userInfo.avatar : '/static/images/mine/default-avatar.png'" 
          mode="aspectFill"
        ></image>
        <view class="upload-mask">
          <image 
            class="upload-icon" 
            src="/static/images/mine/camera.png" 
            mode="aspectFit"
          ></image>
        </view>
      </view>
      <view class="info-content">
        <text class="nickname">{{ userInfo && userInfo.nickname ? userInfo.nickname : '点击登录' }}</text>
        <text class="phone" v-if="userInfo && userInfo.phone">{{ userInfo.phone }}</text>
      </view>
      <text class="arrow">></text>
    </view>

    <!-- 功能列表 -->
    <view class="menu-cards">
      <view class="menu-card" @tap="goToAddress">
        <view class="card-content">
          <image class="card-icon" src="/static/images/mine/address.png"></image>
          <text class="card-name">收货地址</text>
          <text class="card-desc">管理收货地址</text>
        </view>
      </view>

      <view class="menu-card" @tap="goToCoupons">
        <view class="card-content">
          <image class="card-icon" src="/static/images/mine/coupon.png"></image>
          <text class="card-name">优惠券</text>
          <text class="card-desc" v-if="couponCount">{{ couponCount }}张可用</text>
          <text class="card-desc" v-else>暂无可用</text>
        </view>
      </view>

      <view class="menu-card" @tap="goToInvoice">
        <view class="card-content">
          <image class="card-icon" src="/static/images/mine/invoice.png"></image>
          <text class="card-name">发票管理</text>
          <text class="card-desc">开具发票</text>
        </view>
      </view>

      <view class="menu-card" @tap="goToSettings">
        <view class="card-content">
          <image class="card-icon" src="/static/images/mine/settings.png"></image>
          <text class="card-name">设置</text>
          <text class="card-desc">账号设置</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores'
import { userApi } from '@/utils/api'

const userStore = useUserStore()
const userInfo = ref(null)
const couponCount = ref(0) // 可用优惠券数量

// 选择头像
const chooseAvatar = async (e) => {
  e.stopPropagation() // 阻止事件冒泡，避免触发登录
  
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0]
      
      try {
        uni.showLoading({
          title: '上传中...',
          mask: true
        })
        
        const uploadRes = await userApi.uploadAvatar(tempFilePath)
        if (uploadRes.code === 0) {
          userInfo.value = {
            ...userInfo.value,
            avatar: uploadRes.data.url
          }
          userStore.updateUserInfo(userInfo.value)
          
          uni.showToast({
            title: '上传成功',
            icon: 'success'
          })
        } else {
          throw new Error(uploadRes.message)
        }
      } catch (error) {
        uni.showToast({
          title: error.message || '上传失败',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    }
  })
}

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
      position: relative;
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 24rpx;
      background: #f5f5f5;
      
      .avatar {
        width: 100%;
        height: 100%;
        background: #f5f5f5;
      }
      
      .upload-mask {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 36rpx;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        
        .upload-icon {
          width: 24rpx;
          height: 24rpx;
          display: block;
        }
      }
      
      &:active {
        opacity: 0.8;
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
  
  .menu-cards {
    padding: 20rpx;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;
    
    .menu-card {
      background: #fff;
      border-radius: 16rpx;
      padding: 30rpx;
      display: flex;
      align-items: center;
      position: relative;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
      min-height: 180rpx; // 设置最小高度
      
      .card-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 0; // 移除内边距
        
        .card-icon {
          width: 56rpx;
          height: 56rpx;
          margin-bottom: 16rpx;
        }
        
        .card-name {
          font-size: 28rpx;
          color: #333;
          font-weight: bold;
          margin-bottom: 8rpx;
        }
        
        .card-desc {
          font-size: 24rpx;
          color: #999;
          
          &.highlight {
            color: #ff6b81;
          }
        }
      }
      
      &:active {
        transform: scale(0.98);
        opacity: 0.9;
      }
    }
  }
}
</style> 