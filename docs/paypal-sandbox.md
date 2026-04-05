# PayPal Sandbox 测试账号

## 买家账号（用于测试购买流程）

- **Email:** sb-ayfhl50019778@personal.example.com
- **Password:** zLV4_#]O

## 测试流程

1. 访问 https://souls.design/en/shop/payment-test-skill
2. 点击 "Buy now - $9.90"
3. 在 PayPal 弹窗中使用上述账号登录
4. 完成支付
5. 验证：
   - 订单记录到 `purchases` 表
   - 可以下载 `payment-test-skill.zip`
   - Library 页面显示已购商品（待实现）

## 商家账号

- 在 PayPal Developer Dashboard 中配置
- Client ID 和 Secret 存储在 Vercel 环境变量中

## 注意事项

- 沙箱账号只能在 sandbox.paypal.com 使用
- 不会产生真实扣款
- 测试完成后可以在 PayPal Dashboard 查看交易记录

---

*最后更新：2026-04-05*
