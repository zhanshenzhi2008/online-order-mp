<template>
  <view class="order-container">
    <!-- 主要 Tab 切换 -->
    <view class="main-tab-header">
      <view 
        class="tab-item" 
        :class="{ active: currentTab === 0 }"
        @click="switchMainTab(0)"
      >
        当前订单
      </view>
      <view 
        class="tab-item" 
        :class="{ active: currentTab === 1 }"
        @click="switchMainTab(1)"
      >
        历史订单
      </view>
    </view>

    <!-- 订单列表区域 -->
    <swiper
      class="swiper-content"
      :current="currentTab"
      @change="handleMainSwiperChange"
    >
      <!-- 当前订单列表 -->
      <swiper-item>
        <scroll-view 
          scroll-y 
          class="order-list"
          @scrolltolower="loadMoreCurrent"
        >
          <view v-if="!currentOrders.length" class="empty-state">
            <image 
              class="empty-image" 
              src="/static/images/orders/empty-order.png"
              mode="aspectFit"
            ></image>
            <text class="empty-text">暂无订单</text>
            <button 
              class="go-order-btn" 
              @click="goToMenu"
            >
              去点餐
            </button>
          </view>
          
          <template v-else>
            <view 
              class="order-item" 
              v-for="order in currentOrders" 
              :key="order.id"
            >
              <view class="order-header">
                <text class="order-no">订单号：{{ order.orderNo }}</text>
                <text class="order-status">{{ order.status }}</text>
              </view>
              <view class="goods-list">
                <view 
                  class="goods-item" 
                  v-for="goods in order.goods" 
                  :key="goods.id"
                >
                  <image 
                    :src="goods.image" 
                    mode="aspectFill" 
                    class="goods-image"
                  ></image>
                  <view class="goods-info">
                    <text class="goods-name">{{ goods.name }}</text>
                    <view class="goods-price-wrap">
                      <text class="goods-price">￥{{ goods.price }}</text>
                      <text class="goods-quantity">x{{ goods.quantity }}</text>
                    </view>
                  </view>
                </view>
              </view>
              <view class="order-footer">
                <text class="order-time">{{ order.createTime }}</text>
                <text class="order-amount">合计：￥{{ order.totalAmount }}</text>
              </view>
            </view>
          </template>
        </scroll-view>
      </swiper-item>

      <!-- 历史订单列表 -->
      <swiper-item>
        <!-- 历史订单子分类 Tab -->
        <view class="sub-tab-header">
          <view 
            class="sub-tab-item" 
            v-for="(tab, index) in historyTabs" 
            :key="tab"
            :class="{ active: currentHistoryTab === index }"
            @click="switchHistoryTab(index)"
          >
            {{ tab }}
          </view>
        </view>

        <swiper
          class="history-swiper"
          :current="currentHistoryTab"
          @change="handleHistorySwiperChange"
        >
          <!-- 全部订单 -->
          <swiper-item>
            <scroll-view scroll-y class="order-list" @scrolltolower="loadMoreHistory('all')">
              <view class="order-item" v-for="order in historyOrders.all" :key="order.id">
                <!-- 订单内容结构相同 -->
                <view class="order-header">
                  <text class="order-no">订单号：{{ order.orderNo }}</text>
                  <text class="order-status">{{ order.status }}</text>
                </view>
                <view class="goods-list">
                  <view class="goods-item" v-for="goods in order.goods" :key="goods.id">
                    <image :src="goods.image" mode="aspectFill" class="goods-image"></image>
                    <view class="goods-info">
                      <text class="goods-name">{{ goods.name }}</text>
                      <view class="goods-price-wrap">
                        <text class="goods-price">￥{{ goods.price }}</text>
                        <text class="goods-quantity">x{{ goods.quantity }}</text>
                      </view>
                    </view>
                  </view>
                </view>
                <view class="order-footer">
                  <text class="order-time">{{ order.createTime }}</text>
                  <text class="order-amount">合计：￥{{ order.totalAmount }}</text>
                </view>
              </view>
            </scroll-view>
          </swiper-item>

          <!-- 自取订单 -->
          <swiper-item>
            <scroll-view scroll-y class="order-list" @scrolltolower="loadMoreHistory('selfPickup')">
              <view class="order-item" v-for="order in historyOrders.selfPickup" :key="order.id">
                <!-- 订单内容结构相同 -->
                <view class="order-header">
                  <text class="order-no">订单号：{{ order.orderNo }}</text>
                  <text class="order-status">{{ order.status }}</text>
                </view>
                <view class="goods-list">
                  <view class="goods-item" v-for="goods in order.goods" :key="goods.id">
                    <image :src="goods.image" mode="aspectFill" class="goods-image"></image>
                    <view class="goods-info">
                      <text class="goods-name">{{ goods.name }}</text>
                      <view class="goods-price-wrap">
                        <text class="goods-price">￥{{ goods.price }}</text>
                        <text class="goods-quantity">x{{ goods.quantity }}</text>
                      </view>
                    </view>
                  </view>
                </view>
                <view class="order-footer">
                  <text class="order-time">{{ order.createTime }}</text>
                  <text class="order-amount">合计：￥{{ order.totalAmount }}</text>
                </view>
              </view>
            </scroll-view>
          </swiper-item>

          <!-- 外卖订单 -->
          <swiper-item>
            <scroll-view scroll-y class="order-list" @scrolltolower="loadMoreHistory('delivery')">
              <view class="order-item" v-for="order in historyOrders.delivery" :key="order.id">
                <!-- 订单内容结构相同 -->
                <view class="order-header">
                  <text class="order-no">订单号：{{ order.orderNo }}</text>
                  <text class="order-status">{{ order.status }}</text>
                </view>
                <view class="goods-list">
                  <view class="goods-item" v-for="goods in order.goods" :key="goods.id">
                    <image :src="goods.image" mode="aspectFill" class="goods-image"></image>
                    <view class="goods-info">
                      <text class="goods-name">{{ goods.name }}</text>
                      <view class="goods-price-wrap">
                        <text class="goods-price">￥{{ goods.price }}</text>
                        <text class="goods-quantity">x{{ goods.quantity }}</text>
                      </view>
                    </view>
                  </view>
                </view>
                <view class="order-footer">
                  <text class="order-time">{{ order.createTime }}</text>
                  <text class="order-amount">合计：￥{{ order.totalAmount }}</text>
                </view>
              </view>
            </scroll-view>
          </swiper-item>
        </swiper>
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useOrderStore } from '@/stores'

