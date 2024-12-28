import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAddressStore = defineStore('address', () => {
  const addressList = ref([
    // 添加一些测试数据
    {
      id: 1,
      name: '张三',
      phone: '13800138000',
      province: '山东省',
      city: '淄博市',
      district: '张店区',
      detail: '人民路100号',
      isDefault: true
    }
  ])

  // 获取地址列表
  const getAddressList = async () => {
    // TODO: 从后端获取地址列表
    return addressList.value
  }

  // 获取默认地址
  const getDefaultAddress = () => {
    return addressList.value.find(address => address.isDefault) || null
  }

  // 添加地址
  const addAddress = async (address) => {
    // TODO: 调用后端 API 添加地址
    const newAddress = {
      ...address,
      id: Date.now()
    }
    
    // 如果是默认地址，取消其他地址的默认状态
    if (newAddress.isDefault) {
      addressList.value.forEach(item => {
        item.isDefault = false
      })
    }
    
    addressList.value.push(newAddress)
    return { code: 0, message: 'success' }
  }

  // 更新地址
  const updateAddress = async (address) => {
    // TODO: 调用后端 API 更新地址
    const index = addressList.value.findIndex(item => item.id === address.id)
    if (index > -1) {
      // 如果设为默认地址，取消其他地址的默认状态
      if (address.isDefault) {
        addressList.value.forEach(item => {
          item.isDefault = false
        })
      }
      addressList.value[index] = address
      return { code: 0, message: 'success' }
    }
    return { code: -1, message: '地址不存在' }
  }

  // 删除地址
  const deleteAddress = async (id) => {
    // TODO: 调用后端 API 删除地址
    const index = addressList.value.findIndex(item => item.id === id)
    if (index > -1) {
      addressList.value.splice(index, 1)
      return { code: 0, message: 'success' }
    }
    return { code: -1, message: '地址不存在' }
  }

  // 获取地址详情
  const getAddressById = (id) => {
    return addressList.value.find(item => item.id === id) || null
  }

  return {
    addressList,
    getAddressList,
    getDefaultAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    getAddressById
  }
}) 