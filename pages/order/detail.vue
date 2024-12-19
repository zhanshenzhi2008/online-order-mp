<template>
  <view class="order-detail" v-if="order">
    <!-- 订单状态 -->
    <view class="status-card">
      <view class="status">{{orderStatusText}}</view>
      <view class="desc">{{orderStatusDesc}}</view>
      <view class="time" v-if="order.estimatedTime">
        预计{{order.estimatedTime}}送达
      </view>
    </view>
    
    <!-- 配送信息 -->
    <view class="delivery-info">
      <view class="address" v-if="order.address">
        <image src="/static/images/location.png"></image>
        <view class="info">
          <view class="user">
            <text>{{order.address.name}}</text>
            <text>{{order.address.phone}}</text>
          </view>
          <view class="detail">{{order.address.detail}}</view>
        </view>
      </view>
      <view class="rider" v-if="order.rider">
        <image :src="order.rider.avatar"></image>
        <view class="info">
          <view class="name">{{order.rider.name}}</view>
          <view class="phone">{{order.rider.phone}}</view>
        </view>
        <button class="call-btn" @tap="callRider">联系骑手</button>
      </view>
    </view>
    
    <!-- 订单内容 -->
    <view class="order-content">
      <view class="shop-name">淄博烧烤</view>
      <view class="food-list">
        <view class="food-item" v-for="item in order.items" :key="item.id">
          <image :src="item.image"></image>
          <view class="info">
            <text class="name">{{item.name}}</text>
            <text class="quantity">x{{item.quantity}}</text>
            <text class="price">¥{{item.price}}</text>
          </view>
        </view>
      </view>
      <view class="price-detail">
        <view class="item">
          <text>商品总价</text>
          <text>¥{{order.total}}</text>
        </view>
        <view class="item">
          <text>配送费</text>
          <text>¥{{order.deliveryFee}}</text>
        </view>
        <view class="total">
          <text>实付款</text>
          <text class="amount">¥{{order.actualTotal || order.total}}</text>
        </view>
      </view>
    </view>
    
    <!-- 订单信息 -->
    <view class="order-info">
      <view class="item">
        <text>订单编号</text>
        <text>{{order.orderNo || order.id}}</text>
      </view>
      <view class="item">
        <text>下单时间</text>
        <text>{{order.createTime}}</text>
      </view>
      <view class="item">
        <text>支付方式</text>
        <text>{{order.paymentMethod || '-'}}</text>
      </view>
    </view>
    
    <!-- 底部按钮 -->
    <view class="bottom-btns">
      <block v-if="order.status === 'pending'">
        <button class="cancel-btn" @tap="cancelOrder">取消订单</button>
        <button class="pay-btn" @tap="payOrder">立即支付</button>
      </block>
      <button class="contact-btn" @tap="contactService">联系客服</button>
    </view>
  </view>
  
  <!-- 加载状态 -->
  <view class="loading" v-else>
    <text>加载中...</text>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { orderApi } from '@/utils/api'

const orderId = ref('')
const order = ref(null)

