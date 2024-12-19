// 商品分类
export const categories = [
  { id: 1, name: '烤串', icon: '/static/images/foods/烤串.png' },
  { id: 2, name: '凉菜', icon: '/static/images/foods/凉菜.png' },
  { id: 3, name: '主食', icon: '/static/images/foods/主食.png' },
  { id: 4, name: '饮品', icon: '/static/images/foods/饮品.png' },
  { id: 5, name: '小吃', icon: '/static/images/foods/小吃.png' },
  { id: 6, name: '套餐', icon: '/static/images/foods/套餐.png' }
]

// 商品列表
export const foods = [
  {
    id: 1,
    categoryId: 1,
    name: '羊肉串',
    price: 6,
    image: '/static/images/foods/羊肉串.png',
    description: '新疆羔羊精选部位，鲜嫩多汁',
    tags: ['招牌', '特价', '人气top3'],
    sales: 1000,
    rating: 4.9,
    stock: 200
  },
  {
    id: 2,
    categoryId: 1,
    name: '牛肉串',
    price: 7,
    image: '/static/images/foods/牛肉串.png',
    description: '澳洲进口牛肉，肉质鲜美',
    tags: ['热销', '新品'],
    sales: 800,
    rating: 4.8,
    stock: 150
  },
  {
    id: 3,
    categoryId: 2,
    name: '凉拌黄瓜',
    price: 12,
    image: '/static/images/foods/凉拌黄瓜.png',
    description: '爽口开胃，特制秘制酱料',
    tags: ['开胃', '清爽'],
    sales: 500,
    rating: 4.7,
    stock: 100
  },
  {
    id: 4,
    categoryId: 1,
    name: '五花肉串',
    price: 6,
    image: '/static/images/foods/五花肉串.png',
    description: '精选五花肉，肥瘦均匀',
    tags: ['热销', '推荐'],
    sales: 900,
    rating: 4.8,
    stock: 180
  },
  {
    id: 5,
    categoryId: 2,
    name: '口水鸡',
    price: 28,
    image: '/static/images/foods/口水鸡.png',
    description: '麻辣鲜香，回味无穷',
    tags: ['招牌', '推荐'],
    sales: 600,
    rating: 4.9,
    stock: 80
  },
  {
    id: 6,
    categoryId: 3,
    name: '蒜香炒饭',
    price: 22,
    image: '/static/images/foods/蒜香炒饭.png',
    description: '蒜香浓郁，粒粒分明',
    tags: ['主食', '热销'],
    sales: 700,
    rating: 4.7,
    stock: 120
  }
]

// 商品规格
export const specifications = [
  {
    id: '1',
    foodId: 1,
    name: '份量',
    options: [
      { id: '1', name: '小份', price: 0, stock: 100 },
      { id: '2', name: '中份', price: 2, stock: 100 },
      { id: '3', name: '大份', price: 4, stock: 100 }
    ]
  },
  {
    id: '2',
    foodId: 1,
    name: '口味',
    options: [
      { id: '1', name: '微辣', price: 0, stock: -1 },
      { id: '2', name: '中辣', price: 0, stock: -1 },
      { id: '3', name: '特辣', price: 0, stock: -1 }
    ]
  }
]

// 加料选项
export const additions = [
  {
    id: '1',
    name: '蒜蓉',
    price: 1,
    image: '/static/images/foods/蒜蓉.png',
    stock: 200,
    maxCount: 2
  },
  {
    id: '2',
    name: '香菜',
    price: 1,
    image: '/static/images/foods/香菜.png',
    stock: 200,
    maxCount: 2
  }
]

// 商品相关接口
export const foodApi = {
  // 获取分类列表
  'food/categories': () => ({
    code: 0,
    data: categories
  }),

  // 获取分类下的商品
  'food/list': (options) => ({
    code: 0,
    data: options.categoryId 
      ? foods.filter(food => food.categoryId === parseInt(options.categoryId)) 
      : foods
  }),

  // 获取推荐商品
  'food/recommend': () => ({
    code: 0,
    data: foods.sort(() => Math.random() - 0.5).slice(0, 4)
  }),

  // 搜索商品
  'food/search': (options) => ({
    code: 0,
    data: foods.filter(food => 
      food.name.includes(options.keyword) || 
      food.description.includes(options.keyword)
    )
  })
} 