<template>
  <view class="login-container">
    <view class="logo">
      <image src="/static/images/logo.png" mode="aspectFit"></image>
      <text>淄博烧烤</text>
    </view>
    
    <view class="form">
      <view class="input-group">
        <text class="label">手机号</text>
        <input 
          type="number" 
          v-model="form.phone" 
          placeholder="请输入手机号"
          maxlength="11"
        />
      </view>
      
      <view class="input-group">
        <text class="label">密码</text>
        <input 
          type="password" 
          v-model="form.password" 
          placeholder="请输入密码"
          maxlength="16"
        />
      </view>
    </view>
    
    <button class="login-btn" @tap="handleLogin" :disabled="!isValid">
      登录
    </button>
    
    <view class="agreement">
      <checkbox :checked="agreed" @tap="agreed = !agreed"></checkbox>
      <text>已阅读并同意</text>
      <text class="link" @tap="showAgreement">《用户协议》</text>
      <text>和</text>
      <text class="link" @tap="showPrivacy">《隐私政策》</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const form = ref({
  phone: '',
  password: ''
})
const counting = ref(0)
const agreed = ref(false)
let timer = null
const loading = ref(false)

const isValid = computed(() => {
  return form.value.phone.length === 11 && 
         form.value.password.length >= 6 && 
         agreed.value
})

// 发送验证码
const sendCode = async () => {
  if (counting.value > 0) return
  if (!/^1\d{10}$/.test(form.value.phone)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none'
    })
    return
  }
  
  try {
    await userStore.sendCode(form.value.phone)
    uni.showToast({
      title: '验证码已发送',
      icon: 'success'
    })
    
    // 开始倒计时
    counting.value = 60
    timer = setInterval(() => {
      if (counting.value > 0) {
        counting.value--
      } else {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    uni.showToast({
      title: error.message || '发送失败',
      icon: 'none'
    })
  }
}

// 登录
const handleLogin = async () => {
  if (!isValid.value) return
  
  loading.value = true
  try {
    const res = await userStore.login(form.value)
    if (res.success) {
      uni.showToast({
        title: '登录成功',
        icon: 'success'
      })
      // 返回上一页或首页
      setTimeout(() => {
        const pages = getCurrentPages()
        if (pages.length > 1) {
          uni.navigateBack()
        } else {
          uni.switchTab({
            url: '/pages/index/index'
          })
        }
      }, 1500)
    } else {
      throw new Error(res.message || '登录失败')
    }
  } catch (error) {
    uni.showToast({
      title: error.message || '登录失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 显示用户协议
const showAgreement = () => {
  uni.navigateTo({
    url: '/pages/agreement/index'
  })
}

// 显示隐私政策
const showPrivacy = () => {
  uni.navigateTo({
    url: '/pages/privacy/index'
  })
}

// 销毁定时器
onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})

// 测试登录
const testLogin = async () => {
  try {
    const res = await userStore.login({
      phone: '13800138000',
      password: '123456'
    })
    console.log('登录结果:', res)
    
    if (res.success) {
      uni.showToast({
        title: '登录成功',
        icon: 'success'
      })
    } else {
      uni.showToast({
        title: res.message,
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('登录失败:', error)
    uni.showToast({
      title: '登录失败',
      icon: 'none'
    })
  }
}

// 在页面加载时测试
onMounted(() => {
  testLogin()
})
</script>

<style lang="scss">
.login-container {
  padding: 60rpx 40rpx;
  
  .logo {
    text-align: center;
    margin-bottom: 80rpx;
    
    image {
      width: 160rpx;
      height: 160rpx;
      margin-bottom: 20rpx;
    }
    
    text {
      font-size: 36rpx;
      font-weight: bold;
    }
  }
  
  .form {
    .input-group {
      margin-bottom: 40rpx;
      
      .label {
        font-size: 28rpx;
        color: #333;
        margin-bottom: 20rpx;
        display: block;
      }
      
      input {
        height: 88rpx;
        background: #f5f5f5;
        border-radius: 12rpx;
        padding: 0 30rpx;
        font-size: 28rpx;
      }
      
      .code-input {
        display: flex;
        align-items: center;
        
        input {
          flex: 1;
          margin-right: 20rpx;
        }
        
        .code-btn {
          width: 200rpx;
          height: 88rpx;
          line-height: 88rpx;
          background: #f00;
          color: #fff;
          font-size: 28rpx;
          border-radius: 12rpx;
          
          &:disabled {
            background: #ccc;
          }
        }
      }
    }
  }
  
  .login-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: #f00;
    color: #fff;
    font-size: 32rpx;
    border-radius: 12rpx;
    margin: 60rpx 0;
    
    &:disabled {
      background: #ccc;
    }
  }
  
  .agreement {
    text-align: center;
    font-size: 24rpx;
    color: #666;
    
    checkbox {
      transform: scale(0.7);
      margin-right: 10rpx;
    }
    
    .link {
      color: #f00;
    }
  }
}
</style> 