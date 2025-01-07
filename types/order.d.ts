// 订单相关类型定义
export type OrderStatus = 'pending' | 'paid' | 'delivering' | 'completed' | 'cancelled'

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
  statusText: string
  items: OrderItem[]
  totalAmount: number
  deliveryFee?: number
  actualTotal: number
  createTime: string
  deliveryType: 'delivery' | 'selfPickup'
  pickupType?: 'dineIn' | 'takeout'
  address?: Address
}

export interface ApiResponse<T> {
  code: number
  message?: string
  data: T
} 