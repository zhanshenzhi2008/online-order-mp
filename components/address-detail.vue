<template>
  <view class="address-detail">
    <input
      class="address-input"
      type="text"
      v-model="addressValue"
      placeholder="请输入详细地址"
      @input="handleInput"
    />
    <view class="location-btn" @tap="chooseLocation">
      <image src="/static/images/location.png" mode="widthFix"></image>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  value: String
})

const emit = defineEmits(['update:value', 'change'])
const addressValue = ref(props.value || '')

// 输入处理
const handleInput = () => {
  emit('update:value', addressValue.value)
  emit('change', addressValue.value)
}

// 选择位置
const chooseLocation = () => {
  // #ifdef MP-WEIXIN
  // 微信小程序平台
  uni.getSetting({
    success: (res) => {
      if (!res.authSetting['scope.userLocation']) {
        uni.authorize({
          scope: 'scope.userLocation',
          success: () => {
            startChooseLocation()
          },
          fail: () => {
            showLocationPermissionDialog()
          }
        })
      } else {
        startChooseLocation()
      }
    },
    fail: () => {
      showLocationPermissionDialog()
    }
  })
  // #endif

  // #ifdef H5
  startChooseLocation()
  // #endif
}

// 开始选择位置
const startChooseLocation = () => {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      uni.chooseLocation({
        latitude: res.latitude,
        longitude: res.longitude,
        keyword: addressValue.value || '',
        success: (res) => {
          addressValue.value = res.address
          emit('update:value', res.address)
          emit('change', res.address)
        },
        fail: (err) => {
          console.log('chooseLocation fail:', err)
          if (err.errMsg.includes('auth deny') || err.errMsg.includes('permission')) {
            showLocationPermissionDialog()
          } else {
            uni.showToast({
              title: '选择地址失败，请重试',
              icon: 'none'
            })
          }
        }
      })
    },
    fail: () => {
      // 如果获取位置失败，使用默认位置
      uni.chooseLocation({
        latitude: 35.86166,
        longitude: 104.195397,
        keyword: addressValue.value || '',
        success: (res) => {
          addressValue.value = res.address
          emit('update:value', res.address)
          emit('change', res.address)
        },
        fail: (err) => {
          console.log('chooseLocation fail:', err)
          if (err.errMsg.includes('auth deny') || err.errMsg.includes('permission')) {
            showLocationPermissionDialog()
          } else {
            uni.showToast({
              title: '选择地址失败，请重试',
              icon: 'none'
            })
          }
        }
      })
    }
  })
}

// 显示位置权限对话框
const showLocationPermissionDialog = () => {
  // #ifdef H5
  uni.showModal({
    title: '位置权限被禁用',
    content: '请按以下步骤开启:\n1. 点击浏览器地址栏左侧的锁定图标\n2. 点击"重置权限"\n3. 刷新页面后重试',
    confirmText: '刷新页面',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        window.location.reload()
      }
    }
  })
  // #endif
  
  // #ifdef MP-WEIXIN
  uni.showModal({
    title: '提示',
    content: '需要获取定位权限，是否去设置？',
    success: (res) => {
      if (res.confirm) {
        uni.openSetting()
      }
    }
  })
  // #endif
}

// 监听value变化
watch(() => props.value, (newValue) => {
  if (addressValue.value !== newValue) {
    addressValue.value = newValue || ''
  }
}, { immediate: true })
</script>

<style lang="scss">
.address-detail {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 20rpx;
  
  .address-input {
    flex: 1;
    font-size: 28rpx;
    height: 40rpx;
    line-height: 40rpx;
  }
  
  .location-btn {
    width: 40rpx;
    height: 40rpx;
    margin-left: 20rpx;
    
    image {
      width: 100%;
      height: 100%;
    }
  }
}
</style> 