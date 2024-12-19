<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
/*每个页面公共css */
page {
  background-color: #f5f5f5;
}

/* 主题色 */
:root {
  --primary-color: #ff0000;
  --primary-color-light: #ff3333;
  --primary-color-dark: #cc0000;
}

/* 文字大小 */
.font-sm {
  font-size: 24rpx;
}
.font-md {
  font-size: 28rpx;
}
.font-lg {
  font-size: 32rpx;
}
.font-xl {
  font-size: 36rpx;
}

/* 文字颜色 */
.text-primary {
  color: var(--primary-color);
}
.text-gray {
  color: #999;
}
.text-dark {
  color: #333;
}

/* 边距 */
.m-2 {
  margin: 20rpx;
}
.p-2 {
  padding: 20rpx;
}
.mt-2 {
  margin-top: 20rpx;
}
.mb-2 {
  margin-bottom: 20rpx;
}

/* 弹性布局 */
.flex {
  display: flex;
}
.flex-row {
  flex-direction: row;
}
.flex-column {
  flex-direction: column;
}
.justify-between {
  justify-content: space-between;
}
.justify-center {
  justify-content: center;
}
.align-center {
  align-items: center;
}

/* 按钮样式 */
.btn {
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  border-radius: 44rpx;
  font-size: 32rpx;
  
  &.btn-primary {
    background-color: var(--primary-color);
    color: #fff;
  }
  
  &.btn-outline {
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    background-color: #fff;
  }
  
  &:disabled {
    background-color: #ccc;
    border-color: #ccc;
    color: #fff;
  }
}

/* 表单样式 */
.form-item {
  background-color: #fff;
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  
  .label {
    width: 160rpx;
    font-size: 28rpx;
    color: #333;
  }
  
  .input {
    flex: 1;
    height: 44rpx;
    font-size: 28rpx;
  }
}

/* 卡片样式 */
.card {
  background-color: #fff;
  border-radius: 12rpx;
  margin: 20rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}
</style> 