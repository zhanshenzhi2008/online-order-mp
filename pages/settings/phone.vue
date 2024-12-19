<template>
  <view class="phone-container">
    <view class="form-section">
      <!-- 手机号输入 -->
      <view class="form-item">
        <text class="label">手机号</text>
        <input 
          type="number"
          v-model="form.phone"
          placeholder="请输入新手机号"
          maxlength="11"
          class="input"
        />
      </view>

      <!-- 验证码 -->
      <view class="form-item">
        <text class="label">验证码</text>
        <input 
          type="number"
          v-model="form.code"
          placeholder="请输入验证码"
          maxlength="6"
          class="input"
        />
        <button 
          class="code-btn"
          :disabled="counting > 0"
          @tap="sendCode"
        >
          {{ counting > 0 ? counting + 's' : '获取验证码' }}
        </button>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-section">
      <button 
        class="submit-btn"
        :disabled="!isFormValid"
        @tap="handleSubmit"
      >
        确认修改
      </button>
    </view>
  </view>
</template>

<script>
import { ref, computed, onUnmounted } from 'vue'
import { useUserStore } from '@/stores'

export default {
  setup() {
    const userStore = useUserStore()
    const form = ref({
      phone: '',
      code: ''
    })
    const counting = ref(0)
    let timer = null

    // 表单验证
    const isFormValid = computed(() => {
      return /^1[3-9]\d{9}$/.test(form.value.phone) && 
        /^\d{6}$/.test(form.value.code)
    })

    // 发送验证码
    const sendCode = async () => {
      if (counting.value > 0) return
      if (!/^1[3-9]\d{9}$/.test(form.value.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
        return
      }

      try {
        await userStore.sendVerificationCode(form.value.phone)
        
        // 开始倒计时
        counting.value = 60
        timer = setInterval(() => {
          if (counting.value > 0) {
            counting.value--
          } else {
            clearInterval(timer)
          }
        }, 1000)

        uni.showToast({
          title: '验证码已发送',
          icon: 'success'
        })
      } catch (error) {
        uni.showToast({
          title: error.message || '发送失败',
          icon: 'none'
        })
      }
    }

    // 提交表单
    const handleSubmit = async () => {
      if (!isFormValid.value) {
        uni.showToast({
          title: '请填写完整信息',
          icon: 'none'
        })
        return
      }

      try {
        await userStore.updatePhone({
          phone: form.value.phone,
          code: form.value.code
        })

        uni.showToast({
          title: '修改成功',
          icon: 'success'
        })

        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      } catch (error) {
        uni.showToast({
          title: error.message || '修改失败',
          icon: 'none'
        })
      }
    }

    // 组件销毁时清除定时器
    onUnmounted(() => {
      if (timer) {
        clearInterval(timer)
      }
    })

    return {
      form,
      counting,
      isFormValid,
      sendCode,
      handleSubmit
    }
  }
}
</script>

<style lang="scss">
.phone-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.form-section {
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

  .code-btn {
    width: 200rpx;
    height: 60rpx;
    line-height: 60rpx;
    margin-left: 20rpx;
    font-size: 24rpx;
    color: #ff0000;
    background-color: #fff;
    border: 1px solid #ff0000;
    border-radius: 30rpx;

    &:disabled {
      color: #999;
      border-color: #999;
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

    &:disabled {
      background-color: #ccc;
    }
  }
}
</style> 