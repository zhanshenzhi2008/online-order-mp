import { createSSRApp } from 'vue'
import store from './stores'
import AsyncLoading from './components/AsyncLoading.vue'
import AsyncError from './components/AsyncError.vue'
import App from './App'

// 全局异步组件加载配置
const asyncComponentOptions = {
	loadingComponent: AsyncLoading,
	errorComponent: AsyncError,
	delay: 200,
	timeout: 10000
}

export function createApp() {
	const app = createSSRApp(App)
	
	// 注册全局异步组件
	app.component('async-loading', AsyncLoading)
	app.component('async-error', AsyncError)
	
	// 配置全局异步组件选项
	app.config.globalProperties.$asyncComponentOptions = asyncComponentOptions
	
	app.use(store)
	
	return {
		app
	}
}