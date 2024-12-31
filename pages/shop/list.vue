<script setup>
import { ref, onMounted } from 'vue'
import { useShopStore, useMenuStore } from '@/stores'
import { shopApi } from '@/utils/api'

const shopList = ref([])
const shopStore = useShopStore()
const menuStore = useMenuStore()

// 获取门店列表数据
const getShopList = async () => {
  try {
    uni.showLoading({
      title: '加载中...'
    })
    const res = await shopApi.getShopList()
    if (res.code === 0) {
      shopList.value = res.data
    } else {
      uni.showToast({
        title: res.message || '获取门店列表失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('获取门店列表失败:', error)
    uni.showToast({
      title: '获取门店列表失败',
      icon: 'none'
    })
  } finally {
    uni.hideLoading()
  }
}

// 选择门店
const selectShop = (shop) => {
  // 设置当前门店
  shopStore.setCurrentShop(shop)
  // 设置配送方式为外卖
  menuStore.setDeliveryType('delivery')
  // 跳转到点餐页面
  uni.switchTab({
    url: '/pages/menu/menu'
  })
}

// 页面加载时获取数据
onMounted(() => {
  getShopList()
})
</script>

<template>
  <view class="shop-list">
    <view class="shop-items">
      <view 
        class="shop-item" 
        v-for="shop in shopList" 
        :key="shop.id"
        @tap="selectShop(shop)"
      >
        <view class="shop-info">
          <text class="shop-name">{{ shop.name }}</text>
          <view class="shop-data">
            <text class="rating">★ {{ shop.rating }}</text>
            <text class="divider">|</text>
            <text class="monthly-sales">月售 {{ shop.monthlySales }}+</text>
          </view>
          <view class="shop-address">
            <text>{{ shop.address }}</text>
            <text class="distance">{{ shop.distance }}km</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.shop-list {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
  
  .shop-items {
    .shop-item {
      background: #fff;
      border-radius: 12rpx;
      padding: 30rpx;
      margin-bottom: 20rpx;
      
      .shop-info {
        .shop-name {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 12rpx;
          display: block;
        }
        
        .shop-data {
          display: flex;
          align-items: center;
          font-size: 24rpx;
          color: #666;
          margin-bottom: 12rpx;
          
          .rating {
            color: #ff9900;
          }
          
          .divider {
            margin: 0 12rpx;
            color: #eee;
          }
        }
        
        .shop-address {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 24rpx;
          color: #999;
          
          .distance {
            color: #666;
          }
        }
      }
      
      &:active {
        opacity: 0.8;
      }
    }
  }
}
</style> 