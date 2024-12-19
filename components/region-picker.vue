<template>
  <view class="region-picker">
    <!-- 常规选择器和搜索图标 -->
    <view class="picker-container">
      <view class="picker-row">
        <!-- 省份选择 -->
        <picker 
          class="picker-item"
          :range="provinces" 
          range-key="name"
          :value="provinceIndex"
          @change="onProvinceChange"
        >
          <text :class="{'placeholder': !selectedRegion.province}">
            {{(selectedRegion.province && selectedRegion.province.name) || '选择省份'}}
          </text>
        </picker>

        <!-- 城市选择 -->
        <picker 
          class="picker-item"
          :range="cities" 
          range-key="name"
          :value="cityIndex"
          :disabled="!selectedRegion.province"
          @change="onCityChange"
        >
          <text :class="{'placeholder': !selectedRegion.city}">
            {{(selectedRegion.city && selectedRegion.city.name) || '选择城市'}}
          </text>
        </picker>

        <!-- 区县选择 -->
        <picker 
          class="picker-item"
          :range="districts" 
          range-key="name"
          :value="districtIndex"
          :disabled="!selectedRegion.city"
          @change="onDistrictChange"
        >
          <text :class="{'placeholder': !selectedRegion.district}">
            {{(selectedRegion.district && selectedRegion.district.name) || '选择区县'}}
          </text>
        </picker>
      </view>

      <view class="action-icons">
        <!-- 搜索图标 -->
        <view class="icon-btn" @tap="showSearchPopup">
          <uni-icons type="search" size="18" color="#666"></uni-icons>
        </view>
        <!-- 清空图标 -->
        <view 
          class="icon-btn" 
          v-if="hasSelectedRegion"
          @tap="clearAll"
        >
          <uni-icons type="clear" size="14" color="#999"></uni-icons>
        </view>
      </view>
    </view>

    <!-- 搜索弹窗 -->
    <uni-popup ref="searchPopup" type="center">
      <view class="search-popup">
        <view class="search-header">
          <view class="search-input-wrapper">
            <uni-icons type="search" size="16" color="#666"></uni-icons>
            <input 
              class="search-input"
              type="text"
              v-model="searchText"
              placeholder="请输入省市区名称搜索"
              @input="handleSearch"
              focus
            />
            <view 
              class="clear-icon" 
              v-if="searchText"
              @tap="clearSearch"
            >
              <uni-icons type="clear" size="14" color="#999"></uni-icons>
            </view>
          </view>
          <text class="cancel-btn" @tap="hideSearchPopup">取消</text>
        </view>

        <!-- 搜索结果列表 -->
        <scroll-view 
          v-if="searchResults.length > 0"
          class="search-results"
          scroll-y
        >
          <!-- 提示信息 -->
          <view class="search-tip" v-if="totalMatchCount > maxSearchResults">
            <text>共找到 {{totalMatchCount}} 条结果，仅显示前 {{maxSearchResults}} 条</text>
          </view>
          
          <view 
            class="search-item"
            v-for="(item, index) in searchResults" 
            :key="index"
            @tap="selectSearchResult(item)"
          >
            <text>{{item.fullName}}</text>
          </view>
        </scroll-view>

        <!-- 无结果提示 -->
        <view v-else-if="searchText" class="no-result">
          <text>未找到相关地区</text>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { areaApi } from '@/utils/api'

const props = defineProps({
  value: String
})

const emit = defineEmits(['update:value', 'change'])

const searchPopup = ref(null)
const provinces = ref([])
const cities = ref([])
const districts = ref([])
const selectedRegion = ref({
  province: '',
  city: '',
  district: ''
})

// 计算是否有选择的地区
const hasSelectedRegion = computed(() => {
  return selectedRegion.value.province || 
         selectedRegion.value.city || 
         selectedRegion.value.district
})

// 搜索相关
const searchText = ref('')
const searchResults = ref([])
const allRegions = ref([])
const maxSearchResults = 10  // 最大显示结果数
const totalMatchCount = ref(0)  // 总匹配数

