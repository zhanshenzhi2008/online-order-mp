<template>
  <view class="address-list">
    <!-- 地址列表 -->
    <view class="list" v-if="addressList.length">
      <view class="address-item" 
            v-for="address in addressList" 
            :key="address.id"
            @click="selectAddress(address)">
        <view class="info">
          <view class="user">
            <text class="name">{{address.name}}</text>
            <text class="phone">{{address.phone}}</text>
            <text class="tag" v-if="address.tag">{{address.tag}}</text>
          </view>
          <view class="address-line">
            <view class="address">
              <text class="label" v-if="address.isDefault">[默认]</text>
              {{address.province}}{{address.city}}{{address.district}}{{address.detail}}
            </view>
            <view class="actions" v-if="!isSelectMode">
              <text class="icon edit" @tap.stop="editAddress(address)">✎</text>
              <text class="icon delete" @tap.stop="deleteAddress(address)">✕</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view class="empty" v-else>
      <image src="/static/images/empty-address.png"></image>
      <text>暂无收货地址</text>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-button">
      <button class="add-button" @click="addAddress">新增地址</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAddressStore } from '@/stores'

const addressStore = useAddressStore()
const addressList = ref([])
const fromPage = ref('')

// 获取地址列表
const getAddressList = async () => {
  addressList.value = await addressStore.getAddressList()
}

// 选择地址
const selectAddress = (address) => {
  if (fromPage.value === 'order') {
    // 使用全局事件触发选中事件
    uni.$emit('addressSelected', address)
    uni.navigateBack()
  }
}

// 编辑地址
const editAddress = (address) => {
  uni.navigateTo({
    url: `/pages/address/edit?id=${address.id}`
  })
}

// 删除地址
const deleteAddress = (address) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除该地址吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          const res = await addressStore.deleteAddress(address.id)
          if (res.code === 0) {
            uni.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000,
              success: () => {
                setTimeout(() => {
                  loadAddressList()
                }, 1500)
              }
            })
          } else {
            uni.showToast({
              title: res.message || '删除失败',
              icon: 'none'
            })
          }
        } catch (error) {
          uni.showToast({
            title: error.message || '删除失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

// 新增地址
const addAddress = () => {
  uni.navigateTo({
    url: '/pages/address/edit'
  })
}

// 加载地址列表
const loadAddressList = async () => {
  addressList.value = await addressStore.getAddressList()
}

// 页面加载
onMounted(() => {
  getAddressList()
  
  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  fromPage.value = currentPage.options.from || ''
})

// 定义页面生命周期方法
defineExpose({
  onShow() {
    loadAddressList()
  }
})
</script>

<style lang="scss">
.address-list {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 120rpx;
  
  .list {
    margin-top: 20rpx;
    
    .address-item {
      background: #fff;
      margin-bottom: 20rpx;
      padding: 30rpx;
      
      &:active {
        background: #f9f9f9;
      }
      
      .info {
        .user {
          margin-bottom: 16rpx;
          
          .name {
            font-size: 32rpx;
            color: #333;
            font-weight: bold;
            margin-right: 20rpx;
          }
          
          .phone {
            font-size: 28rpx;
            color: #666;
          }
          
          .tag {
            font-size: 24rpx;
            color: #ff6b81;
            border: 1rpx solid #ff6b81;
            padding: 2rpx 12rpx;
            border-radius: 16rpx;
            margin-left: 16rpx;
          }
        }
        
        .address-line {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          
          .address {
            flex: 1;
            font-size: 28rpx;
            color: #666;
            line-height: 1.4;
            margin-right: 20rpx;
            
            .label {
              color: #ff6b81;
              margin-right: 8rpx;
            }
          }
          
          .actions {
            display: flex;
            align-items: center;
            
            .icon {
              width: 60rpx;
              height: 60rpx;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 36rpx;
              color: #999;
              
              &.edit {
                color: #666;
              }
              
              &.delete {
                color: #ff6b81;
              }
              
              &:active {
                opacity: 0.7;
              }
            }
          }
        }
      }
    }
  }
  
  .empty {
    padding-top: 200rpx;
    text-align: center;
    
    image {
      width: 200rpx;
      height: 200rpx;
      margin-bottom: 20rpx;
    }
    
    text {
      font-size: 28rpx;
      color: #999;
    }
  }
  
  .bottom-button {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 20rpx 30rpx;
    background: #fff;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    
    .add-button {
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      background: #ff6b81;
      color: #fff;
      font-size: 32rpx;
      border-radius: 40rpx;
      
      &:active {
        opacity: 0.9;
      }
    }
  }
}
</style> 