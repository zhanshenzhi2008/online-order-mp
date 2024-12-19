// 地区数据相关 API
let cachedAreaData = null

// 加载本地地区数据
const loadLocalAreaData = () => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: '/static/data/pcas-code.json',
      success: (res) => {
        cachedAreaData = res.data
        resolve(res.data)
      },
      fail: (err) => {
        console.error('加载地区数据失败:', err)
        reject(err)
      }
    })
  })
}

// 确保地区数据已加载
const ensureAreaData = async () => {
  if (!cachedAreaData) {
    await loadLocalAreaData()
  }
  return cachedAreaData
}

// 地区数据 API
export const areaApi = {
  // 获取所有省份
  getProvinces: async () => {
    try {
      const data = await ensureAreaData()
      return Object.entries(data).map(([code, province]) => ({
        code,
        name: province.name
      }))
    } catch (error) {
      console.error('获取省份数据失败:', error)
      return []
    }
  },

  // 获取省份下的城市
  getCities: async (provinceCode) => {
    try {
      const data = await ensureAreaData()
      if (!data[provinceCode] || !data[provinceCode].children) return []
      
      return Object.entries(data[provinceCode].children).map(([code, city]) => ({
        code,
        name: city.name
      }))
    } catch (error) {
      console.error('获取城市数据失败:', error)
      return []
    }
  },

  // 获取城市下的区县
  getDistricts: async (provinceCode, cityCode) => {
    try {
      const data = await ensureAreaData()
      if (!data[provinceCode] || 
          !data[provinceCode].children || 
          !data[provinceCode].children[cityCode] || 
          !data[provinceCode].children[cityCode].children) {
        return []
      }
      
      return Object.entries(data[provinceCode].children[cityCode].children).map(([code, district]) => ({
        code,
        name: district.name
      }))
    } catch (error) {
      console.error('获取区县数据失败:', error)
      return []
    }
  },

  // 预加载数据
  preloadAreaData: async () => {
    return await ensureAreaData()
  }
} 