<template>
  <view class="profile-container">
    <view class="profile-list">
      <view class="profile-item" @tap="chooseAvatar">
        <text class="item-label">头像</text>
        <view class="item-content">
          <image 
            class="avatar" 
            :src="userInfo && userInfo.avatar ? userInfo.avatar : '/static/images/mine/default-avatar.png'" 
            mode="aspectFill"
          ></image>
          <text class="arrow">></text>
        </view>
      </view>
      
      <view class="profile-item">
        <text class="item-label">昵称</text>
        <view class="item-content">
          <input 
            type="text" 
            v-model="userInfo.nickname" 
            placeholder="请输入昵称"
            @blur="updateProfile('nickname')"
          />
        </view>
      </view>
      
      <view class="profile-item" @tap="showGenderPicker">
        <text class="item-label">性别</text>
        <view class="item-content">
          <text>{{ genderText }}</text>
          <text class="arrow">></text>
        </view>
      </view>
      
      <view class="profile-item">
        <text class="item-label">手机号</text>
        <view class="item-content">
          <text>{{ userInfo.phone || '未绑定' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores'
import { userApi } from '@/utils/api'

const userStore = useUserStore()
const userInfo = ref({ ...userStore.userInfo })

// 性别显示文本
const genderText = computed(() => {
  const genderMap = { 0: '未设置', 1: '男', 2: '女' }
  return genderMap[userInfo.value.gender || 0]
})

// 选择头像
const chooseAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0]
      try {
        uni.showLoading({ title: '上传中...', mask: true })
        const uploadRes = await userApi.uploadAvatar(tempFilePath)
        if (uploadRes.code === 0) {
          userInfo.value.avatar = uploadRes.data.url
          await updateProfile('avatar')
          uni.showToast({ title: '上传成功', icon: 'success' })
        }
      } catch (error) {
        uni.showToast({ title: '上传失败', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    }
  })
}

// 显示性别选择器
const showGenderPicker = () => {
  uni.showActionSheet({
    itemList: ['男', '女'],
    success: async (res) => {
      const gender = res.tapIndex + 1
      userInfo.value.gender = gender
      await updateProfile('gender')
    }
  })
}

// 更新个人资料
const updateProfile = async (field) => {
  try {
    const res = await userApi.updateUserInfo({
      [field]: userInfo.value[field]
    })
    if (res.code === 0) {
      userStore.updateUserInfo(userInfo.value)
    } else {
      throw new Error(res.message)
    }
  } catch (error) {
    uni.showToast({
      title: error.message || '更新失败',
      icon: 'none'
    })
  }
}
</script>

<style lang="scss">
.profile-container {
  min-height: 100vh;
  background: #f5f5f5;
  
  .profile-list {
    background: #fff;
    margin-top: 20rpx;
    
    .profile-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 32rpx;
      border-bottom: 1rpx solid #f5f5f5;
      
      .item-label {
        font-size: 28rpx;
        color: #333;
      }
      
      .item-content {
        display: flex;
        align-items: center;
        
        .avatar {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          margin-right: 16rpx;
        }
        
        input {
          text-align: right;
          font-size: 28rpx;
          color: #333;
        }
        
        text {
          font-size: 28rpx;
          color: #666;
        }
        
        .arrow {
          margin-left: 16rpx;
          color: #999;
        }
      }
      
      &:active {
        background: #f9f9f9;
      }
    }
  }
}
</style> 