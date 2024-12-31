// 地址列表数据
export const addressList = [
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    province: '山东省',
    city: '淄博市',
    district: '张店区',
    address: '人民路100号',
    isDefault: true // 默认地址
  },
  {
    id: 2,
    name: '李四',
    phone: '13800138001',
    province: '山东省',
    city: '淄博市',
    district: '张店区',
    address: '共青团路200号',
    isDefault: false
  }
]

// 地址相关接口
export const addressApi = {
  // 获取地址列表
  'address/list': () => {
    return {
      code: 0,
      data: addressList,
      message: 'success'
    }
  }
} 