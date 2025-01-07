// 地址数据
export const addresses = [{
		id: '1',
		userId: '1',
		name: '张三',
		phone: '13800138000',
		province: '北京市',
		city: '北京市',
		district: '朝阳区',
		detail: '三里屯SOHO 1号楼1单元101室',
		isDefault: true,
		tag: '公司'
	},
	{
		id: '2',
		userId: '1',
		name: '张三',
		phone: '13800138000',
		province: '北京市',
		city: '北京市',
		district: '海淀区',
		detail: '中关村软件园 2号楼3层',
		isDefault: false,
		tag: '家'
	}
]

// 地址相关接口
export const addressApi = {
	// 获取地址列表
	'GET /address/list': () => {
		return {
			code: 0,
			data: addresses.map(addr => ({
				...addr,
				address: `${addr.province}${addr.city}${addr.district}${addr.detail}`
			}))
		}
	},

	// 添加地址
	'POST /address/add': (data) => {
		const address = {
			id: Date.now().toString(),
			...data
		}

		// 如果是第一个地址或设置为默认地址
		if (addresses.length === 0 || address.isDefault) {
			addresses.forEach(addr => addr.isDefault = false)
			address.isDefault = true
		}

		addresses.push(address)
		return {
			code: 0,
			data: address
		}
	},

	// 更新地址
	'POST /address/update': (data) => {
		const index = addresses.findIndex(addr => addr.id === data.id)
		if (index === -1) {
			return {
				code: 1,
				message: '地址不存在'
			}
		}

		// 如果设置为默认地址
		if (data.isDefault) {
			addresses.forEach(addr => addr.isDefault = false)
		}

		addresses[index] = {
			...addresses[index],
			...data
		}
		return {
			code: 0,
			data: addresses[index]
		}
	},

	// 删除地址
	'POST /address/delete': (data) => {
		const index = addresses.findIndex(addr => addr.id === data.id)
		if (index === -1) {
			return {
				code: 1,
				message: '地址不存在'
			}
		}

		const deletedAddress = addresses.splice(index, 1)[0]

		// 如果删除的是默认地址，则将第一个地址设为默认
		if (deletedAddress.isDefault && addresses.length > 0) {
			addresses[0].isDefault = true
		}

		return {
			code: 0,
			message: '删除成功'
		}
	},

	// 设置默认地址
	'POST /address/setDefault': (data) => {
		const address = addresses.find(addr => addr.id === data.id)
		if (!address) {
			return {
				code: 1,
				message: '地址不存在'
			}
		}

		addresses.forEach(addr => addr.isDefault = false)
		address.isDefault = true

		return {
			code: 0,
			data: address
		}
	},

	// 获取默认地址
	'GET /address/default': () => {
		const defaultAddress = addresses.find(addr => addr.isDefault)
		return defaultAddress ?
			{
				code: 0,
				data: defaultAddress
			} :
			{
				code: 1,
				message: '没有默认地址'
			}
	}
}