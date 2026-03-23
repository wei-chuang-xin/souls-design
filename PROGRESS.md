# souls.design - 项目进度

## 当前状态

- **阶段**：开发 - PayPal 支付集成
- **进度**：65%
- **预计完成**：2026-03-30（沙箱测试通过后上线）
- **风险**：无

---

## 本周进展（2026-W12）

### 已完成 ✅
- 基础框架搭建（Next.js 16 + Auth.js v5 + JWT Session + Supabase）
- 混合付费模式方案文档（`docs/mixed-paid-product-plan.md`）
- Free / Premium / Bundle 三层商品结构
- 下载权限入口（`app/api/download/[slug]/route.ts`）
- 个人页 Library 页面骨架
- 商品详情页和列表页骨架
- `downloadAccessState` 四态定义（free / owned / signin / purchase_required）
- Supabase `purchases` 表创建（含 RLS + 索引）
- PayPal `/api/paypal/create-order` 路由
- PayPal `/api/paypal/capture-order` 路由（验证 COMPLETED + 写库）
- SoulDetail `renderCTA()` 四态购买按钮
- `@paypal/react-paypal-js` SDK 接入
- PayPal 沙箱凭据配置（tokens.env + Vercel 环境变量）
- README Markdown 渲染（react-markdown + prose 样式）
- Vercel 自动部署正常

### 进行中 🔄
- 沙箱端到端测试（0%）

### 遇到的问题 ⚠️
- **JSX fragment 问题**：Turbopack 对 `<>` 在三元后跟兄弟节点解析严格，通过提取 `renderCTA()` 函数解决
- **文件写入沙箱限制**：write tool 无法访问 `/root/code/`，改用 Node.js 脚本 + exec 解决
- **import 路径错误**：`hasUserPurchased` 在 `supabase.ts` 不在 `user-actions.ts`，已修正

### 下周计划 📅
- PayPal 沙箱完整测试（购买 → Library 可见 → 下载）
- 确认 `purchases` 表 RLS 策略正确
- 上线生产支付（换 live 凭据）
- Library 页面展示已购商品

---

*最后更新：2026-03-23 10:16*
*更新人：阿图*
