<template>
  <view class="order-list">
    <!-- 使用虚拟列表优化长列表性能 -->
    <recycle-list
      :items="orderList"
      :item-size="120"
      :buffer-size="5"
    >
      <template #item="{ item }">
        <order-item :order="item" />
      </template>
    </recycle-list>
  </view>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'
import { orderApi, cartApi } from '@/utils/api'

const orderList = ref([])
const loading = ref(false)
const refreshing = ref(false)
const currentTab = ref(0)
const scrollHeight = ref(0)

const tabs = [
  { name: '全部', status: '' },
  { name: '待付款', status: 'pending' },
  { name: '待发货', status: 'paid' },
  { name: '待收货', status: 'delivering' },
  { name: '已完成', status: 'completed' }
]

// 计算滚动区域高度
const calcScrollHeight = () => {
  const systemInfo = uni.getSystemInfoSync()
  const tabsHeight = 88 // tabs的高度，单位rpx
  // 将rpx转换为px
  const tabsHeightPx = (tabsHeight * systemInfo.windowWidth) / 750
  scrollHeight.value = systemInfo.windowHeight - tabsHeightPx
}

onBeforeMount(() => {
  calcScrollHeight()
})

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

// 获取配送方式文本
const getDeliveryTypeText = (type) => {
  const typeMap = {
    delivery: '外卖配送',
    selfPickup: '到店自取'
  }
  return typeMap[type] || type
}

// 获取就餐方式文本
const getPickupTypeText = (type) => {
  const typeMap = {
    dineIn: '堂食',
    takeout: '打包'
  }
  return typeMap[type] || type
}

onMounted(() => {
  fetchOrders()
})
</script>

<style lang="scss">
.order-list {
  min-height: 100vh;
  background: #f8f8f8;
  padding-bottom: 20rpx;
  
  .status-tabs {
    position: fixed;
    top: 0;
    left: 0;
    right: 20rpx;
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
    padding-right: 40rpx;
    box-sizing: border-box;
    
    .order-item {
      background: #fff;
      border-radius: 12rpx;
      margin-bottom: 20rpx;
      padding: 20rpx;
      
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
          
          .order-type {
            display: flex;
            align-items: center;
            margin-left: 20rpx;
            
            .type-tag {
              font-size: 22rpx;
              color: #91683d;
              background: #f8f4ef;
              padding: 4rpx 12rpx;
              border-radius: 16rpx;
              margin-right: 12rpx;
              
              &:last-child {
                margin-right: 0;
              }
            }
          }
        }
        
        .status {
          font-size: 26rpx;
          color: #ff4444;
          font-weight: 400;
          margin-left: auto;
          padding-left: 20rpx;
          flex-shrink: 0;
        }
      }
      
      .goods-list {
        padding: 24rpx;
        
        .goods-item {
          display: flex;
          align-items: center;
          margin-bottom: 20rpx;
          width: 100%;
          box-sizing: border-box;
          
          image {
            width: 120rpx;
            height: 120rpx;
            border-radius: 8rpx;
            margin-right: 20rpx;
            background: #f8f8f8;
            flex-shrink: 0;
          }
          
          .info {
            flex: 1;
            min-width: 0;
            margin-right: 20rpx;
            
            .name {
              font-size: 28rpx;
              font-weight: 400;
              color: #333;
              margin-bottom: 12rpx;
              @include text-ellipsis;
            }
            
            .price-wrap {
              display: flex;
              align-items: center;
              
              .price {
                font-size: 28rpx;
                color: #ff4444;
                font-weight: 500;
                flex-shrink: 0;
                
                &::before {
                  content: '¥';
                  font-size: 24rpx;
                  margin-right: 2rpx;
                }
              }
              
              .quantity {
                font-size: 24rpx;
                color: #999;
                margin-left: auto;
                padding-left: 20rpx;
                flex-shrink: 0;
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
        width: 100%;
        box-sizing: border-box;
        
        .time {
          font-size: 24rpx;
          color: #999;
          flex-shrink: 0;
        }
        
        .total {
          font-size: 24rpx;
          color: #666;
          margin-left: auto;
          padding-left: 20rpx;
          flex-shrink: 0;
          text-align: right;
          
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
        flex-wrap: wrap;
        gap: 16rpx;
        width: 100%;
        box-sizing: border-box;
        
        .btn {
          font-size: 24rpx;
          padding: 10rpx 24rpx;
          border-radius: 28rpx;
          font-weight: 400;
          white-space: nowrap;
          flex-shrink: 0;
          
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
  }
}

// 添加文本溢出省略号的 mixin
@mixin text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 修改滚动条样式
::-webkit-scrollbar {
  width: 0;
  height: 0;
  background: transparent;
}
</style> 