<template>
  <view class="menu-container">
    <!-- 轮播图 -->
    <swiper class="banner" :indicator-dots="true" :autoplay="true" interval="3000" duration="1000">
      <swiper-item v-for="(item, index) in banners" :key="index">
        <image :src="item.image" mode="aspectFill"></image>
      </swiper-item>
    </swiper>
    
    <!-- 门店信息 -->
    <view class="store-info">
      <view class="store-header">
        <view class="store-left">
          <text class="store-name">{{storeStore.currentStore.name}}</text>
          <view class="store-data">
            <text class="rating">★ {{storeStore.currentStore.rating}}</text>
            <text class="divider">|</text>
            <text class="monthly-sales">月售 {{storeStore.currentStore.monthlySales}}+</text>
          </view>
        </view>
        <view class="store-right">
          <view class="status-tags">
            <text class="status-tag">自取</text>
            <text class="status-tag">外卖</text>
          </view>
          <text class="distance">距您{{storeStore.currentStore.distance}}km</text>
        </view>
      </view>
      <view class="store-notice">
        <text class="notice-text">{{storeStore.currentStore.notice}}</text>
      </view>
    </view>
    
    <!-- 菜品列表区域 -->
    <view class="menu-content">
      <!-- 左侧分类列表 -->
      <scroll-view class="category-list" scroll-y>
        <view 
          class="category-item" 
          v-for="item in categories" 
          :key="item.id"
          :class="{ active: currentCategory.id === item.id }"
          @tap="selectCategory(item)"
        >
          <text>{{item.name}}</text>
        </view>
      </scroll-view>
      
      <!-- 右侧菜品列表 -->
      <scroll-view 
        class="food-list" 
        scroll-y 
        :scroll-top="scrollTop"
        @scroll="onScroll"
        refresher-enabled
        @refresherrefresh="onRefresh"
        :refresher-triggered="refreshing"
      >
        <view class="category-foods" v-for="category in categories" :key="category.id" :id="'category-'+category.id">
          <view class="category-title">{{category.name}}</view>
          <view class="foods-list">
            <food-item 
              v-for="food in category.foods" 
              :key="food.id"
              :food="food"
            ></food-item>
          </view>
        </view>
        
        <!-- 加载提示 -->
        <view class="loading" v-if="loading">
          <uni-load-more status="loading"></uni-load-more>
        </view>
      </scroll-view>
    </view>
    
    <!-- 购物车栏 -->
    <CartBar ref="cartBarRef" />
  </view>
</template>

<script setup>
import { ref, nextTick, onMounted, provide } from 'vue'
import CartBar from '@/components/cart-bar.vue'
import foodItem from '@/components/food-item.vue'
import { foodApi } from '@/utils/api'
import { useStoreStore } from '@/stores'

const categories = ref([])
const currentCategory = ref({})
const loading = ref(false)
const refreshing = ref(false)
const scrollTop = ref(0)
const categoryPositions = ref([])
const cartBarRef = ref(null)
const storeStore = useStoreStore()

// 轮播图数据
const banners = ref([
  { image: '/static/images/banner1.jpg' },
  { image: '/static/images/banner2.jpg' },
  { image: '/static/images/banner3.jpg' }
])

// 加载分类下的菜品
const loadCategoryFoods = async () => {
  for (let category of categories.value) {
    if (!category.foods) {
      try {
        const foodRes = await foodApi.getFoodsByCategory(category.id)
        category.foods = foodRes.data
      } catch (error) {
        console.error(`加载分类 ${category.name} 的菜品失败:`, error)
      }
    }
  }
}

// 计算每个分类的位置
const calculateCategoryPositions = () => {
  categoryPositions.value = categories.value.map(category => {
    const el = document.getElementById(`category-${category.id}`)
    return {
      id: category.id,
      top: el ? el.offsetTop : 0
    }
  })
}

