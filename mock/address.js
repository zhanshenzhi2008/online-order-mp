// 地址数据
export const addresses = []

// 地址相关接口
export const addressApi = [
  // 添加地址
  {
    'POST /address/add': (data) => {
      const address = {
        id: Date.now().toString(),
        ...data,
        isDefault: addresses.length === 0 ? true : data.isDefault || false
      }
      
      if (address.isDefault) {
        addresses.forEach(item => item.isDefault = false)
      }
      addresses.push(address)
      return { code: 0, data: address }
    }
  },

  // 更新地址
  {
    'POST /address/update': (data) => {
      const { id } = data
      const index = addresses.findIndex(item => item.id === id)
      if (index > -1) {
        if (data.isDefault) {
          addresses.forEach(item => item.isDefault = false)
        }
        addresses[index] = { ...addresses[index], ...data }
      }
      return { code: 0, data: addresses[index] }
    }
  },

  // 删除地址
  {
    'POST /address/delete': (data) => {
      const { id } = data
      const index = addresses.findIndex(item => item.id === id)
      if (index > -1) {
        addresses.splice(index, 1)
      }
      return { code: 0 }
    }
  },

  // 获取地址列表
  {
    'GET /address/list': () => {
      return { code: 0, data: addresses }
    }
  },

  // 获取地址详情
  {
    'GET /address/detail': (params) => {
      const { id } = params
      const address = addresses.find(item => item.id === id)
      return { code: 0, data: address }
    }
  },

  // 设置默认地址
  {
    'POST /address/setDefault': (data) => {
      const { id } = data
      addresses.forEach(item => {
        item.isDefault = item.id === id
      })
      return { code: 0 }
    }
  }
] 