# 点餐小程序

基于 uni-app 开发的点餐小程序，支持微信小程序和 H5 两种运行方式。

## 功能特性

### 用户端
- 菜品浏览和搜索
  - 分类展示
  - 菜品详情
  - 关键词搜索
- 购物车管理
  - 添加/删除商品
  - 修改数量
  - 清空购物车
- 订单管理
  - 订单创建
  - 订单列表
  - 订单详情
  - 订单状态跟踪
- 地址管理
  - 添加/编辑地址
  - 设置默认地址
- 用户中心
  - 个人信息 
  - 收藏管理 TBD
- 支付功能
  - 微信支付 
  - H5支付 TBD
- 订单评价
  - 评分打星 TBD
  - 文字点评 TBD
  - 图片上传 TBD

## 技术栈
- 前端框架：Vue 3
- 跨端框架：uni-app
- 状态管理：Pinia
- 样式处理：Sass
- 构建工具：Vite 4

## 环境要求
- Node.js 14.0+
- npm 或 yarn
- HBuilder X (或WebStormpushpu)
- 微信开发者工具（小程序开发必需）


## 安装和运行

### 安装依赖

```bash
npm install
# 或
yarn install
```

2. 运行开发环境：

H5 版本：
```bash
npm run dev:h5
# 或
yarn dev:h5
```

微信小程序版本：
```bash
npm run dev:mp-weixin
# 或
yarn dev:mp-weixin
```

3. 打包构建：

H5 版本：
```bash
npm run build:h5
# 或
yarn build:h5
```

微信小程序版本：
```bash
npm run build:mp-weixin
# 或
yarn build:mp-weixin
```

## 目录结构
```
├── src/                 # 源代码目录  uniapp默认框架没有这一层。该工程没有src这层
│   ├── components/     # 公共组件
│   ├── pages/          # 页面文件
│   ├── static/         # 静态资源
│   ├── store/          # Pinia 状态管理
│   ├── utils/          # 工具函数
│   ├── App.vue         # 应用入口
│   ├── main.js         # 主入口
│   ├── manifest.json   # 应用配置
│   └── pages.json      # 页面配置
├── dist/               # 编译输出目录
├── node_modules/       # 依赖包
├── .gitignore         # Git 忽略文件
├── package.json       # 项目配置
└── README.md          # 项目说明文档
```

## 开发配置

[rest of the content remains the same...]
