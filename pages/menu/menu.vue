<template>
  <view class="menu-container">
    <!-- 轮播图 -->
    <swiper class="banner" :indicator-dots="true" :autoplay="true" interval="3000" duration="1000">
      <swiper-item v-for="(item, index) in banners" :key="index">
        <image :src="item.image" mode="aspectFill"></image>
      </swiper-item>
    </swiper>
    
    <!-- 门店信息 -->
    <view class="store-info" v-if="shopInfo">
      <view class="store-header">
        <view class="store-left" @tap="goToShopList">
          <view class="name-wrap">
            <text class="store-name">{{shopInfo.name}}</text>
            <text class="arrow">></text>
          </view>
          <view class="store-data">
            <text class="rating">★ {{shopInfo.rating}}</text>
            <text class="divider">|</text>
            <text class="monthly-sales">月售 {{shopInfo.monthlySales}}+</text>
          </view>
        </view>
        <view class="store-right">
          <view class="status-tags">
            <view 
              class="status-tag" 
              :class="{ active: deliveryType === 'selfPickup' }"
              @tap="switchDeliveryType('selfPickup')"
            >自提</view>
            <view 
              class="status-tag" 
              :class="{ active: deliveryType === 'delivery' }"
              @tap="switchDeliveryType('delivery')"
            >外卖</view>
          </view>
          <text class="distance">距您{{shopInfo.distance}}km</text>
        </view>
      </view>
      <view class="store-notice">
        <text class="notice-text">{{shopInfo.notice}}</text>
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
    
    <!-- 底部购物车栏 -->
    <view 
      class="cart-bar" 
      v-show="cartTotal > 0"
      @click="showCartPopup"
    >
      <view class="cart-left">
        <view class="cart-icon-wrap" :class="{ 'has-goods': cartTotal > 0 }">
          <image 
            class="cart-icon" 
            src="/static/images/cart/cart.png"
          ></image>
          <text v-if="cartTotal > 0" class="cart-badge">{{ cartTotal }}</text>
        </view>
        <view class="cart-info">
          <text v-if="cartTotal > 0" class="cart-price">￥{{ cartAmount }}</text>
          <text v-else class="cart-empty">购物车是空的</text>
        </view>
      </view>
      <view 
        class="cart-button" 
        :class="{ 'active': cartTotal > 0 }"
        @click.stop="goToPay"
      >
        去支付
      </view>
    </view>

    <!-- 购物车弹出层 -->
    <cart-popup
      ref="cartPopup"
      :cart-list="cartList"
      :delivery-type="deliveryType"
      @update="onCartUpdate"
    />
  </view>
</template>

<script setup>
import { ref, nextTick, onMounted, provide, computed, watch } from 'vue'
import CartBar from '@/components/cart-bar.vue'
import foodItem from '@/components/food-item.vue'
import { foodApi } from '@/utils/api'
import { useShopStore, useCartStore, useOrderStore, useMenuStore } from '@/stores'
import CartPopup from '@/components/cart-popup.vue'

const categories = ref([])
const currentCategory = ref({})
const loading = ref(false)
const refreshing = ref(false)
const scrollTop = ref(0)
const categoryPositions = ref([])
const cartBarRef = ref(null)
const shopStore = useShopStore()
const cartStore = useCartStore()
const orderStore = useOrderStore()
const cartPopup = ref(null)
const menuStore = useMenuStore()
const shopInfo = ref(null)

// 轮播图数据
const banners = ref([
  { image: '/static/images/banner1.jpg' },
  { image: '/static/images/banner2.jpg' },
  { image: '/static/images/banner3.jpg' }
])

// 配送方式
const deliveryType = ref(menuStore.deliveryType) // 从 store 获取初始值

// 监听 menuStore 中配送方式的变化
watch(() => menuStore.deliveryType, (newType) => {
  if (newType !== deliveryType.value) {
    deliveryType.value = newType
  }
})

// 切换配送方式
const switchDeliveryType = (type) => {
  if (deliveryType.value === type) return
  
  // 如果购物车不为空，提示用户
  if (cartTotal.value > 0) {
    uni.showModal({
      title: '切换配送方式',
      content: '切换配送方式将清空购物车，是否继续？',
      success: (res) => {
        if (res.confirm) {
          cartStore.clearCart() // 清空购物车
          deliveryType.value = type
          menuStore.setDeliveryType(type) // 同步到 store
        }
      }
    })
  } else {
    deliveryType.value = type
    menuStore.setDeliveryType(type) // 同步到 store
  }
}

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

