<template>
  <view class="address-list">
    <!-- 地址列表 -->
    <view class="list" v-if="addressList.length">
      <view class="address-item" 
            v-for="address in addressList" 
            :key="address.id"
            @click="handleAddressClick(address)">
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
const isSelectMode = ref(false)

// 处理地址点击
const handleAddressClick = (address) => {
  if (isSelectMode.value) {
    // 选择模式下，选中地址并返回
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    if (prevPage && prevPage.$vm) {
      // 获取上一页的事件通道
      const eventChannel = prevPage.$vm.getOpenerEventChannel()
      // 触发地址选择事件
      eventChannel.emit('addressSelected', address)
    }
    // 返回上一页
    uni.navigateBack()
  } else {
    // 普通模式下，进入编辑页面
    editAddress(address)
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
        await addressStore.deleteAddress(address.id)
        loadAddressList()
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
  // 获取页面参数，判断是否是选择模式
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  isSelectMode.value = currentPage && currentPage.options && currentPage.options.select === 'true'
  
  // 加载地址列表
  loadAddressList()
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
  
  .bottom-button {
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

// 选择模式下的样式调整
.address-item {
  &:active {
    opacity: 0.8;
  }
}
</style> 