const orderStore = useOrderStore()
const currentTab = ref(0)
const currentHistoryTab = ref(0)
const currentOrders = ref([])
const historyTabs = ['全部', '自取', '外卖']
const historyOrders = ref({
  all: [],
  selfPickup: [],
  delivery: []
})

// 切换主要 tab
const switchMainTab = (index) => {
  currentTab.value = index
}

// 切换历史订单 tab
const switchHistoryTab = (index) => {
  currentHistoryTab.value = index
}

// 处理主要滑动切换
const handleMainSwiperChange = (e) => {
  currentTab.value = e.detail.current
}

// 处理历史订单滑动切换
const handleHistorySwiperChange = (e) => {
  currentHistoryTab.value = e.detail.current
}

// 加载更多当前订单
const loadMoreCurrent = () => {
  // TODO: 实现加载更多当前订单
}

// 加载更多历史订单
const loadMoreHistory = (type) => {
  // TODO: 根据类型加载不同的历史订单
  console.log('加载更多', type, '订单')
}

// 跳转到点餐页面
const goToMenu = () => {
  uni.switchTab({
    url: '/pages/menu/menu'
  })
}

onMounted(async () => {
  // 测试空状态，将当前订单设为空数组
  currentOrders.value = []

  // 当前订单数据保持不变
  currentOrders.value = [{
    id: 1,
    orderNo: 'ORDER2024001',
    status: '制作中',
    totalAmount: 99.00,
    createTime: '2024-03-20 14:30:00',
    type: 'selfPickup',  // 添加订单类型
    goods: [{
      id: 1,
      name: '烤羊肉串',
      price: 3.00,
      quantity: 10,
      image: '/static/images/goods/yangrou.png'
    }]
  }]

  // 模拟历史订单数据
  const selfPickupOrders = [
    {
      id: 2,
      orderNo: 'ORDER2024002',
      status: '已完成',
      totalAmount: 88.00,
      createTime: '2024-03-19 12:30:00',
      type: 'selfPickup',
      goods: [{
        id: 1,
        name: '烤羊肉串',
        price: 3.00,
        quantity: 8,
        image: '/static/images/goods/yangrou.png'
      }]
    },
    {
      id: 3,
      orderNo: 'ORDER2024003',
      status: '已完成',
      totalAmount: 66.00,
      createTime: '2024-03-18 18:30:00',
      type: 'selfPickup',
      goods: [{
        id: 1,
        name: '烤羊肉串',
        price: 3.00,
        quantity: 6,
        image: '/static/images/goods/yangrou.png'
      }]
    }
  ]

  const deliveryOrders = [
    {
      id: 4,
      orderNo: 'ORDER2024004',
      status: '已完成',
      totalAmount: 108.00,
      createTime: '2024-03-17 19:30:00',
      type: 'delivery',
      goods: [{
        id: 1,
        name: '烤羊肉串',
        price: 3.00,
        quantity: 12,
        image: '/static/images/goods/yangrou.png'
      }]
    },
    {
      id: 5,
      orderNo: 'ORDER2024005',
      status: '已完成',
      totalAmount: 75.00,
      createTime: '2024-03-16 20:30:00',
      type: 'delivery',
      goods: [{
        id: 1,
        name: '烤羊肉串',
        price: 3.00,
        quantity: 15,
        image: '/static/images/goods/yangrou.png'
      }]
    }
  ]

  // 设置历史订单数据
  historyOrders.value = {
    all: [...selfPickupOrders, ...deliveryOrders].sort((a, b) => 
      new Date(b.createTime) - new Date(a.createTime)
    ), // 合并所有订单并按时间排序
    selfPickup: selfPickupOrders,
    delivery: deliveryOrders
  }
})
</script>

