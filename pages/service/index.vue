<template>
  <view class="service">
    <!-- 常见问题 -->
    <view class="faq">
      <view class="title">常见问题</view>
      <view class="faq-list">
        <view class="faq-item" 
              v-for="(item, index) in faqList" 
              :key="index"
              @tap="toggleFaq(index)">
          <view class="question">
            <text>{{item.question}}</text>
            <text class="arrow" :class="{ open: item.open }">></text>
          </view>
          <view class="answer" v-if="item.open">{{item.answer}}</view>
        </view>
      </view>
    </view>
    
    <!-- 联系方式 -->
    <view class="contact">
      <view class="title">联系我们</view>
      <view class="contact-list">
        <view class="contact-item" @tap="makePhoneCall">
          <image src="/static/images/phone.png"></image>
          <view class="info">
            <text class="label">客服电话</text>
            <text class="value">400-123-4567</text>
          </view>
          <text class="time">9:00-22:00</text>
        </view>
        
        <view class="contact-item" @tap="copyWechat">
          <image src="/static/images/wechat.png"></image>
          <view class="info">
            <text class="label">微信客服</text>
            <text class="value">zbshaokao</text>
          </view>
          <text class="copy">复制</text>
        </view>
      </view>
    </view>
    
    <!-- 在线客服 -->
    <button class="online-btn" open-type="contact">
      在线客服
    </button>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const faqList = ref([
  {
    question: '如何下单？',
    answer: '进入菜单页面，选择想要的商品加入购物车，确认订单信息后即可下单。',
    open: false
  },
  {
    question: '配送范围是多少？',
    answer: '我们目前在淄博市区提供配送服务，配送范围约5公里。',
    open: false
  },
  {
    question: '大约需要多长时间送达？',
    answer: '正常情况下，从下单到送达约30-45分钟。',
    open: false
  },
  {
    question: '如何取消订单？',
    answer: '未支付订单可直接取消，已支付订单请联系客服处理。',
    open: false
  },
  {
    question: '是否支持自取？',
    answer: '是的，下单时可选择到店自取，享受更优惠的价格。',
    open: false
  }
])

// 展开/收起FAQ
const toggleFaq = (index) => {
  faqList.value[index].open = !faqList.value[index].open
}

// 拨打电话
const makePhoneCall = () => {
  uni.makePhoneCall({
    phoneNumber: '4001234567'
  })
}

// 复制微信号
const copyWechat = () => {
  uni.setClipboardData({
    data: 'zbshaokao',
    success: () => {
      uni.showToast({
        title: '已复制微信号',
        icon: 'success'
      })
    }
  })
}
</script>

<style lang="scss">
.service {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
  
  .title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
  }
  
  .faq {
    background: #fff;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    
    .faq-list {
      .faq-item {
        .question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20rpx 0;
          font-size: 28rpx;
          
          .arrow {
            color: #999;
            transform: rotate(90deg);
            transition: transform 0.3s;
            
            &.open {
              transform: rotate(-90deg);
            }
          }
        }
        
        .answer {
          font-size: 26rpx;
          color: #666;
          padding: 0 20rpx 20rpx;
          border-bottom: 1rpx solid #eee;
        }
        
        &:last-child .answer {
          border-bottom: none;
        }
      }
    }
  }
  
  .contact {
    background: #fff;
    border-radius: 12rpx;
    padding: 30rpx;
    
    .contact-list {
      .contact-item {
        display: flex;
        align-items: center;
        padding: 20rpx 0;
        
        image {
          width: 80rpx;
          height: 80rpx;
          margin-right: 20rpx;
        }
        
        .info {
          flex: 1;
          
          .label {
            font-size: 28rpx;
            margin-bottom: 6rpx;
            display: block;
          }
          
          .value {
            font-size: 32rpx;
            color: #333;
            font-weight: bold;
          }
        }
        
        .time, .copy {
          font-size: 24rpx;
          color: #999;
        }
        
        .copy {
          color: #f00;
          border: 1rpx solid #f00;
          padding: 4rpx 20rpx;
          border-radius: 20rpx;
        }
      }
    }
  }
  
  .online-btn {
    position: fixed;
    left: 40rpx;
    right: 40rpx;
    bottom: 40rpx;
    height: 88rpx;
    line-height: 88rpx;
    background: #f00;
    color: #fff;
    font-size: 32rpx;
    border-radius: 44rpx;
  }
}
</style> 