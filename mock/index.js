// 导入所有 mock 接口
import { orderApi } from './order'
import { cartApi } from './cart'
import { userApi } from './user'
import { foodApi } from './food'
import { shopApi } from './shop'
import { addressApi } from './address'
import { paymentApi } from './payment'

// 统一导出所有 mock 接口
export default {
  orderApi,
  cartApi,
  userApi,
  foodApi,
  shopApi,
  addressApi,
  paymentApi
} 