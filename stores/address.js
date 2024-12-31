import { defineStore } from 'pinia'
import { ref } from 'vue'
import { addressApi } from '@/utils/api'

export const useAddressStore = defineStore('address', () => {
  const addressList = ref([])
  const defaultAddress = ref(null)
  const selectedAddress = ref(null)

  // 获取地址列表
  const getAddressList = async () => {
    try {
      const res = await addressApi.getAddressList()
      if (res.code === 0) {
        addressList.value = res.data
        // 更新默认地址
        defaultAddress.value = addressList.value.find(addr => addr.isDefault) || null
      }
      return addressList.value
    } catch (error) {
      console.error('获取地址列表失败:', error)
      return []
    }
  }

  // 获取默认地址
  const getDefaultAddress = async () => {
    if (defaultAddress.value) return defaultAddress.value
    
    await getAddressList()
    return defaultAddress.value
  }

  // 设置选中的地址
  const setSelectedAddress = (address) => {
    selectedAddress.value = address
  }

  // 获取选中的地址
  const getSelectedAddress = () => {
    return selectedAddress.value
  }

  return {
    addressList,
    defaultAddress,
    selectedAddress,
    getAddressList,
    getDefaultAddress,
    setSelectedAddress,
    getSelectedAddress
  }
}) 