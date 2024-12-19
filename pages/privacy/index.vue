<template>
  <view class="privacy">
    <view class="title">隐私政策</view>
    <view class="content">
      <view class="section">
        <view class="section-title">1. 信息收集</view>
        <view class="section-content">
          <view class="sub-title">1.1 我们收集的信息</view>
          <view class="text">
            当您使用我们的服务时，我们可能会收集以下信息：
            <view class="list-item">• 账户信息：手机号码、登录密码等</view>
            <view class="list-item">• 订单信息：配送地址、订单内容等</view>
            <view class="list-item">• 设备信息：设备型号、操作系统、唯一设备标识符等</view>
            <view class="list-item">• 位置信息：GPS位置、WLAN接入点等</view>
          </view>
          
          <view class="sub-title">1.2 信息收集方式</view>
          <view class="text">
            我们通过以下方式收集信息：
            <view class="list-item">• 您提供的信息</view>
            <view class="list-item">• 自动收集的信息</view>
            <view class="list-item">• 第三方合作伙伴提供的信息</view>
          </view>
        </view>
      </view>
      
      <view class="section">
        <view class="section-title">2. 信息使用</view>
        <view class="section-content">
          我们可能将收集的信息用于：
          <view class="list-item">• 提供、维护和改进我们的服务</view>
          <view class="list-item">• 处理您的订单和支付</view>
          <view class="list-item">• 向您发送服务通知</view>
          <view class="list-item">• 预防和处理欺诈等安全问题</view>
        </view>
      </view>
      
      <view class="section">
        <view class="section-title">3. 信息共享</view>
        <view class="section-content">
          除以下情况外，我们不会与第三方共享您的个人信息：
          <view class="list-item">• 经过您的同意</view>
          <view class="list-item">• 为完成订单必要的共享（如配送服务）</view>
          <view class="list-item">• 法律法规要求的情况</view>
        </view>
      </view>
      
      <view class="section">
        <view class="section-title">4. 信息安全</view>
        <view class="section-content">
          我们采取多种安全措施保护您的个人信息：
          <view class="list-item">• 数据加密存储和传输</view>
          <view class="list-item">• 访问控制机制</view>
          <view class="list-item">• 安全监控和审计</view>
        </view>
      </view>
      
      <view class="section">
        <view class="section-title">5. 您的权利</view>
        <view class="section-content">
          您对个人信息享有以下权利：
          <view class="list-item">• 访问和查看</view>
          <view class="list-item">• 更正和更新</view>
          <view class="list-item">• 删除</view>
          <view class="list-item">• 撤回同意</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
// No data or methods needed for this static page
</script>

<style lang="scss">
.privacy {
  padding: 30rpx;
  
  .title {
    font-size: 36rpx;
    font-weight: bold;
    text-align: center;
    margin-bottom: 40rpx;
  }
  
  .content {
    .section {
      margin-bottom: 40rpx;
      
      .section-title {
        font-size: 32rpx;
        font-weight: bold;
        margin-bottom: 20rpx;
      }
      
      .section-content {
        font-size: 28rpx;
        color: #333;
        line-height: 1.6;
        
        .sub-title {
          font-weight: bold;
          margin: 20rpx 0 10rpx;
        }
        
        .text {
          margin-bottom: 20rpx;
        }
        
        .list-item {
          margin: 10rpx 0;
          padding-left: 20rpx;
        }
      }
    }
  }
}
</style> 