<template>
  <view class="address-edit">
    <view class="form">
      <!-- 联系人信息 -->
      <view class="form-group">
        <view class="form-item">
          <text class="label">联系人<text class="required">*</text></text>
          <view class="input-wrapper">
            <input 
              class="input" 
              type="text" 
              v-model="formData.name" 
              placeholder="请输入联系人姓名"
              placeholder-class="placeholder"
            />
          </view>
        </view>
        <view class="form-item">
          <text class="label">手机号<text class="required">*</text></text>
          <view class="input-wrapper">
            <input 
              class="input" 
              type="number" 
              v-model="formData.phone" 
              placeholder="请输入手机号"
              placeholder-class="placeholder"
            />
          </view>
        </view>
      </view>

      <!-- 地址信息 -->
      <view class="form-group">
        <view class="form-item">
          <text class="label">所在地区<text class="required">*</text></text>
          <view class="input-wrapper">
            <region-picker
              v-model:value="formData.region"
              @change="handleRegionChange"
            />
          </view>
        </view>
        
        <view class="form-item">
          <text class="label">详细地址<text class="required">*</text></text>
          <view class="input-wrapper">
            <address-detail
              v-model:value="formData.address"
              @change="handleAddressChange"
            />
          </view>
        </view>
        
        <view class="form-item">
          <text class="label">门牌号<text class="required">*</text></text>
          <view class="input-wrapper">
            <input 
              class="input" 
              type="text" 
              v-model="formData.detail" 
              placeholder="例如：1号楼1单元101室"
              placeholder-class="placeholder"
            />
          </view>
        </view>
      </view>

      <!-- 标签 -->
      <view class="form-group">
        <view class="form-item">
          <text class="label">标签</text>
          <view class="input-wrapper">
            <view class="tags">
              <view 
                class="tag" 
                :class="{ active: formData.tag === item }"
                v-for="item in tags" 
                :key="item"
                @tap="selectTag(item)"
              >{{item}}</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 默认地址设置 -->
      <view class="form-group">
        <view class="form-item">
          <text class="label">设为默认</text>
          <view class="input-wrapper">
            <switch 
              :checked="formData.is_default" 
              @change="e => formData.is_default = e.detail.value"
              color="#f00"
            />
          </view>
        </view>
      </view>
    </view>

    <!-- 保存按钮 -->
    <view class="save-btn" @tap="saveAddress">
      <text>保存</text>
    </view>

    <!-- 添加删除按钮 -->
    <view class="delete-btn" v-if="isEdit" @tap="confirmDelete">
      <text>删除收货地址</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAddressStore } from '@/stores'
import RegionPicker from '@/components/region-picker.vue'
import AddressDetail from '@/components/address-detail.vue'

const addressStore = useAddressStore()
const isEdit = ref(false)

// 表单数据
const formData = ref({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  region: '',
  address: '',
  detail: '',
  tag: '',
  is_default: false
})

// 标签选项
const tags = ['家', '公司', '学校']

// 选择标签
const selectTag = (tag) => {
  formData.value.tag = formData.value.tag === tag ? '' : tag
}

// 手机号验证
const validatePhone = (phone) => {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
}

// 保存地址
const saveAddress = async () => {
  // 表单验证
  if (!formData.value.name) {
    uni.showToast({
      title: '请输入联系人姓名',
      icon: 'none'
    })
    return
  }
  if (!formData.value.phone) {
    uni.showToast({
      title: '请输入手机号',
      icon: 'none'
    })
    return
  }
  if (!validatePhone(formData.value.phone)) {
    uni.showToast({
      title: '手机号格式不正确',
      icon: 'none'
    })
    return
  }
  if (!formData.value.region) {
    uni.showToast({
      title: '请选择所在地区',
      icon: 'none'
    })
    return
  }
  if (!formData.value.address) {
    uni.showToast({
      title: '请输入详细地址',
      icon: 'none'
    })
    return
  }
  if (!formData.value.detail) {
    uni.showToast({
      title: '请输入门牌号',
      icon: 'none'
    })
    return
  }

  // 构造保存的数据
  const saveData = {
    id: formData.value.id,
    name: formData.value.name,
    phone: formData.value.phone,
    province: formData.value.province,
    city: formData.value.city,
    district: formData.value.district,
    detail: formData.value.detail,
    tag: formData.value.tag,
    isDefault: formData.value.is_default
  }

  try {
    let res
    if (isEdit.value) {
      res = await addressStore.updateAddress(saveData)
    } else {
      res = await addressStore.addAddress(saveData)
    }

    if (res.code === 0) {
      uni.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        }
      })
    } else {
      uni.showToast({
        title: res.message || '保存失败',
        icon: 'none'
      })
    }
  } catch (error) {
    uni.showToast({
      title: error.message || '保存失败',
      icon: 'none'
    })
  }
}