// 显示搜索弹窗
const showSearchPopup = () => {
  searchPopup.value.open()
}

// 隐藏搜索弹窗
const hideSearchPopup = () => {
  searchText.value = ''
  searchResults.value = []
  searchPopup.value.close()
}

// 清空搜索
const clearSearch = () => {
  searchText.value = ''
  searchResults.value = []
}

// 清空所有选择
const clearAll = () => {
  searchText.value = ''
  searchResults.value = []
  selectedRegion.value = {
    province: '',
    city: '',
    district: ''
  }
  cities.value = []
  districts.value = []
  provinceIndex.value = -1
  cityIndex.value = -1
  districtIndex.value = -1
  updateValue()
}

// 加载所有地区据用于搜索
const loadAllRegions = async () => {
  const provinces = await areaApi.getProvinces()
  
  for (const province of provinces) {
    // 添加省份
    allRegions.value.push({
      type: 'province',
      code: province.code,
      name: province.name,
      fullName: province.name
    })
    
    const cities = await areaApi.getCities(province.code)
    for (const city of cities) {
      // 添加城市
      allRegions.value.push({
        type: 'city',
        provinceCode: province.code,
        provinceName: province.name,
        code: city.code,
        name: city.name,
        fullName: `${province.name}${city.name}`
      })
      
      const districts = await areaApi.getDistricts(province.code, city.code)
      for (const district of districts) {
        // 添加区县
        allRegions.value.push({
          type: 'district',
          provinceCode: province.code,
          provinceName: province.name,
          cityCode: city.code,
          cityName: city.name,
          code: district.code,
          name: district.name,
          fullName: `${province.name}${city.name}${district.name}`
        })
      }
    }
  }
}

// 处理搜索
const handleSearch = () => {
  if (!searchText.value) {
    searchResults.value = []
    totalMatchCount.value = 0
    return
  }
  
  const matches = allRegions.value.filter(item => 
    item.fullName.includes(searchText.value)
  )
  
  totalMatchCount.value = matches.length
  searchResults.value = matches.slice(0, maxSearchResults)
}

// 选择搜索结果
const selectSearchResult = async (item) => {
  hideSearchPopup()
  
  if (item.type === 'province') {
    await selectProvince({
      code: item.code,
      name: item.name
    })
  } else if (item.type === 'city') {
    await selectProvince({
      code: item.provinceCode,
      name: item.provinceName
    })
    await selectCity({
      code: item.code,
      name: item.name
    })
  } else if (item.type === 'district') {
    await selectProvince({
      code: item.provinceCode,
      name: item.provinceName
    })
    await selectCity({
      code: item.cityCode,
      name: item.cityName
    })
    selectDistrict({
      code: item.code,
      name: item.name
    })
  }
}

// 加载省份数据
const loadProvinces = async () => {
  provinces.value = await areaApi.getProvinces()
}

// 加载城市数据
const loadCities = async (provinceCode) => {
  if (!provinceCode) {
    cities.value = []
    return
  }
  cities.value = await areaApi.getCities(provinceCode)
}

// 加载区县数据
const loadDistricts = async (provinceCode, cityCode) => {
  if (!provinceCode || !cityCode) {
    districts.value = []
    return
  }
  districts.value = await areaApi.getDistricts(provinceCode, cityCode)
}

// 防抖控制
const isSelecting = ref(false)

// 当前选的索引
const provinceIndex = ref(-1)
const cityIndex = ref(-1)
const districtIndex = ref(-1)

// 省份选择改变
const onProvinceChange = async (e) => {
  const index = e.detail.value
  if (index < 0 || index >= provinces.value.length) return
  
  provinceIndex.value = index
  const province = provinces.value[index]
  
  await selectProvince(province)
  cityIndex.value = -1
  districtIndex.value = -1
}

// 城市选择改变
const onCityChange = async (e) => {
  const index = e.detail.value
  if (index < 0 || index >= cities.value.length) return
  
  cityIndex.value = index
  const city = cities.value[index]
  
  await selectCity(city)
  districtIndex.value = -1
}

