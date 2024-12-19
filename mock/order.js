// 订单数据
export const orders = [
  {
    id: '1',
    userId: '1',
    items: [
      {
        id: '1',
        foodId: 1,
        name: '羊肉串',
        price: 6,
        quantity: 10,
        image: '/static/images/foods/羊肉串.png',
        specs: [
          { name: '份量', value: '中份', extraPrice: 2 },
          { name: '口味', value: '中辣', extraPrice: 0 }
        ],
        additions: [
          { name: '蒜蓉', quantity: 1, price: 1 }
        ]
      },
      {
        id: '2',
        foodId: 2,
        name: '牛肉串',
        price: 7,
        quantity: 5,
        image: '/static/images/foods/牛肉串.png'
      }
    ],
    total: 125,
    status: 'pending',
    statusText: '待支付',
    totalCount: 15,
    actualTotal: 125,
    address: {
      name: '张三',
      phone: '13800138000',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      detail: '三里屯SOHO 1号楼1单元101室'
    },
    createTime: '2023-12-07 18:00:00',
    payTime: null,
    paymentMethod: null,
    remark: '不要辣',
    deliveryFee: 5,
    packingFee: 2,
    discount: 0,
    estimatedTime: '30分钟'
  },
  {
    id: '2',
    userId: '1',
    items: [
      {
        id: '3',
        foodId: 3,
        name: '凉拌黄瓜',
        price: 12,
        quantity: 1,
        image: '/static/images/foods/凉拌黄瓜.png'
      },
      {
        id: '4',
        foodId: 4,
        name: '五花肉串',
        price: 6,
        quantity: 8,
        image: '/static/images/foods/五花肉串.png'
      }
    ],
    total: 60,
    status: 'delivering',
    statusText: '配送中',
    totalCount: 9,
    actualTotal: 60,
    address: {
      name: '张三',
      phone: '13800138000',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      detail: '三里屯SOHO 1号楼1单元101室'
    },
    createTime: '2023-12-07 17:30:00',
    payTime: '2023-12-07 17:31:00',
    paymentMethod: '微信支付',
    remark: '',
    deliveryFee: 5,
    packingFee: 2,
    discount: 0,
    estimatedTime: '15分钟',
    rider: {
      name: '李师傅',
      phone: '13900139000',
      avatar: '/static/images/rider-avatar.png'
    }
  }
]

// 订单相关接口
export const orderApi = {
  'order/create': (data) => {
    const order = {
      id: Date.now().toString(),
      ...data,
      status: 'pending',
      statusText: '待支付',
      createTime: new Date().toISOString(),
      payTime: null,
      paymentMethod: null,
      totalCount: data.items.reduce((sum, item) => sum + item.quantity, 0),
      actualTotal: data.total - (data.discount || 0)
    }
    orders.unshift(order)
    return { code: 0, data: order }
  },

  'order/list': (params) => {
    let orderList = [...orders]
    if (params.status) {
      orderList = orderList.filter(order => order.status === params.status)
    }
    if (params.userId) {
      orderList = orderList.filter(order => order.userId === params.userId)
    }
    // 添加状态文本
    orderList = orderList.map(order => ({
      ...order,
      statusText: getStatusText(order.status),
      totalCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      actualTotal: order.total - (order.discount || 0)
    }))
    return { code: 0, data: orderList }
  },

  'order/detail': (params) => {
    const order = orders.find(o => o.id === params.id)
    if (order) {
      const orderWithStatus = {
        ...order,
        statusText: getStatusText(order.status),
        totalCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
        actualTotal: order.total - (order.discount || 0)
      }
      return { code: 0, data: orderWithStatus }
    }
    return { code: 1, message: '订单不存在' }
  },

  'order/cancel': (data) => {
    const order = orders.find(o => o.id === data.id)
    if (!order) {
      return { code: 1, message: '订单不存在' }
    }
    if (order.status !== 'pending') {
      return { code: 1, message: '只能取消待支付订单' }
    }
    
    order.status = 'cancelled'
    order.statusText = '已取消'
    return { code: 0, data: order }
  },

  'order/pay': (data) => {
    const order = orders.find(o => o.id === data.id)
    if (!order) {
      return { code: 1, message: '订单不存在' }
    }
    if (order.status !== 'pending') {
      return { code: 1, message: '订单状态不正确' }
    }
    
    order.status = 'paid'
    order.statusText = '待发货'
    order.payTime = new Date().toISOString()
    order.paymentMethod = '微信支付'
    
    return {
      code: 0,
      data: {
        transactionId: 'TX' + Date.now(),
        paymentTime: order.payTime,
        order
      }
    }
  },

  'order/confirm': (data) => {
    const order = orders.find(o => o.id === data.id)
    if (!order) {
      return { code: 1, message: '订单不存在' }
    }
    if (order.status !== 'delivering') {
      return { code: 1, message: '订单状态不正确' }
    }
    
    order.status = 'completed'
    order.statusText = '已完成'
    return { code: 0, data: order }
  }
}

// 获取订单状态文本
const getStatusText = (status) => {
  const statusMap = {
    pending: '待支付',
    paid: '待发货',
    preparing: '备货中',
    delivering: '配送中',
    completed: '已完成',
    cancelled: '已取消',
    refunding: '退款中',
    refunded: '已退款'
  }
  return statusMap[status] || status
} 