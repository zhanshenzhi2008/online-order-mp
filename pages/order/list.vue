<template>
  <view class="order-list">
    <!-- 状态切换 -->
    <scroll-view class="status-tabs" scroll-x>
      <view 
        class="tab-item" 
        v-for="(item, index) in tabs" 
        :key="index"
        :class="{ active: currentTab === index }"
        @tap="changeTab(index)"
      >
        <text>{{item.name}}</text>
      </view>
    </scroll-view>
    
    <!-- 订单列表 -->
    <scroll-view 
      class="order-scroll" 
      scroll-y 
      refresher-enabled
      @refresherrefresh="onRefresh"
      :refresher-triggered="refreshing"
    >
      <view class="order-item" 
            v-for="item in orderList" 
            :key="item.id"
            @tap="goToDetail(item)">
        <!-- 订单头部 -->
        <view class="header">
          <view class="shop">
            <image src="/static/images/orders/shop-logo.png"></image>
            <text>淄博烧烤</text>
          </view>
          <text class="status">{{item.statusText}}</text>
        </view>
        
        <!-- 商品列表 -->
        <view class="goods-list">
          <view class="goods-item" v-for="food in item.items" :key="food.id">
            <image :src="food.image" mode="aspectFill"></image>
            <view class="info">
              <text class="name">{{food.name}}</text>
              <view class="price-wrap">
                <text class="price">¥{{food.price}}</text>
                <text class="quantity">x{{food.quantity}}</text>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 订单信息 -->
        <view class="order-info">
          <text class="time">{{item.createTime}}</text>
          <view class="total">
            共{{item.totalCount}}件商品，实付
            <text class="amount">¥{{item.actualTotal}}</text>
          </view>
        </view>
        
        <!-- 订单操作 -->
        <view class="actions">
          <block v-if="item.status === 'unpaid'">
            <button class="btn plain" @tap.stop="cancelOrder(item)">取消订单</button>
            <button class="btn primary" @tap.stop="payOrder(item)">立即支付</button>
          </block>
          <block v-else-if="item.status === 'delivering'">
            <button class="btn primary" @tap.stop="confirmOrder(item)">确认收货</button>
          </block>
          <block v-else-if="item.status === 'completed'">
            <button class="btn plain" @tap.stop="deleteOrder(item)">删除订单</button>
            <button class="btn primary" @tap.stop="reorder(item)">再来一单</button>
          </block>
          <button class="btn plain" @tap.stop="goToDetail(item)">订单详情</button>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view class="empty" v-if="!loading && !orderList.length">
        <image src="/static/images/orders/empty-order.png"></image>
        <text>暂无相关订单</text>
      </view>
      
      <!-- 加载状态 -->
      <view class="loading" v-if="loading">
        <view class="loading-text">正在加载...</view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { orderApi, cartApi } from '@/utils/api'

const orderList = ref([])
const loading = ref(false)
const refreshing = ref(false)
const currentTab = ref(0)

const tabs = [
  { name: '全部', status: '' },
  { name: '待付款', status: 'pending' },
  { name: '待发货', status: 'paid' },
  { name: '待收货', status: 'delivering' },
  { name: '已完成', status: 'completed' }
]

// 下拉刷新
const onRefresh = async () => {
  refreshing.value = true
  try {
    await fetchOrders(tabs[currentTab.value].status)
  } finally {
    refreshing.value = false
  }
}

