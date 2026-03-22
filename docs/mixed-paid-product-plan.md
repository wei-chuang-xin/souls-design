# souls.design 混合付费产品方案（MVP）

## 一句话定位
一个面向 OpenClaw / Agent 用户的数字资产商店：免费内容负责传播，付费内容负责变现，账号系统负责沉淀关系。

## 商品分层
- Free：免费，可直接下载
- Premium：付费后下载
- Bundle：多个 Soul / Skill / Prompt 打包售卖

## 核心设计原则
1. 内容类型（Soul / Skill / Prompt / Team）与售卖属性分离
2. 免费内容做流量入口，付费内容做高价值转化
3. 登录系统用于沉淀收藏、下载、已购资产
4. MVP 先跑通第一笔交易，不追求大而全

## 用户路径
### 免费用户
首页/SEO -> 浏览 -> 详情页 -> 直接下载 -> 可选登录

### 付费用户
浏览 -> 详情页 -> 看到 Premium 标识 -> 登录 -> 购买 -> 下载 -> 进入个人中心复购

### 老用户
登录 -> Library / Favorites / Downloads -> 再次下载 / 购买更多

## 页面策略
### 首页
- Browse Free
- Explore Premium
- 热门免费 / 精选付费 / 最新上架 / Bundle 推荐

### 列表页
支持按以下维度筛选：
- All / Free / Premium / Bundle
- Soul / Skill / Prompt / Team
- 热门 / 最新 / 下载最多

### 详情页 CTA 逻辑
#### Free
- 未登录：Download Free
- 已登录：Download Free + Save

#### Paid
- 未登录：Sign in to Buy
- 已登录未购买：Buy Now
- 已购买：Download
- 已购买且已下载：Download Again

## 账号体系
登录后可获得：
- Favorites
- Downloads
- Purchased / Library
- 后续扩展：更新提醒、License、订单记录

## MVP 必做
- 免费/付费商品标识
- 商品详情双模式
- 登录
- 收藏
- 下载记录
- 已购记录
- PayPal 单支付通道
- Library 页面

## MVP 暂不做
- 订阅制
- 多支付渠道
- 优惠券
- 评论系统
- 创作者后台
- 分销
- 复杂推荐系统

## 推荐路线
### Phase 1
完成混合付费 MVP，目标：跑通第一笔订单

### Phase 2
提升转化：优化详情页文案、related items、Bundle、案例背书

### Phase 3
提升复购：更新通知、已购升级包、邮件营销