// 确认删除
const confirmDelete = () => {
  uni.showModal({
    title: '提示',
    content: '确定要删除该地址吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          const res = await addressStore.deleteAddress(formData.value.id)
          if (res.code === 0) {
            uni.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000,
              success: () => {
                setTimeout(() => {
                  uni.navigateBack()
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

// 地区选择回调
const handleRegionChange = (region) => {
  formData.value.province = region.province
  formData.value.city = region.city
  formData.value.district = region.district
  formData.value.region = region.value
}

// 详细地址变化回调
const handleAddressChange = (address) => {
  formData.value.address = address
}

// 如果是编辑模式，获取地址信息
onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const id = currentPage && currentPage.options && currentPage.options.id

  if (id) {
    isEdit.value = true
    // 从 store 中获取地址详情
    const address = addressStore.getAddressById(Number(id))
    if (address) {
      // 将地址信息填充到表单，确保所有字段都正确映射
      formData.value = {
        id: address.id,
        name: address.name,
        phone: address.phone,
        province: address.province,
        city: address.city,
        district: address.district,
        region: `${address.province} ${address.city} ${address.district}`, // 组合地区显示
        address: address.detail || '', // 详细地址
        detail: address.detail || '', // 门牌号
        tag: address.tag || '', // 标签
        is_default: !!address.isDefault // 确保布尔值转换
      }
    } else {
      uni.showToast({
        title: '地址不存在',
        icon: 'none',
        success: () => {
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        }
      })
    }
  }
})
</script>

<style lang="scss">
.address-edit {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 120rpx;
  
  .form {
    background: #fff;
    
    .form-group {
      margin-bottom: 20rpx;
      
      .form-item {
        display: flex;
        padding: 30rpx;
        border-bottom: 1rpx solid #eee;
        
        &:last-child {
          border-bottom: none;
        }
        
        .label {
          width: 180rpx;
          font-size: 28rpx;
          color: #333;
          padding-top: 20rpx;
          flex-shrink: 0;
          text-align: justify;
          text-align-last: justify;
          margin-right: 40rpx;
          
          .required {
            color: #f00;
            margin-left: 4rpx;
            text-align: left;
            text-align-last: left;
          }
        }
        
        .input-wrapper {
          flex: 1;
          min-width: 0; // 防止flex子元素溢出
          
          .input {
            width: 100%;
            font-size: 28rpx;
            height: 60rpx;
            line-height: 60rpx;
          }
          
          .placeholder {
            color: #999;
          }
          
          .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 20rpx;
            
            .tag {
              padding: 10rpx 30rpx;
              border: 1rpx solid #ddd;
              border-radius: 30rpx;
              font-size: 24rpx;
              color: #666;
              
              &.active {
                background: #fff5f5;
                border-color: #f00;
                color: #f00;
              }
            }
          }
        }
      }
    }
  }
  
  .save-btn {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100rpx;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    padding: 0 20rpx;
    
    text {
      // #ifdef H5
      max-width: 400px;
      min-width: 200px;
      width: 90%;
      margin: 0 auto;
      // #endif
      
      // #ifndef H5
      width: 90%;
      // #endif
      
      height: 80rpx;
      line-height: 80rpx;
      background: #f00;
      color: #fff;
      font-size: 32rpx;
      text-align: center;
      border-radius: 40rpx;
    }
  }
  
  .delete-btn {
    margin-top: 40rpx;
    padding: 0 30rpx;
    
    text {
      display: block;
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      background: #fff;
      color: #f00;
      font-size: 32rpx;
      border-radius: 40rpx;
    }
  }
}
</style> 