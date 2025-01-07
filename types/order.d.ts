// 订单相关类型定义
export interface OrderItem {
  id: string
  foodId: number
  name: string
  price: number
  quantity: number
  specs?: string[]
  additions?: string[]
}

export interface Order {
  id: string
  orderNo: string
  status: OrderStatus
  items: OrderItem[]
  totalAmount: number
  deliveryFee?: number
  actualTotal: number
  createTime: string
  deliveryType: 'delivery' | 'selfPickup'
  address?: Address
} 