<style lang="scss" scoped>
.order-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

.main-tab-header {
  display: flex;
  background: #fff;
  padding: 20rpx 0;
  position: sticky;
  top: 0;
  z-index: 1;

  .tab-item {
    flex: 1;
    text-align: center;
    font-size: 28rpx;
    color: #333;
    position: relative;
    padding: 20rpx 0;

    &.active {
      color: #ff6b81;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40rpx;
        height: 4rpx;
        background: #ff6b81;
        border-radius: 2rpx;
      }
    }
  }
}

.sub-tab-header {
  display: flex;
  background: #fff;
  padding: 10rpx 0;
  border-bottom: 1rpx solid #eee;

  .sub-tab-item {
    flex: 1;
    text-align: center;
    font-size: 26rpx;
    color: #666;
    padding: 16rpx 0;
    position: relative;

    &.active {
      color: #ff6b81;
      font-weight: 500;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 30rpx;
        height: 4rpx;
        background: #ff6b81;
        border-radius: 2rpx;
      }
    }
  }
}

.swiper-content {
  flex: 1;
  height: 0;
}

.history-swiper {
  height: calc(100vh - 180rpx); // 减去主tab和子tab的高度
}

.order-list {
  height: 100%;
  padding: 20rpx;
}

.order-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.order-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #eee;
  
  .order-status {
    color: #ff6b81;
  }
}

.goods-list {
  padding: 20rpx 0;
}

.goods-item {
  display: flex;
  margin-bottom: 20rpx;
  
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
        color: #ff6b81;
        font-size: 26rpx;
      }
      
      .goods-quantity {
        color: #999;
        font-size: 24rpx;
      }
    }
  }
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #eee;
  
  .order-time {
    color: #999;
    font-size: 24rpx;
  }
  
  .order-amount {
    color: #ff6b81;
    font-weight: bold;
  }
}

// 添加空状态样式
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;

  .empty-image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 30rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 40rpx;
  }

  .go-order-btn {
    width: 240rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background: #ff6b81;
    color: #fff;
    border-radius: 40rpx;
    font-size: 28rpx;
    border: none;

    &::after {
      border: none;
    }

    &:active {
      opacity: 0.8;
    }
  }
}
</style> 