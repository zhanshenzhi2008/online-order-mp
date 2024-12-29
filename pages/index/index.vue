<template>
  <view class="container">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <input type="text" placeholder="搜索" v-model="searchText" />
    </view>
    
    <!-- 轮播图 -->
    <swiper class="banner" 
      indicator-dots 
      autoplay 
      circular
      :indicator-color="'rgba(255, 255, 255, 0.6)'"
      :indicator-active-color="'#ffffff'"
      :interval="3000"
      :duration="500"
    >
      <swiper-item v-for="(item, index) in banners" :key="index">
        <image :src="item.image" mode="aspectFill"></image>
        <view class="banner-title" v-if="item.title">{{item.title}}</view>
      </swiper-item>
    </swiper>
    
    <!-- 配送方式 -->
    <view class="delivery-mode">
      <view 
        class="mode-item" 
        :class="{ active: deliveryMode === 'pickup' }"
        @tap="selectMode('pickup')"
      >
        <image src="/static/images/pickup.png" mode="aspectFit"></image>
        <text>自提</text>
        <text class="desc" @click="goToMenu('selfPickup')">提前下单门店自提</text>
      </view>
      <view 
        class="mode-item takeout" 
        :class="{ active: deliveryMode === 'takeout' }"
        @tap="selectMode('takeout')"
      >
        <image src="/static/images/takeout.png" mode="aspectFit"></image>
        <text>外送</text>
        <text class="desc" @click="goToMenu('delivery')">{{deliveryStore.estimatedTimeText}}</text>
        <text class="address-text" v-if="deliveryMode === 'takeout' && addressStore.currentAddress">
          {{addressStore.formatAddress(addressStore.currentAddress)}}
        </text>
      </view>
    </view>
    
    <!-- 临时内容 -->
    <view class="temp-content">
      <text>功能开发中...</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useDeliveryStore } from '@/stores'
import { useAddressStore } from '@/stores'
import { useMenuStore } from '@/stores'

const searchText = ref('')
const deliveryMode = ref('takeout') // 默认外卖模式
const deliveryStore = useDeliveryStore()
const addressStore = useAddressStore()
const menuStore = useMenuStore()

const banners = ref([
  { 
    image: '/static/images/banner/banner1.png',
    title: '淄博烧烤'
  },
  { 
    image: '/static/images/banner/banner2.png',
    title: '特色美食'
  }
])

// 选择配送方式
const selectMode = (mode) => {
  deliveryMode.value = mode
  // 根据选择的模式跳转到点餐页面
  goToMenu(mode === 'pickup' ? 'selfPickup' : 'delivery')
}

// 跳转到点餐页面
const goToMenu = (type) => {
  // 使用 Pinia store 来存储配送方式
  menuStore.setDeliveryType(type)
  
  uni.switchTab({
    url: '/pages/menu/menu'
  })
}

</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background: #f5f5f5;
}

.search-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  
  input {
    width: 100%;
    height: 72rpx;
    padding: 0 30rpx;
    background: #f5f5f5;
    border-radius: 36rpx;
    font-size: 28rpx;
  }
}

.banner {
  height: 400rpx;
  margin: 100rpx 20rpx 20rpx;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  
  swiper-item {
    position: relative;
  }
  
  image {
    width: 100%;
    height: 100%;
  }
  
  .banner-title {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 20rpx;
    color: #fff;
    font-size: 32rpx;
    font-weight: bold;
    background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
  }
}

.delivery-mode {
  display: flex;
  justify-content: space-between;
  padding: 20rpx;
  background: #fff;
  margin: 0 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
  
  .mode-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx;
    border-radius: 12rpx;
    transition: all 0.3s;
    position: relative;
    
    &.active {
      background: #f8f8f8;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40rpx;
        height: 4rpx;
        background: #ff4d4f;
        border-radius: 2rpx;
      }
    }
    
    &.takeout {
      border-left: 1rpx solid #eee;
    }
    
    image {
      width: 64rpx;
      height: 64rpx;
      margin-bottom: 12rpx;
    }
    
    text {
      font-size: 28rpx;
      
      &.desc {
        font-size: 24rpx;
        color: #999;
        margin-top: 4rpx;
      }
    }
    
    .address-text {
      font-size: 24rpx;
      color: #666;
      margin-top: 8rpx;
      max-width: 90%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.temp-content {
  margin-top: 40rpx;
  text-align: center;
  color: #999;
  font-size: 28rpx;
}
</style> 