const orderStatusText = computed(() => {
  const statusMap = {
    pending: '待支付',
    paid: '待接单',
    accepted: '待配送',
    delivering: '配送中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return order.value ? statusMap[order.value.status] : ''
})

const orderStatusDesc = computed(() => {
  const descMap = {
    pending: '请尽快完成支付',
    paid: '商家正在接单中',
    accepted: '商家正在准备中',
    delivering: '骑手正在配送中',
    completed: '订单已完成',
    cancelled: '订单已取消'
  }
  return order.value ? descMap[order.value.status] : ''
})

// 加载订单详情
const loadOrderDetail = async () => {
  if (!orderId.value) return
  
  try {
    const res = await orderApi.getOrderDetail({ id: orderId.value })
    if (res.code === 0) {
      order.value = res.data
    } else {
      throw new Error(res.message || '加载失败')
    }
  } catch (error) {
    uni.showToast({
      title: error.message || '加载失败',
      icon: 'none'
    })
  }
}

// 取消订单
const cancelOrder = async () => {
  uni.showModal({
    title: '提示',
    content: '确定要取消订单吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          const res = await orderApi.cancelOrder(orderId.value)
          if (res.code === 0) {
            uni.showToast({
              title: '已取消订单',
              icon: 'success'
            })
            loadOrderDetail()
          } else {
            throw new Error(res.message || '取消失败')
          }
        } catch (error) {
          uni.showToast({
            title: error.message || '取消失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

// 支付订单
const payOrder = async () => {
  try {
    const res = await orderApi.payOrder(orderId.value)
    if (res.code === 0) {
      uni.showToast({
        title: '支付成功',
        icon: 'success'
      })
      loadOrderDetail()
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

// 联系骑手
const callRider = () => {
  if (order.value && order.value.rider && order.value.rider.phone) {
    uni.makePhoneCall({
      phoneNumber: order.value.rider.phone
    })
  }
}

// 联系客服
const contactService = () => {
  uni.navigateTo({
    url: '/pages/service/index'
  })
}

// 页面加载
onMounted(() => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1]
  if (page.options && page.options.id) {
    orderId.value = page.options.id
    loadOrderDetail()
  } else {
    uni.showToast({
      title: '订单不存在',
      icon: 'none'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
})
</script>

<style lang="scss">
.order-detail {
  min-height: 100vh;
  background: #f8f8f8;
  padding-bottom: 140rpx;
  
  .status-card {
    background: linear-gradient(135deg, #ff4444 0%, #ff6666 100%);
    color: #fff;
    padding: 40rpx 32rpx;
    
    .status {
      font-size: 40rpx;
      font-weight: 600;
      margin-bottom: 16rpx;
    }
    
    .desc {
      font-size: 28rpx;
      opacity: 0.9;
    }
    
    .time {
      font-size: 26rpx;
      margin-top: 24rpx;
      opacity: 0.8;
    }
  }
  
  .delivery-info {
    margin: 24rpx 24rpx 0;
    background: #fff;
    border-radius: 16rpx;
    padding: 32rpx;
    box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.03);
    
    .address {
      display: flex;
      align-items: flex-start;
      padding-bottom: 32rpx;
      margin-bottom: 32rpx;
      border-bottom: 2rpx solid #f5f5f5;
      
      image {
        width: 44rpx;
        height: 44rpx;
        margin-right: 24rpx;
      }
      
      .info {
        flex: 1;
        
        .user {
          font-size: 30rpx;
          font-weight: 500;
          margin-bottom: 12rpx;
          
          text:first-child {
            margin-right: 24rpx;
          }
          
          text:last-child {
            color: #666;
          }
        }
        
        .detail {
          font-size: 26rpx;
          color: #666;
          line-height: 1.5;
        }
      }
    }
    
    .rider {
      display: flex;
      align-items: center;
      
      image {
        width: 88rpx;
        height: 88rpx;
        border-radius: 50%;
        margin-right: 24rpx;
        border: 2rpx solid #f5f5f5;
      }
      
      .info {
        flex: 1;
        
        .name {
          font-size: 30rpx;
          font-weight: 500;
          margin-bottom: 8rpx;
        }
        
        .phone {
          font-size: 26rpx;
          color: #666;
        }
      }
      
      .call-btn {
        font-size: 26rpx;
        color: #ff4444;
        background: rgba(255,68,68,0.1);
        border: none;
        border-radius: 32rpx;
        padding: 12rpx 32rpx;
        
        &:active {
          background: rgba(255,68,68,0.2);
        }
      }
    }
  }
  
  .order-content {
    margin: 24rpx 24rpx 0;
    background: #fff;
    border-radius: 16rpx;
    padding: 32rpx;
    box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.03);
    
    .shop-name {
      font-size: 34rpx;
      font-weight: 600;
      margin-bottom: 32rpx;
      display: flex;
      align-items: center;
      
      &::before {
        content: '';
        width: 6rpx;
        height: 32rpx;
        background: #ff4444;
        margin-right: 16rpx;
        border-radius: 4rpx;
      }
    }
    
    .food-list {
      .food-item {
        display: flex;
        align-items: center;
        margin-bottom: 32rpx;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        image {
          width: 140rpx;
          height: 140rpx;
          border-radius: 12rpx;
          margin-right: 24rpx;
          background: #f8f8f8;
        }
        
        .info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 140rpx;
          padding: 8rpx 0;
          
          .name {
            font-size: 30rpx;
            font-weight: 500;
            margin-bottom: 8rpx;
          }
          
          .quantity {
            font-size: 26rpx;
            color: #999;
          }
          
          .price {
            font-size: 34rpx;
            color: #ff4444;
            font-weight: 500;
            
            &::before {
              content: '¥';
              font-size: 24rpx;
              margin-right: 4rpx;
            }
          }
        }
      }
    }
    
    .price-detail {
      margin-top: 32rpx;
      padding-top: 32rpx;
      border-top: 2rpx solid #f5f5f5;
      
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 28rpx;
        color: #666;
        margin-bottom: 20rpx;
        
        text:last-child {
          font-weight: 500;
          color: #333;
        }
      }
      
      .total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 32rpx;
        font-weight: 600;
        margin-top: 24rpx;
        padding-top: 24rpx;
        border-top: 2rpx solid #f5f5f5;
        
        .amount {
          color: #ff4444;
          font-size: 36rpx;
          
          &::before {
            content: '¥';
            font-size: 28rpx;
            margin-right: 4rpx;
          }
        }
      }
    }
  }
  
  .order-info {
    margin: 24rpx 24rpx 0;
    background: #fff;
    border-radius: 16rpx;
    padding: 32rpx;
    box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.03);
    
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 28rpx;
      margin-bottom: 24rpx;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      text:first-child {
        color: #666;
      }
      
      text:last-child {
        color: #333;
        font-weight: 500;
      }
    }
  }
  
  .bottom-btns {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 20rpx 24rpx;
    background: #fff;
    box-shadow: 0 -2rpx 20rpx rgba(0,0,0,0.05);
    
    button {
      margin-left: 24rpx;
      font-size: 28rpx;
      padding: 20rpx 44rpx;
      border-radius: 40rpx;
      font-weight: 500;
      
      &.cancel-btn {
        color: #666;
        background: #f5f5f5;
        
        &:active {
          background: #eee;
        }
      }
      
      &.pay-btn {
        color: #fff;
        background: linear-gradient(135deg, #ff4444 0%, #ff6666 100%);
        
        &:active {
          opacity: 0.9;
        }
      }
      
      &.contact-btn {
        color: #ff4444;
        background: rgba(255,68,68,0.1);
        border: none;
        
        &:active {
          background: rgba(255,68,68,0.2);
        }
      }
    }
  }
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #fff;
  
  text {
    font-size: 28rpx;
    color: #999;
  }
}
</style> 