// 区县选择改变
const onDistrictChange = (e) => {
  const index = e.detail.value
  if (index < 0 || index >= districts.value.length) return
  
  districtIndex.value = index
  const district = districts.value[index]
  
  selectDistrict(district)
}

// 选择省份
const selectProvince = async (province) => {
  selectedRegion.value.province = province
  selectedRegion.value.city = ''
  selectedRegion.value.district = ''
  await loadCities(province.code)
  updateValue()
}

// 选择城市
const selectCity = async (city) => {
  selectedRegion.value.city = city
  selectedRegion.value.district = ''
  await loadDistricts(selectedRegion.value.province.code, city.code)
  updateValue()
}

// 选择区县
const selectDistrict = (district) => {
  selectedRegion.value.district = district
  updateValue()
}

// 更新值
const updateValue = () => {
  const value = [
    selectedRegion.value.province && selectedRegion.value.province.name,
    selectedRegion.value.city && selectedRegion.value.city.name,
    selectedRegion.value.district && selectedRegion.value.district.name
  ].filter(Boolean).join('')
  
  emit('update:value', value)
  emit('change', {
    value,
    province: (selectedRegion.value.province && selectedRegion.value.province.name) || '',
    city: (selectedRegion.value.city && selectedRegion.value.city.name) || '',
    district: (selectedRegion.value.district && selectedRegion.value.district.name) || ''
  })
}

// 监听value变化
watch(() => props.value, (newValue) => {
  if (!newValue) {
    selectedRegion.value = {
      province: '',
      city: '',
      district: ''
    }
    provinceIndex.value = -1
    cityIndex.value = -1
    districtIndex.value = -1
  }
}, { immediate: true })

// 初始化数据
onMounted(async () => {
  await areaApi.preloadAreaData()
  await loadProvinces()
  await loadAllRegions() // 加载所有地区数据用于搜索
})
</script>

<style lang="scss">
.region-picker {
  width: 100%;
  
  .picker-container {
    display: flex;
    align-items: center;
    gap: 20rpx;
    
    .picker-row {
      flex: 1;
      display: flex;
      gap: 20rpx;
      
      .picker-item {
        flex: 1;
        height: 60rpx;
        line-height: 60rpx;
        font-size: 28rpx;
        color: #333;
        
        .placeholder {
          color: #999;
        }
      }
    }
    
    .action-icons {
      display: flex;
      align-items: center;
      gap: 10rpx;
      
      .icon-btn {
        width: 40rpx;
        height: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:active {
          opacity: 0.7;
        }
      }
    }
  }
}

.search-popup {
  width: 600rpx;
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  
  .search-header {
    display: flex;
    align-items: center;
    gap: 20rpx;
    padding: 20rpx;
    border-bottom: 1rpx solid #eee;
    
    .search-input-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 10rpx;
      background: #f5f5f5;
      border-radius: 8rpx;
      padding: 0 10rpx;
      
      .search-input {
        flex: 1;
        height: 70rpx;
        line-height: 70rpx;
        font-size: 28rpx;
      }
      
      .clear-icon {
        width: 40rpx;
        height: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:active {
          opacity: 0.7;
        }
      }
    }
    
    .cancel-btn {
      font-size: 28rpx;
      color: #666;
      padding: 10rpx;
      
      &:active {
        opacity: 0.7;
      }
    }
  }
  
  .search-results {
    max-height: 600rpx;
    
    .search-tip {
      padding: 8rpx 20rpx;
      background: #f8f8f8;
      font-size: 22rpx;
      color: #999;
      text-align: center;
      line-height: 1.2;
    }
    
    .search-item {
      padding: 20rpx;
      font-size: 28rpx;
      border-bottom: 1rpx solid #eee;
      
      &:last-child {
        border-bottom: none;
      }
      
      &:active {
        background: #f5f5f5;
      }
    }
  }
  
  .no-result {
    padding: 40rpx;
    text-align: center;
    color: #999;
    font-size: 28rpx;
  }
}
</style> 