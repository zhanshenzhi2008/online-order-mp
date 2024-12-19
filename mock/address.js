// 地址数据
export const addresses = [
  {
    id: '1',
    userId: '1',
    name: '张三',
    phone: '13800138000',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    address: '三里屯SOHO',
    isDefault: true,
    tag: '公司'
  },
  {
    id: '2',
    userId: '1',
    name: '张三',
    phone: '13800138000',
    province: '北京市',
    city: '北京市',
    district: '海淀区',
    address: '中关村软件园',
    isDefault: false,
    tag: '家'
  }
]

// 地址相关接口
export const addressApi = {
  // 获取地址列表
  'address/list': () => {
    return { code: 0, data: addresses }
  },

  // 添加地址
  'address/add': (data) => {
    const address = {
      id: Date.now().toString(),
      ...data
    }
    
    // 如果是第一个地址或设置为默认地址
    if (addresses.length === 0 || address.isDefault) {
      addresses.forEach(addr => addr.isDefault = false)
      address.isDefault = true
    }
    
    addresses.push(address)
    return { code: 0, data: address }
  },

  // 更新地址
  'address/update': (data) => {
    const index = addresses.findIndex(addr => addr.id === data.id)
    if (index === -1) {
      return { code: 1, message: '地址不存在' }
    }
    
    // 如果设置为默认地址
    if (data.isDefault) {
      addresses.forEach(addr => addr.isDefault = false)
    }
    
    addresses[index] = { ...addresses[index], ...data }
    return { code: 0, data: addresses[index] }
  },

  // 删除地址
  'address/delete': (data) => {
    const index = addresses.findIndex(addr => addr.id === data.id)
    if (index === -1) {
      return { code: 1, message: '地址不存在' }
    }
    
    const deletedAddress = addresses.splice(index, 1)[0]
    
    // 如果删除的是默认地址，则将第一个地址设为默认
    if (deletedAddress.isDefault && addresses.length > 0) {
      addresses[0].isDefault = true
    }
    
    return { code: 0, message: '删除成功' }
  },

  // 设置默认地址
  'address/setDefault': (data) => {
    const address = addresses.find(addr => addr.id === data.id)
    if (!address) {
      return { code: 1, message: '地址不存在' }
    }
    
    addresses.forEach(addr => addr.isDefault = false)
    address.isDefault = true
    
    return { code: 0, data: address }
  },

  // 获取默认地址
  'address/default': () => {
    const defaultAddress = addresses.find(addr => addr.isDefault)
    return defaultAddress
      ? { code: 0, data: defaultAddress }
      : { code: 1, message: '没有默认地址' }
  }
} 