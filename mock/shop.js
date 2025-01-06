// 店铺数据
export const shops = [
  {
    id: '1',
    name: '淄博烧烤',
    logo: '/static/images/shop/logo.png',
    banner: '/static/images/shop/banner.jpg',
    description: '正宗淄博烧烤，各种烤串、凉菜、主食应有尽有',
    notice: '欢迎光临，本店所有食材均为当日新鲜采购',
    address: '山东省淄博市张店区人民路100号',
    phone: '0533-1234567',
    businessHours: '10:00-22:00',
    deliveryFee: 5,
    minDeliveryAmount: 20,
    deliveryTime: '30分钟',
    rating: 4.8,
    ratingCount: 1000,
    status: 'open', // open-营业中 closed-休息中
    distance: 1.2,
    monthSales: 3000,
    categories: ['烧烤', '凉菜', '主食']
  },
  {
    id: '2',
    name: '老王烧烤',
    logo: '/static/images/shop/logo2.png',
    banner: '/static/images/shop/banner2.jpg',
    description: '特色烧烤，价格实惠',
    notice: '本店特色烧烤，欢迎品尝',
    address: '山东省淄博市张店区共青团路200号',
    phone: '0533-1234568',
    businessHours: '16:00-02:00',
    deliveryFee: 6,
    minDeliveryAmount: 30,
    deliveryTime: '40分钟',
    rating: 4.6,
    ratingCount: 800,
    status: 'open',
    distance: 2.5,
    monthSales: 2000,
    categories: ['烧烤', '小炒', '饮品']
  }
]

// 店铺相关接口
export const shopApi = {
  // 获取当前店铺信息
  'GET /shop/current': () => {
    return { code: 0, data: shops[0] }
  },

  // 获取店铺列表
  'GET /shop/list': (params) => {
    const { category, page = 1, pageSize = 10 } = params
    let shopList = [...shops]
    if (category) {
      shopList = shopList.filter(shop => shop.categories.includes(category))
    }
    // 模拟分页
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return {
      code: 0,
      data: {
        list: shopList.slice(start, end),
        total: shopList.length,
        page: Number(page),
        pageSize: Number(pageSize),
        hasMore: end < shopList.length
      }
    }
  },

  // 获取店铺信息
  'GET /shop/info': () => {
    return { code: 0, data: shops[0] }
  },

  // 获取店铺评分
  'GET /shop/rating': () => {
    return {
      code: 0,
      data: {
        overall: 4.8,
        taste: 4.9,
        packaging: 4.7,
        delivery: 4.8,
        comments: [
          {
            id: '1',
            userId: '1',
            userName: '张三',
            avatar: '/static/images/avatar.png',
            rating: 5,
            content: '烧烤很好吃，服务态度也很好',
            images: ['/static/images/comments/1.jpg'],
            createTime: '2024-03-20 14:30:00'
          }
        ]
      }
    }
  }
} 