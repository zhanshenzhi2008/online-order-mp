import { createPinia } from 'pinia'
import { useUserStore } from './user'
import { useCartStore } from './cart'
import { useOrderStore } from './order'
import { useAddressStore } from './address'
import { useFoodStore } from './food'
import { useDeliveryStore } from './delivery'
import { useStoreStore } from './store'
import { useMenuStore } from './menu'

// 创建 pinia 实例
const store = createPinia()

// 导出 store 实例
export default store

// 统一导出所有 store
export {
  useUserStore,
  useCartStore,
  useOrderStore,
  useAddressStore,
  useFoodStore,
  useDeliveryStore,
  useStoreStore,
  useMenuStore
}