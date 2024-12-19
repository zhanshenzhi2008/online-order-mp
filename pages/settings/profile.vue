<template>
  <view class="profile-container">
    <view class="profile-form">
      <!-- 头像 -->
      <view class="form-item avatar-item" @tap="chooseAvatar">
        <text class="label">头像</text>
        <view class="avatar-wrapper">
          <image 
            :src="form.avatar || '/static/images/default-avatar.png'" 
            class="avatar-image"
            mode="aspectFill"
          />
          <text class="iconfont icon-right">></text>
        </view>
      </view>

      <!-- 昵称 -->
      <view class="form-item">
        <text class="label">昵称</text>
        <input 
          type="text"
          v-model="form.nickname"
          placeholder="请输入昵称"
          class="input"
          maxlength="20"
        />
      </view>

      <!-- 性别 -->
      <view class="form-item">
        <text class="label">性别</text>
        <picker 
          mode="selector"
          :range="genderOptions"
          range-key="label"
          :value="genderIndex"
          @change="handleGenderChange"
        >
          <view class="picker-value">
            <text>{{ genderOptions[genderIndex].label }}</text>
            <text class="iconfont icon-right">></text>
          </view>
        </picker>
      </view>

      <!-- 生日 -->
      <view class="form-item">
        <text class="label">生日</text>
        <picker 
          mode="date"
          :value="form.birthday"
          start="1900-01-01"
          :end="currentDate"
          @change="handleBirthdayChange"
        >
          <view class="picker-value">
            <text>{{ form.birthday || '请选择生日' }}</text>
            <text class="iconfont icon-right">></text>
          </view>
        </picker>
      </view>
    </view>

    <!-- 保存按钮 -->
    <view class="submit-section">
      <button class="submit-btn" @tap="handleSubmit">保存</button>
    </view>
  </view>
</template>

<script>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores'

export default {
  setup() {
    const userStore = useUserStore()
    const form = ref({
      avatar: '',
      nickname: '',
      gender: 0, // 0: 未知, 1: 男, 2: 女
      birthday: ''
    })

    const genderOptions = [
      { label: '未知', value: 0 },
      { label: '男', value: 1 },
      { label: '女', value: 2 }
    ]

    const genderIndex = computed(() => {
      return genderOptions.findIndex(option => option.value === form.value.gender)
    })

    const currentDate = new Date().toISOString().split('T')[0]

    // 选择头像
    const chooseAvatar = () => {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: async (res) => {
          const tempFilePath = res.tempFilePaths[0]
          try {
            // 这里应该调用上传接口
            // const uploadResult = await userStore.uploadAvatar(tempFilePath)
            // form.value.avatar = uploadResult.url
            form.value.avatar = tempFilePath // 临时使用本地路径
          } catch (error) {
            uni.showToast({
              title: '头像上传失败',
              icon: 'none'
            })
          }
        }
      })
    }

    // 性别选择
    const handleGenderChange = (e) => {
      const index = e.detail.value
      form.value.gender = genderOptions[index].value
    }

    // 生日选择
    const handleBirthdayChange = (e) => {
      form.value.birthday = e.detail.value
    }

    // 提交表单
    const handleSubmit = async () => {
      if (!form.value.nickname) {
        uni.showToast({
          title: '请输入昵称',
          icon: 'none'
        })
        return
      }

      try {
        await userStore.updateProfile(form.value)
        uni.showToast({
          title: '保存成功',
          icon: 'success'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      } catch (error) {
        uni.showToast({
          title: error.message || '保存失败',
          icon: 'none'
        })
      }
    }

    // 初始化表单数据
    const initForm = () => {
      const userInfo = userStore.userInfo
      form.value = {
        avatar: userInfo.avatar || '',
        nickname: userInfo.nickname || '',
        gender: userInfo.gender || 0,
        birthday: userInfo.birthday || ''
      }
    }

    // 页面加载时初始化数据
    initForm()

    return {
      form,
      genderOptions,
      genderIndex,
      currentDate,
      chooseAvatar,
      handleGenderChange,
      handleBirthdayChange,
      handleSubmit
    }
  }
}
</script>

<style lang="scss">
.profile-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.profile-form {
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
}

.form-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  .label {
    width: 160rpx;
    font-size: 28rpx;
    color: #333;
  }

  .input {
    flex: 1;
    height: 44rpx;
    font-size: 28rpx;
  }

  .picker-value {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28rpx;
    color: #333;

    .icon-right {
      color: #999;
      font-size: 24rpx;
    }
  }

  &.avatar-item {
    .avatar-wrapper {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    .avatar-image {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }
  }
}

.submit-section {
  margin-top: 60rpx;
  padding: 0 30rpx;

  .submit-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    background-color: #ff0000;
    color: #fff;
    border-radius: 44rpx;
    font-size: 32rpx;
    font-weight: bold;
  }
}
</style> 