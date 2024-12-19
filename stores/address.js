import { defineStore } from 'pinia'
import { addressApi } from '@/utils/api'

export const useAddressStore = defineStore('address', {
  state: () => ({
    addressList: [],
    currentAddress: null,
    loading: false
  }),

  getters: {
    // 获取默认地址
    defaultAddress: (state) => {
      return state.addressList.find(addr => addr.is_default) || state.addressList[0]
    },
    
    // 格式化地址文本
    formatAddress: (state) => (address) => {
      if (!address) return ''
      return `${address.province}${address.city}${address.district}${address.detail}`
    }
  },

  actions: {
    // 获取地址列表
    async getAddressList() {
      try {
        this.loading = true
        const res = await addressApi.getAddressList()
        if (res.code === 0) {
          this.addressList = res.data
          // 如果没有选中地址，设置默认地址
          if (!this.currentAddress) {
            this.currentAddress = this.defaultAddress
          }
        }
      } catch (error) {
        console.error('获取地址列表失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 添加地址
    async addAddress(address) {
      try {
        const res = await addressApi.addAddress(address)
        if (res.code === 0) {
          await this.getAddressList()
          return true
        }
        return false
      } catch (error) {
        console.error('添加地址失败:', error)
        return false
      }
    },

    // 更新地址
    async updateAddress(address) {
      try {
        const res = await addressApi.updateAddress(address)
        if (res.code === 0) {
          await this.getAddressList()
          return true
        }
        return false
      } catch (error) {
        console.error('更新地址失败:', error)
        return false
      }
    },

    // 删除地址
    async deleteAddress(id) {
      try {
        const res = await addressApi.deleteAddress(id)
        if (res.code === 0) {
          await this.getAddressList()
          return true
        }
        return false
      } catch (error) {
        console.error('删除地址失败:', error)
        return false
      }
    },

    // 设置当前地址
    setCurrentAddress(address) {
      this.currentAddress = address
    }
  }
}) 