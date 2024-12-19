<template>
  <view class="address-list">
    <!-- 地址列表 -->
    <view class="list" v-if="addressList.length">
      <view class="address-item" 
            v-for="item in addressList" 
            :key="item.id"
            @tap="selectAddress(item)">
        <view class="info">
          <view class="user">
            <text class="name">{{item.name}}</text>
            <text class="phone">{{item.phone}}</text>
            <text class="tag" v-if="item.tag">{{item.tag}}</text>
          </view>
          <view class="address-line">
            <view class="address">
              <text class="label" v-if="item.isDefault">[默认]</text>
              {{item.province}}{{item.city}}{{item.district}}{{item.detail}}
            </view>
            <view class="actions">
              <text class="icon edit" @tap.stop="editAddress(item)">✎</text>
              <text class="icon delete" @tap.stop="deleteAddress(item)">✕</text>
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
    
    <!-- 添加按钮 -->
    <button class="add-btn" @tap="addAddress">
      新增
    </button>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { addressApi } from '@/utils/api'

const addressList = ref([])
const selectMode = ref(false)

// 加载地址列表
const loadAddressList = async () => {
  try {
    const res = await addressApi.getAddressList()
    if (res.code === 0) {
      addressList.value = res.data
    } else {
      throw new Error(res.message || '加载失败')
    }
  } catch (error) {
    uni.showToast({
      title: error.message || '加载失败',
      icon: 'none'
    })
  }
}

// 选择地址
const selectAddress = (address) => {
  if (!selectMode.value) return
  
  // 返回上一页并传递选中的地址
  const pages = getCurrentPages()
  const prevPage = pages[pages.length - 2]
  prevPage.$vm.setAddress(address)
  uni.navigateBack()
}

// 设置默认地址
const setDefault = async (address) => {
  if (address.isDefault) return
  
  try {
    const res = await addressApi.updateAddress({
      ...address,
      isDefault: true
    })
    if (res.code === 0) {
      await loadAddressList()
    } else {
      throw new Error(res.message || '设置失败')
    }
  } catch (error) {
    uni.showToast({
      title: error.message || '设置失败',
      icon: 'none'
    })
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
          const res = await addressApi.deleteAddress(address.id)
          if (res.code === 0) {
            await loadAddressList()
          } else {
            throw new Error(res.message || '删除失败')
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

// 页面加载
onMounted((options) => {
  selectMode.value = options && options.select === 'true'
  loadAddressList()
})
</script>

<style lang="scss">
.address-list {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
  padding-bottom: 120rpx;
  
  .list {
    .address-item {
      background: #fff;
      border-radius: 12rpx;
      padding: 30rpx;
      margin-bottom: 20rpx;
      
      .info {
        .user {
          margin-bottom: 16rpx;
          
          .name {
            font-size: 32rpx;
            font-weight: bold;
            margin-right: 20rpx;
          }
          
          .phone {
            font-size: 28rpx;
            color: #666;
            margin-right: 20rpx;
          }
          
          .tag {
            font-size: 24rpx;
            color: #f00;
            border: 1rpx solid #f00;
            padding: 2rpx 10rpx;
            border-radius: 4rpx;
          }
        }
        
        .address-line {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          
          .address {
            flex: 1;
            font-size: 28rpx;
            color: #333;
            line-height: 1.4;
            margin-right: 20rpx;
            
            .label {
              color: #f00;
              margin-right: 10rpx;
            }
          }
          
          .actions {
            display: flex;
            align-items: center;
            
            .icon {
              font-size: 32rpx;
              padding: 10rpx;
              margin-left: 20rpx;
              
              &.edit {
                color: #f44336;
              }
              
              &.delete {
                color: #666;
              }
            }
          }
        }
      }
    }
  }
  
  .empty {
    padding: 100rpx 0;
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
  
  .add-btn {
    // #ifdef H5
    position: fixed;
    left: 50%;
    bottom: 40rpx;
    transform: translateX(-50%);
    width: clamp(200px, 90%, 400px);
    // #endif
    
    // #ifndef H5
    position: fixed;
    left: 40rpx;
    right: 40rpx;
    bottom: 40rpx;
    // #endif
    
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    background: #f00;
    color: #fff;
    font-size: 32rpx;
    border-radius: 44rpx;
  }
}
</style> 