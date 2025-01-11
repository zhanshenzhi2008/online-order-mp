<template>
  <view class="settings-container">
    <!-- 账号信息设置 -->
    <view class="settings-section">
      <view class="section-title">账号信息</view>
      <view class="settings-list">
        <view class="settings-item" @tap="goToProfile">
          <text class="item-label">个人资料</text>
          <view class="item-right">
            <text class="item-value">{{ userInfo?.nickname || '未设置' }}</text>
            <text class="arrow">></text>
          </view>
        </view>
        <view class="settings-item" @tap="navigateTo('/pages/settings/phone')">
          <text class="item-label">手机号码</text>
          <view class="item-right">
            <text class="item-value">{{ userInfo?.phone ? formatPhone(userInfo.phone) : '未绑定' }}</text>
            <text class="arrow">></text>
          </view>
        </view>
      </view>
    </view>

    <!-- 消息通知设置 -->
    <view class="settings-section">
      <view class="section-title">消息通知</view>
      <view class="settings-list">
        <view class="settings-item">
          <text class="item-label">订单通知</text>
          <switch 
            :checked="settings.orderNotification"
            @change="updateSetting('orderNotification', $event.detail.value)"
            color="#ff6b81"
          />
        </view>
        <view class="settings-item">
          <text class="item-label">优惠活动通知</text>
          <switch 
            :checked="settings.promotionNotification"
            @change="updateSetting('promotionNotification', $event.detail.value)"
            color="#ff6b81"
          />
        </view>
        <view class="settings-item">
          <text class="item-label">系统通知</text>
          <switch 
            :checked="settings.systemNotification"
            @change="updateSetting('systemNotification', $event.detail.value)"
            color="#ff6b81"
          />
        </view>
      </view>
    </view>

    <!-- 隐私设置 -->
    <view class="settings-section">
      <view class="section-title">隐私设置</view>
      <view class="settings-list">
        <view class="settings-item">
          <text class="item-label">允许位置访问</text>
          <switch 
            :checked="settings.locationAccess"
            @change="updateSetting('locationAccess', $event.detail.value)"
            color="#ff6b81"
          />
        </view>
        <view class="settings-item" @tap="navigateTo('/pages/privacy/index')">
          <text class="item-label">隐私政策</text>
          <view class="item-right">
            <text class="arrow">></text>
          </view>
        </view>
        <view class="settings-item" @tap="navigateTo('/pages/agreement/index')">
          <text class="item-label">用户协议</text>
          <view class="item-right">
            <text class="arrow">></text>
          </view>
        </view>
      </view>
    </view>

    <!-- 其他设置 -->
    <view class="settings-section">
      <view class="section-title">其他设置</view>
      <view class="settings-list">
        <view class="settings-item" @tap="clearCache">
          <text class="item-label">清除缓存</text>
          <view class="item-right">
            <text class="item-value">{{ cacheSize }}</text>
            <text class="arrow">></text>
          </view>
        </view>
        <view class="settings-item">
          <text class="item-label">当前版本</text>
          <view class="item-right">
            <text class="item-value">{{ appVersion }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 退出登录按钮 -->
    <view class="logout-section">
      <button class="logout-btn" @tap="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const userInfo = ref({})
const settings = ref({
  orderNotification: true,
  promotionNotification: true,
  systemNotification: true,
  locationAccess: true
})
const cacheSize = ref('0.0MB')
const appVersion = ref('1.0.0')

// 格式化手机号
const formatPhone = (phone) => {
  if (!phone) return '未绑定'
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 页面跳转
const navigateTo = (url) => {
  uni.navigateTo({ url })
}

// 跳转到个人资料页
const goToProfile = () => {
  uni.navigateTo({
    url: '/pages/settings/profile'
  })
}

// 更新设置
const updateSetting = async (key, value) => {
  try {
    settings.value[key] = value
    // 这里可以调用接口保存设置
    await userStore.updateSettings({
      [key]: value
    })
    uni.showToast({
      title: '设置已更新',
      icon: 'success'
    })
  } catch (error) {
    uni.showToast({
      title: '设置更新失败',
      icon: 'none'
    })
  }
}

// 清除缓存
const clearCache = () => {
  uni.showModal({
    title: '提示',
    content: '确定要清除缓存吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await uni.clearStorage()
          cacheSize.value = '0.0MB'
          uni.showToast({
            title: '清除成功',
            icon: 'success'
          })
        } catch (error) {
          uni.showToast({
            title: '清除失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await userStore.logout()
          uni.reLaunch({
            url: '/pages/index/index'
          })
        } catch (error) {
          uni.showToast({
            title: '退出失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

// 获取缓存大小
const getCacheSize = () => {
  uni.getStorageInfo({
    success: (res) => {
      const size = (res.currentSize / 1024).toFixed(1)
      cacheSize.value = size + 'MB'
    }
  })
}

onMounted(async () => {
  userInfo.value = userStore.userInfo
  const userSettings = await userStore.getSettings()
  settings.value = { ...settings.value, ...userSettings }
  getCacheSize()
})
</script>

<style lang="scss">
.settings-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40rpx;
}

.settings-section {
  margin-top: 20rpx;
  background-color: #fff;

  .section-title {
    padding: 20rpx 30rpx;
    font-size: 28rpx;
    color: #999;
  }
}

.settings-list {
  .settings-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    background-color: #fff;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }

    .item-label {
      font-size: 28rpx;
      color: #333;
    }

    .item-right {
      display: flex;
      align-items: center;
      
      .item-value {
        font-size: 28rpx;
        color: #999;
        margin-right: 10rpx;
      }

      .arrow {
        color: #999;
        font-size: 24rpx;
      }
    }
  }
}

.logout-section {
  margin: 60rpx 30rpx;

  .logout-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    background-color: #fff;
    color: #ff6b81;
    border-radius: 44rpx;
    font-size: 32rpx;
  }
}
</style> 