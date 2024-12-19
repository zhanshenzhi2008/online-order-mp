<template>
  <view class="food-item">
    <image class="food-image" :src="food.image" mode="aspectFill"></image>
    <view class="food-content">
      <text class="food-name">{{food.name}}</text>
      <text class="food-desc" v-if="food.description">{{food.description}}</text>
      <view class="tags" v-if="food.tags && food.tags.length">
        <text 
          class="tag" 
          v-for="(tag, index) in food.tags" 
          :key="index"
        >{{tag}}</text>
      </view>
      <view class="bottom-row">
        <view class="price">
          <text class="symbol">¥</text>
          <text class="amount">{{food.price}}</text>
        </view>
        <view class="quantity-control" v-if="quantity > 0">
          <button class="control-btn minus" @tap.stop="handleRemove">
            <text class="icon">-</text>
          </button>
          <text class="quantity">{{quantity}}</text>
          <button class="control-btn plus" @tap.stop="handleAdd">
            <text class="icon">+</text>
          </button>
        </view>
        <button v-else class="add-btn" @tap.stop="handleAdd">
          <text class="icon">+</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { cartApi } from '@/utils/api'

const props = defineProps({
  food: {
    type: Object,
    required: true
  }
})

const quantity = ref(0)

const refreshCart = inject('refreshCart')

// 获取当前菜品在购物车中的数量
const getCartQuantity = async () => {
  try {
    const res = await cartApi.getCartList()
    if (res.code === 0) {
      const cartItem = res.data.find(item => item.food_id === props.food.id)
      quantity.value = cartItem ? cartItem.quantity : 0
    }
  } catch (error) {
    console.error(error)
  }
}

const handleAdd = async () => {
  try {
    const res = await cartApi.addToCart({
      food_id: props.food.id,
      quantity: 1
    })
    if (res.code === 0) {
      quantity.value = res.data.quantity
      uni.showToast({
        title: '已添加',
        icon: 'success'
      })
      if (refreshCart) {
        refreshCart()
      }
    } else {
      throw new Error(res.message || '添加失败')
    }
  } catch (error) {
    uni.showToast({
      title: error.message || '添加失败',
      icon: 'none'
    })
  }
}

const handleRemove = async () => {
  if (quantity.value <= 0) return
  
  try {
    const res = await cartApi.decrease({
      food_id: props.food.id
    })
    if (res.code === 0) {
      quantity.value = res.data.quantity
      if (refreshCart) {
        refreshCart()
      }
    } else {
      throw new Error(res.message || '操作失败')
    }
  } catch (error) {
    uni.showToast({
      title: error.message || '操作失败',
      icon: 'none'
    })
  }
}

onMounted(() => {
  getCartQuantity()
})
</script>

<style lang="scss">
.food-item {
  display: flex;
  padding: 24rpx 0;
  background: #fff;
  
  .food-image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 12rpx;
    margin-right: 24rpx;
    flex-shrink: 0;
  }
  
  .food-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    
    .food-name {
      font-size: 30rpx;
      color: #333;
      font-weight: 500;
      margin-bottom: 8rpx;
      line-height: 1.4;
    }
    
    .food-desc {
      font-size: 24rpx;
      color: #999;
      margin-bottom: 12rpx;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8rpx;
      margin-bottom: 12rpx;
      
      .tag {
        font-size: 22rpx;
        color: #91683d;
        padding: 2rpx 12rpx;
        background: rgba(145, 104, 61, 0.1);
        border-radius: 4rpx;
      }
    }
    
    .bottom-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      
      .price {
        display: flex;
        align-items: baseline;
        
        .symbol {
          font-size: 24rpx;
          color: #91683d;
          margin-right: 2rpx;
        }
        
        .amount {
          font-size: 32rpx;
          color: #91683d;
          font-weight: bold;
        }
      }
      
      .quantity-control {
        display: flex;
        align-items: center;
        height: 48rpx;
        
        .control-btn {
          width: 48rpx;
          height: 48rpx;
          padding: 0;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border: none;
          
          &.minus {
            .icon {
              color: #666;
              font-size: 36rpx;
              font-weight: bold;
            }
          }
          
          &.plus {
            .icon {
              color: #91683d;
              font-size: 36rpx;
              font-weight: bold;
            }
          }
          
          &:after {
            border: none;
          }
        }
        
        .quantity {
          min-width: 60rpx;
          text-align: center;
          font-size: 30rpx;
          color: #333;
        }
      }
      
      .add-btn {
        width: 48rpx;
        height: 48rpx;
        padding: 0;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #91683d;
        border-radius: 50%;
        border: none;
        
        .icon {
          color: #fff;
          font-size: 36rpx;
          font-weight: bold;
        }
        
        &:after {
          border: none;
        }
      }
    }
  }
}
</style> 