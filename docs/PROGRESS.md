# souls.design - 项目进度

## 当前状态

- **阶段**：MVP 完成 ✅
- **进度**：80%
- **下一步**：Library 页面 + 真实商品上架
- **风险**：无

---

## 本周进展（2026-W14）

### 2026-04-05 ✅

**完成的核心功能：**
- ✅ PayPal 沙箱端到端测试通过
- ✅ 下载功能（动态生成 ZIP）
- ✅ 权限验证（已购商品才能下载）
- ✅ 修复认证问题（fetch + credentials）
- ✅ 修复 TypeScript 类型错误
- ✅ 记录 PayPal 测试账号

**技术细节：**
- 下载按钮从 `<a>` 改为 `<button>` + `fetch`
- JSZip 使用 `arraybuffer` 类型
- 动态生成 README.md + SKILL.md

**测试商品：**
- payment-test-skill ($9.90)
- 完整购买流程验证通过

---

## 已完成功能

### 基础框架
- ✅ Next.js 16 + Auth.js v5 + JWT Session
- ✅ Supabase 数据库 + RLS
- ✅ Google OAuth 登录
- ✅ 国际化（中英文）

### 商品系统
- ✅ Free / Premium / Bundle 三层定价
- ✅ 商品详情页
- ✅ 商品列表页
- ✅ 分类路由（/souls, /skills, /prompts, /teams）

### 支付系统
- ✅ PayPal 沙箱集成
- ✅ create-order API
- ✅ capture-order API
- ✅ purchases 表 + RLS + 索引
- ✅ 四态购买按钮（free/owned/signin/purchase_required）

### 下载系统
- ✅ 下载权限验证
- ✅ 动态 ZIP 生成
- ✅ 下载记录（downloads 表）

### 运维
- ✅ Vercel 自动部署
- ✅ Supabase 保活（每日 cron）
- ✅ HTTPS + 自定义域名

---

## 待完成功能

### P0（本周）
- [ ] Library 页面（展示已购商品）
- [ ] 真实商品上架（3-5个）
- [ ] 完善商品详情（截图、视频）

### P1（下周）
- [ ] 下载历史记录
- [ ] 收藏功能完善
- [ ] 搜索功能
- [ ] 评论系统

### P2（后续）
- [ ] PayPal 生产环境
- [ ] 埋点和数据分析
- [ ] 创作者后台
- [ ] 分销系统

---

## 技术债务

- [ ] 移动端导航优化
- [ ] SEO 优化（`<html lang>` 问题）
- [ ] 错误处理和用户提示
- [ ] 性能优化（图片懒加载）

---

## 关键决策

1. **混合付费模式**：内容类型与售卖属性解耦
2. **JWT Session**：比 Database Session 更简单
3. **动态 ZIP**：不存储实际文件，按需生成
4. **沙箱优先**：先验证流程，再上生产

---

*最后更新：2026-04-05 21:18*
*维护者：阿图*