// 加载分类数据
const loadCategories = async () => {
  try {
    loading.value = true
    const res = await foodApi.getCategories()
    categories.value = res.data
    
    // 如果没有当前分类，置第一个为当前分类
    if (!currentCategory.value.id && categories.value.length) {
      currentCategory.value = categories.value[0]
    }
    
    // 加载每个分类的菜品
    await loadCategoryFoods()
    
    // 计算每个分类的位置
    nextTick(() => {
      calculateCategoryPositions()
    })
  } catch (error) {
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 选择分类
const selectCategory = (category) => {
  currentCategory.value = category
  const el = document.getElementById(`category-${category.id}`)
  if (el) {
    scrollTop.value = el.offsetTop
  }
}

// 滚动处理
const onScroll = (e) => {
  const scrollTop = e.detail.scrollTop
  // 根据滚动位置更新当前分类
  for (let i = categoryPositions.value.length - 1; i >= 0; i--) {
    if (scrollTop >= categoryPositions.value[i].top - 10) {
      const category = categories.value.find(c => c.id === categoryPositions.value[i].id)
      if (category && currentCategory.value.id !== category.id) {
        currentCategory.value = category
      }
      break
    }
  }
}

// 刷新
const onRefresh = async () => {
  refreshing.value = true
  try {
    await loadCategories()
  } finally {
    refreshing.value = false
  }
}

// 刷新购物车
const refreshCart = () => {
  if (cartBarRef.value && cartBarRef.value.fetchCartData) {
    cartBarRef.value.fetchCartData()
  }
}

// 将 refreshCart 方法传递给 food-item 组件
provide('refreshCart', refreshCart)

onMounted(() => {
  loadCategories()
  storeStore.fetchStoreDetail() // 获取店铺详细信息
})
</script>

<style lang="scss">
.menu-container {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  
  .banner {
    height: 240rpx;
    flex-shrink: 0;
    
    image {
      width: 100%;
      height: 100%;
    }
  }
  
  .menu-content {
    flex: 1;
    display: flex;
    height: calc(100vh - 240rpx - 100rpx);
    background: #fff;
    
    .category-list {
      width: 180rpx;
      height: 100%;
      background: #fff;
      flex-shrink: 0;
      border-right: 1rpx solid #f5f5f5;
      
      .category-item {
        padding: 32rpx 20rpx;
        text-align: center;
        font-size: 26rpx;
        color: #333;
        position: relative;
        
        &.active {
          color: #91683d;
          font-weight: bold;
          background: #fff;
          
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 6rpx;
            height: 32rpx;
            background: #91683d;
            border-radius: 0 4rpx 4rpx 0;
          }
        }
      }
    }
    
    .food-list {
      flex: 1;
      height: 100%;
      background: #fff;
      
      .category-foods {
        padding: 0 24rpx;
        
        .category-title {
          padding: 24rpx 0;
          font-size: 28rpx;
          color: #333;
          font-weight: bold;
          background: #fff;
          border-bottom: 1rpx solid #f5f5f5;
        }
        
        .foods-list {
          padding: 24rpx 0;
          display: flex;
          flex-direction: column;
          gap: 32rpx;
        }
      }
    }
  }
  
  .loading {
    padding: 20rpx 0;
    text-align: center;
    color: #999;
    font-size: 24rpx;
  }
}

.store-info {
  margin: 0;
  padding: 24rpx 32rpx;
  background: #fff;
  
  .store-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    
    .store-left {
      flex: 1;
      margin-right: 24rpx;
      
      .store-name {
        font-size: 36rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 12rpx;
        display: block;
      }
      
      .store-data {
        display: flex;
        align-items: center;
        font-size: 24rpx;
        color: #666;
        
        .rating {
          color: #ff9900;
        }
        
        .divider {
          margin: 0 12rpx;
          color: #eee;
        }
      }
    }
    
    .store-right {
      text-align: right;
      
      .status-tags {
        display: flex;
        gap: 8rpx;
        margin-bottom: 8rpx;
        justify-content: flex-end;
        
        .status-tag {
          font-size: 22rpx;
          color: #91683d;
          padding: 2rpx 12rpx;
          background: rgba(145, 104, 61, 0.1);
          border-radius: 4rpx;
          
          &.closed {
            color: #999;
            background: rgba(153, 153, 153, 0.1);
          }
        }
      }
      
      .distance {
        font-size: 22rpx;
        color: #999;
      }
    }
  }
  
  .store-notice {
    margin-top: 16rpx;
    display: flex;
    align-items: center;
    
    .notice-text {
      flex: 1;
      font-size: 24rpx;
      color: #666;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .notice-more {
      font-size: 24rpx;
      color: #999;
      margin-left: 8rpx;
    }
  }
}
</style> 