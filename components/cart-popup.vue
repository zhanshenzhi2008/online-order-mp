<template>
  <uni-popup ref="popup" type="bottom" background-color="#fff">
    <view class="cart-popup">
      <view class="popup-header">
        <view class="header-left">
          <text class="title">购物车</text>
          <text class="delivery-type">({{ deliveryType === 'selfPickup' ? '自取' : '外卖' }})</text>
        </view>
        <view class="clear" @click="handleClear">
          <image 
            class="clear-icon" 
            src="/static/images/cart/clear-cart.png"
          ></image>
          <text>清空</text>
        </view>
      </view>
      
      <scroll-view 
        scroll-y 
        class="cart-list"
      >
        <view 
          class="cart-item"
          v-for="item in cartList"
          :key="item.id"
        >
          <image 
            :src="item.image" 
            class="goods-image"
            mode="aspectFill"
          ></image>
          <view class="goods-info">
            <text class="goods-name">{{ item.name }}</text>
            <text class="goods-price">￥{{ item.price }}</text>
          </view>
          <view class="goods-control">
            <text 
              class="minus" 
              @click="handleUpdateQuantity(item, -1)"
            >-</text>
            <text class="quantity">{{ item.quantity }}</text>
            <text 
              class="plus"
              @click="handleUpdateQuantity(item, 1)"
            >+</text>
          </view>
        </view>
      </scroll-view>
    </view>
  </uni-popup>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores'

const props = defineProps({
  cartList: {
    type: Array,
    default: () => []
  },
  deliveryType: {
    type: String,
    default: 'selfPickup'
  }
})

const emit = defineEmits(['update'])
const popup = ref(null)
const cartStore = useCartStore()

// 打开弹窗
const open = () => {
  popup.value.open()
}

// 关闭弹窗
const close = () => {
  popup.value.close()
}

// 更新商品数量
const handleUpdateQuantity = (item, delta) => {
  cartStore.updateCartItem({
    ...item,
    quantity: item.quantity + delta
  })
  emit('update')
}

// 清空购物车
const handleClear = () => {
  cartStore.clearCart()
  emit('update')
  close()
}

// 暴露方法给父组件
defineExpose({
  open,
  close
})
</script>

<style lang="scss">
// 先定义 mixin
@mixin text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cart-popup {
  min-height: 400rpx;
  max-height: 800rpx;
  border-radius: 24rpx 24rpx 0 0;
  overflow: hidden;

  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #eee;

    .header-left {
      display: flex;
      align-items: center;
      
      .title {
        font-size: 32rpx;
        font-weight: bold;
      }
      
      .delivery-type {
        font-size: 24rpx;
        color: #666;
        margin-left: 12rpx;
      }
    }

    .clear {
      display: flex;
      align-items: center;
      color: #999;
      font-size: 24rpx;

      .clear-icon {
        width: 32rpx;
        height: 32rpx;
        margin-right: 8rpx;
      }
    }
  }

  .cart-list {
    max-height: 600rpx;
    padding: 20rpx 30rpx;

    .cart-item {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #eee;

      .goods-image {
        width: 120rpx;
        height: 120rpx;
        border-radius: 12rpx;
        margin-right: 20rpx;
        flex-shrink: 0;
      }

      .goods-info {
        flex: 1;
        min-width: 0;
        margin-right: 20rpx;

        .goods-name {
          font-size: 28rpx;
          color: #333;
          margin-bottom: 10rpx;
          @include text-ellipsis;
        }

        .goods-price {
          font-size: 32rpx;
          color: #ff6b81;
          font-weight: bold;
        }
      }

      .goods-control {
        display: flex;
        align-items: center;
        width: 180rpx;
        padding-right: 30rpx;
        flex-shrink: 0;

        .minus,
        .plus {
          width: 48rpx;
          height: 48rpx;
          line-height: 48rpx;
          text-align: center;
          border: 1rpx solid #eee;
          border-radius: 50%;
          color: #666;
          background: #fff;
          z-index: 1;
          flex-shrink: 0;
        }

        .quantity {
          flex: 1;
          text-align: center;
          font-size: 28rpx;
          padding: 0 10rpx;
        }
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style> 