// 计算购物车总数
const cartTotal = computed(() => {
  return cartStore.cartList.reduce((total, item) => total + item.quantity, 0)
})

// 计算购物车总金额
const cartAmount = computed(() => {
  return cartStore.cartList.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
})

// 获取购物车列表
const cartList = computed(() => cartStore.cartList)

// 显示购物车弹窗
const showCartPopup = () => {
  if (cartTotal.value > 0) {
    cartPopup.value.open()
  }
}

// 购物车更新回调
const onCartUpdate = () => {
  // 可以在这里处理购物车更新后的逻辑
}

// 去支付
const goToPay = () => {
  if (cartTotal.value > 0) {
    // 创建订单对象
    const order = {
      goods: cartList.value,
      totalAmount: cartAmount.value,
      deliveryType: deliveryType.value,
      createTime: new Date().toISOString(),
      status: '待支付'
    }
    
    // 先设置订单信息，再跳转
    orderStore.setCurrentOrder(order)
    
    uni.navigateTo({
      url: '/pages/order/confirm'
    })
  }
}

// 跳转到门店列表
const goToShopList = () => {
  uni.navigateTo({
    url: '/pages/shop/list'
  })
}

onMounted(async () => {
  loadCategories()
  // 获取门店详情
  shopInfo.value = await shopStore.fetchShopDetail()
})
</script>

<style lang="scss">
.menu-container {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  padding-bottom: calc(v-bind('cartTotal > 0 ? "100rpx" : 0') + constant(safe-area-inset-bottom));
  padding-bottom: calc(v-bind('cartTotal > 0 ? "100rpx" : 0') + env(safe-area-inset-bottom));
  
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
    height: calc(100vh - 240rpx);
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
      padding-bottom: 20rpx;
      
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
      position: relative;
      padding-right: 30rpx;
      
      .name-wrap {
        display: flex;
        align-items: center;
        line-height: 1;
        
        .store-name {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
          line-height: 1;
        }
        
        .arrow {
          font-size: 28rpx;
          color: #666;
          margin-left: 10rpx;
          font-weight: bold;
          line-height: 1;
          display: inline-flex;
          align-items: center;
        }
      }
      
      .store-data {
        margin-top: 8rpx;
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

      &:active {
        opacity: 0.8;
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
          padding: 6rpx 20rpx;
          border-radius: 24rpx;
          background: #f5f5f5;
          color: #666;
          transition: all 0.3s;
          
          &.active {
            color: #fff;
            background: #91683d;
          }
          
          &:active {
            opacity: 0.8;
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

.cart-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: var(--window-bottom);
  height: 100rpx;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 98;

  .cart-left {
    display: flex;
    align-items: center;

    .cart-icon-wrap {
      position: relative;
      margin-right: 20rpx;
      margin-top: -40rpx;
      z-index: 97;

      &.has-goods {
        .cart-icon {
          background: #ff6b81;
        }
      }

      .cart-icon {
        width: 80rpx;
        height: 80rpx;
        padding: 16rpx;
        border-radius: 50%;
        background: #ccc;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
      }

      .cart-badge {
        position: absolute;
        top: -6rpx;
        right: -6rpx;
        min-width: 32rpx;
        height: 32rpx;
        line-height: 32rpx;
        text-align: center;
        background: #ff6b81;
        color: #fff;
        border-radius: 16rpx;
        font-size: 20rpx;
        padding: 0 6rpx;
        z-index: 97;
      }
    }

    .cart-info {
      .cart-price {
        font-size: 32rpx;
        font-weight: bold;
        color: #ff6b81;
      }

      .cart-empty {
        font-size: 28rpx;
        color: #999;
      }
    }
  }
}

.cart-button {
  width: 200rpx;
  height: 72rpx;
  line-height: 72rpx;
  text-align: center;
  background: #ccc;
  color: #fff;
  border-radius: 36rpx;
  font-size: 28rpx;

  &.active {
    background: #ff6b81;
  }
}
</style> 