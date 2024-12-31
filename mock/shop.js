// 门店列表数据
const shopList = [
  {
    id: 1,
    name: '淄博烧烤店(总店)',
    rating: 4.8,
    monthlySales: 999,
    distance: 0.5,
    address: '淄博市张店区人民路100号',
    notice: '欢迎光临，本店特色烧烤，欢迎品尝！'
  },
  {
    id: 2,
    name: '淄博烧烤店(分店)',
    rating: 4.7,
    monthlySales: 888,
    distance: 1.2,
    address: '淄博市张店区共青团路200号',
    notice: '分店新开业，优惠多多！'
  },
  {
    id: 3,
    name: '淄博烧烤店(南昌店)',
    rating: 4.9,
    monthlySales: 1234,
    distance: 2.1,
    address: '淄博市南昌店区共111号',
    notice: '欢迎光临，优惠多多！'
  }
]

// 门店相关接口
export const shopApi = {
  // 获取门店列表
  'shop/list': () => {
    return {
      code: 0,
      data: shopList,
      message: 'success'
    }
  },

  // 获取门店详情
  'shop/detail': (req) => {
    const { id } = req.params
    const shop = shopList.find(item => item.id === Number(id))
    return {
      code: shop ? 0 : -1,
      data: shop,
      message: shop ? 'success' : '门店不存在'
    }
  },

  // 获取当前门店
  'shop/current': () => {
    return {
      code: 0,
      data: shopList[0], // 默认返回第一个门店
      message: 'success'
    }
  }
} 