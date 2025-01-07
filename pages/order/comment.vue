<template>
  <view class="comment-page">
    <uni-forms ref="form" :model="formData">
      <uni-forms-item label="总体评分">
        <uni-rate v-model="formData.rating" />
      </uni-forms-item>
      
      <uni-forms-item label="评价内容">
        <textarea 
          v-model="formData.content"
          placeholder="请输入评价内容"
        />
      </uni-forms-item>
      
      <uni-file-picker
        v-model="formData.images"
        mode="grid"
        @success="handleUploadSuccess"
      />
    </uni-forms>
  </view>
</template> 