import { defineStore } from 'pinia' 
import { foodApi } from '@/utils/api'

export const useFoodStore = defineStore('food', {
  state: () => ({
    categories: [],
    foodList: [],
    currentCategory: null,
    loading: false,
    error: null,
    recommendFoods: []
  }),

  getters: {
    // 获取所有分类
    getAllCategories: (state) => state.categories,
    
    // 获取当前分类的商品
    getCurrentCategoryFoods: (state) => {
      if (!state.currentCategory) return state.foodList
      return state.foodList.filter(food => food.categoryId === state.currentCategory)
    },
    
    // 根据id获取商品详情
    getFoodById: (state) => {
      return (id) => state.foodList.find(food => food.id === id)
    },

    // 获取推荐商品
    getRecommendFoods: (state) => state.recommendFoods
  },

  actions: {
    // 设置当前分类
    setCurrentCategory(categoryId) {
      this.currentCategory = categoryId
    },

    // 设置错误信息
    setError(error) {
      this.error = error
      console.error('Food store error:', error)
    },

    // 获取分类列表
    async fetchCategories() {
      this.loading = true
      this.error = null
      try {
        const res = await foodApi.getCategories()
        if (res.code === 0) {
          this.categories = res.data
          return {
            success: true,
            data: this.categories
          }
        } else {
          throw new Error(res.message || '获取分类失败')
        }
      } catch (error) {
        this.setError(error)
        return {
          success: false,
          message: error.message || '获取分类失败'
        }
      } finally {
        this.loading = false
      }
    },

    // 获取商品列表
    async fetchFoodList(categoryId = null) {
      this.loading = true
      this.error = null
      try {
        const res = await foodApi.getFoodsByCategory(categoryId)
        if (res.code === 0) {
          this.foodList = res.data
          return {
            success: true,
            data: this.foodList
          }
        } else {
          throw new Error(res.message || '获取商品列表失败')
        }
      } catch (error) {
        this.setError(error)
        return {
          success: false,
          message: error.message || '获取商品列表失败'
        }
      } finally {
        this.loading = false
      }
    },

    // 搜索商品
    async searchFoods(keyword) {
      this.loading = true
      this.error = null
      try {
        const res = await foodApi.searchFoods(keyword)
        if (res.code === 0) {
          return {
            success: true,
            data: res.data
          }
        } else {
          throw new Error(res.message || '搜索商品失败')
        }
      } catch (error) {
        this.setError(error)
        return {
          success: false,
          message: error.message || '搜索商品失败'
        }
      } finally {
        this.loading = false
      }
    },

    // 获取推荐商品
    async fetchRecommendFoods() {
      this.loading = true
      this.error = null
      try {
        const res = await foodApi.getRecommendFoods()
        if (res.code === 0) {
          this.recommendFoods = res.data
          return {
            success: true,
            data: this.recommendFoods
          }
        } else {
          throw new Error(res.message || '获取推荐商品失败')
        }
      } catch (error) {
        this.setError(error)
        return {
          success: false,
          message: error.message || '获取推荐商品失败'
        }
      } finally {
        this.loading = false
      }
    }
  }
}) 