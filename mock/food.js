// 食品数据
export const foods = [
  {
    id: 1,
    name: '烤羊肉串',
    price: 6,
    image: '/static/images/foods/羊肉串.png',
    description: '新疆羔羊肉，鲜嫩多汁',
    category: '烧烤',
    specs: [
      {
        name: '份量',
        options: [
          { name: '小份', value: '小份', extraPrice: 0 },
          { name: '中份', value: '中份', extraPrice: 2 },
          { name: '大份', value: '大份', extraPrice: 4 }
        ]
      },
      {
        name: '口味',
        options: [
          { name: '微辣', value: '微辣', extraPrice: 0 },
          { name: '中辣', value: '中辣', extraPrice: 0 },
          { name: '特辣', value: '特辣', extraPrice: 0 }
        ]
      }
    ],
    additions: [
      { name: '蒜蓉', price: 1 },
      { name: '辣椒', price: 1 },
      { name: '孜然', price: 1 }
    ],
    sales: 1000,
    rating: 4.8
  }
  // ... 其他食品数据
]

// 食品相关接口
export const foodApi = {
  // 获取食品列表
  'GET /food/list': (params) => {
    const { category } = params
    let foodList = [...foods]
    if (category) {
      foodList = foodList.filter(food => food.category === category)
    }
    return { code: 0, data: foodList }
  },

  // 获取食品详情
  'GET /food/detail': (params) => {
    const { id } = params
    const food = foods.find(f => f.id === Number(id))
    if (food) {
      return { code: 0, data: food }
    }
    return { code: 1, message: '食品不存在' }
  },

  // 获取食品分类
  'GET /food/categories': () => {
    return {
      code: 0,
      data: [
        { id: 1, name: '烧烤', icon: '/static/images/categories/烧烤.png' },
        { id: 2, name: '凉菜', icon: '/static/images/categories/凉菜.png' },
        { id: 3, name: '主食', icon: '/static/images/categories/主食.png' },
        { id: 4, name: '饮品', icon: '/static/images/categories/饮品.png' }
      ]
    }
  }
} 