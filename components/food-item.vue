<template>
  <view class="food-item">
    <image :src="food.image" mode="aspectFill" class="food-image"></image>
    <view class="food-info">
      <text class="food-name">{{ food.name }}</text>
      <text class="food-price">￥{{ food.price }}</text>
      <view class="food-control">
        <text
            v-if="quantity > 0"
            class="minus"
            @click.stop="updateCart(-1)"
        >-</text>
        <text v-if="quantity > 0" class="quantity">{{ quantity }}</text>
        <text
            class="plus"
            @click.stop="updateCart(1)"
        >+</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores'

interface Food {
  id: string
  name: string
  price: number
  image: string
  description?: string
  specs?: string[]
  additions?: string[]
}

const props = defineProps<{
  food: Food
}>()

const cartStore = useCartStore()

// 获取当前商品在购物车中的数量
const quantity = computed(() => {
  const item = cartStore.cartList.find(item => item.id === props.food.id)
  return item ? item.quantity : 0
})

// 更新购物车
const updateCart = (delta: number): void => {
  if (delta > 0) {
    cartStore.addToCart(props.food)
  } else {
    cartStore.updateCartItem({
      ...props.food,
      quantity: quantity.value + delta
    })
  }
}
</script>

<style lang="scss" scoped>
.food-item {
  display: flex;
  padding: 20rpx;
  background: #fff;
  border-radius: 12rpx;

  .food-image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 8rpx;
    margin-right: 20rpx;
  }

  .food-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .food-name {
      font-size: 28rpx;
      color: #333;
      font-weight: bold;
    }

    .food-price {
      font-size: 32rpx;
      color: #ff6b81;
      font-weight: bold;
      margin: 10rpx 0;
    }

    .food-control {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .minus,
      .plus {
        width: 48rpx;
        height: 48rpx;
        line-height: 48rpx;
        text-align: center;
        border-radius: 50%;
        background: #ff6b81;
        color: #fff;
        font-size: 28rpx;
      }

      .quantity {
        min-width: 60rpx;
        text-align: center;
        margin: 0 20rpx;
        font-size: 28rpx;
      }
    }
  }
}
</style> 