// 获取订单列表
const fetchOrders = async (status = '') => {
  loading.value = true
  try {
    const res = await orderApi.getOrders({ status })
    if (res.code === 0) {
      orderList.value = res.data
    } else {
      throw new Error(res.message || '获取订单列表失败')
    }
  } catch (error) {
    uni.showToast({
      title: error.message || '获取订单列表失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

const changeTab = (index) => {
  currentTab.value = index
  fetchOrders(tabs[index].status)
}

const cancelOrder = async (order) => {
  try {
    const res = await orderApi.cancelOrder(order.id)
    if (res.code === 0) {
      uni.showToast({
        title: '取消成功',
        icon: 'success'
      })
      await fetchOrders(tabs[currentTab.value].status)
    } else {
      throw new Error(res.message || '取消订单失败')
    }
  } catch (error) {
    uni.showToast({
      title: error.message || '取消订单失败',
      icon: 'none'
    })
  }
}

const payOrder = async (order) => {
  try {
    const res = await orderApi.payOrder(order.id)
    if (res.code === 0) {
      uni.showToast({
        title: '支付成功',
        icon: 'success'
      })
      await fetchOrders(tabs[currentTab.value].status)
    } else {
      throw new Error(res.message || '支付失败')
    }
  } catch (error) {
    uni.showToast({
      title: error.message || '支付失败',
      icon: 'none'
    })
  }
}

const confirmOrder = async (order) => {
  try {
    const res = await orderApi.confirmOrder(order.id)
    if (res.code === 0) {
      uni.showToast({
        title: '确认收货成功',
        icon: 'success'
      })
      await fetchOrders(tabs[currentTab.value].status)
    } else {
      throw new Error(res.message || '确认收货失败')
    }
  } catch (error) {
    uni.showToast({
      title: error.message || '确认收货失败',
      icon: 'none'
    })
  }
}

const reorder = async (order) => {
  try {
    // 将订单中的商品添加到购物车
    for (const item of order.items) {
      await cartApi.addToCart({
        foodId: item.foodId,
        quantity: item.quantity,
        specs: item.specs,
        additions: item.additions
      })
    }
    uni.showToast({
      title: '已添加到购物车',
      icon: 'success'
    })
    uni.switchTab({
      url: '/pages/cart/cart'
    })
  } catch (error) {
    uni.showToast({
      title: error.message || '添加到购物车失败',
      icon: 'none'
    })
  }
}

// 跳转到订单详情页
const goToDetail = (order) => {
  uni.navigateTo({
    url: `/pages/order/detail?id=${order.id}`
  })
}

onMounted(() => {
  fetchOrders()
})
</script>

<style lang="scss">
@mixin text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-list {
  min-height: 100vh;
  background: #f8f8f8;
  
  .status-tabs {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    background: #fff;
    white-space: nowrap;
    border-bottom: 2rpx solid #f5f5f5;
    box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.03);
    
    .tab-item {
      display: inline-block;
      padding: 28rpx 40rpx;
      font-size: 28rpx;
      color: #666;
      position: relative;
      transition: all 0.3s;
      
      &.active {
        color: #ff4444;
        font-weight: 500;
        
        &::after {
          content: '';
          position: absolute;
          left: 40rpx;
          right: 40rpx;
          bottom: 0;
          height: 4rpx;
          background: #ff4444;
          border-radius: 2rpx;
        }
      }
    }
  }
  
  .order-scroll {
    height: calc(100vh - 88rpx);
    margin-top: 88rpx;
    padding: 20rpx;
  }
  
  .order-item {
    background: #fff;
    border-radius: 12rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.02);
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 24rpx;
      border-bottom: 1rpx solid #f5f5f5;
      
      .shop {
        display: flex;
        align-items: center;
        
        image {
          width: 36rpx;
          height: 36rpx;
          margin-right: 12rpx;
          border-radius: 6rpx;
        }
        
        text {
          font-size: 28rpx;
          font-weight: 500;
          color: #333;
        }
      }
      
      .status {
        font-size: 26rpx;
        color: #ff4444;
        font-weight: 400;
      }
    }
    
    .goods-list {
      padding: 24rpx;
      
      .goods-item {
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        image {
          width: 120rpx;
          height: 120rpx;
          border-radius: 8rpx;
          margin-right: 20rpx;
          background: #f8f8f8;
        }
        
        .info {
          flex: 1;
          min-width: 0;
          
          .name {
            font-size: 28rpx;
            font-weight: 400;
            color: #333;
            margin-bottom: 12rpx;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          
          .price-wrap {
            display: flex;
            align-items: center;
            justify-content: space-between;
            
            .price {
              font-size: 28rpx;
              color: #ff4444;
              font-weight: 500;
              
              &::before {
                content: '¥';
                font-size: 24rpx;
                margin-right: 2rpx;
              }
            }
            
            .quantity {
              font-size: 24rpx;
              color: #999;
            }
          }
        }
      }
    }
    
    .order-info {
      padding: 20rpx 24rpx;
      border-top: 1rpx solid #f5f5f5;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .time {
        font-size: 24rpx;
        color: #999;
      }
      
      .total {
        font-size: 24rpx;
        color: #666;
        
        .amount {
          font-size: 28rpx;
          color: #ff4444;
          font-weight: 500;
          margin-left: 4rpx;
          
          &::before {
            content: '¥';
            font-size: 24rpx;
            margin-right: 2rpx;
          }
        }
      }
    }
    
    .actions {
      padding: 16rpx 24rpx;
      border-top: 1rpx solid #f5f5f5;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      
      .btn {
        margin-left: 16rpx;
        font-size: 24rpx;
        padding: 10rpx 24rpx;
        border-radius: 28rpx;
        font-weight: 400;
        
        &.plain {
          color: #666;
          background: #f8f8f8;
          border: 1rpx solid #eee;
          
          &:active {
            background: #f5f5f5;
          }
        }
        
        &.primary {
          color: #fff;
          background: #ff4444;
          
          &:active {
            opacity: 0.9;
          }
        }
      }
    }
  }
  
  .empty {
    padding: 120rpx 0;
    text-align: center;
    
    image {
      width: 200rpx;
      height: 200rpx;
      margin-bottom: 20rpx;
    }
    
    text {
      font-size: 26rpx;
      color: #999;
    }
  }
  
  .loading {
    padding: 24rpx;
    text-align: center;
    
    .loading-text {
      color: #999;
      font-size: 26rpx;
    }
  }
}
</style> 