import { userApi } from './user'
import { cartApi } from './cart'
import { orderApi } from './order'
import { addressApi } from './address'
import { foodApi } from './food'

// 统一导出所有 mock API
export const mockApi = {
  ...userApi,
  ...cartApi,
  ...orderApi,
  ...addressApi,
  ...foodApi
}

// 统一导出所有 mock 数据，方便其他模块直接使用
export * from './user'
export * from './cart'
export * from './order'
export * from './address'
export * from './food' 