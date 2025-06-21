# 邮件服务配置指南

## 当前状态
目前应用使用**演示模式**发送验证码：
- 验证码会在浏览器控制台显示
- 同时会弹出包含验证码的提示框
- 用户可以直接使用显示的验证码完成注册

## 配置真实邮件发送（可选）

如果您想配置真实的邮件发送功能，可以使用 EmailJS 服务：

### 1. 注册 EmailJS 账户
1. 访问 [EmailJS 官网](https://www.emailjs.com/)
2. 注册免费账户（每月可发送200封邮件）
3. 创建邮件服务

### 2. 配置邮件模板
在 EmailJS 控制台创建邮件模板，包含以下变量：
- `{{to_name}}` - 收件人姓名
- `{{verification_code}}` - 验证码
- `{{app_name}}` - 应用名称

### 3. 邮件模板示例
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>验证码邮件</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px;">📚 多语言词汇学习</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">欢迎加入我们的学习社区！</p>
    </div>
    
    <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin: 20px 0;">
        <h2 style="color: #2c3e50; margin-top: 0;">亲爱的 {{to_name}}，</h2>
        
        <p style="color: #34495e; line-height: 1.6;">
            感谢您注册多语言词汇学习应用！为了确保账户安全，请使用以下验证码完成注册：
        </p>
        
        <div style="background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">
                {{verification_code}}
            </div>
            <p style="color: #7f8c8d; margin: 10px 0 0 0; font-size: 14px;">
                验证码有效期：10分钟
            </p>
        </div>
        
        <p style="color: #34495e; line-height: 1.6;">
            请在注册页面输入此验证码以完成账户创建。如果您没有注册此账户，请忽略此邮件。
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
            <p style="color: #7f8c8d; font-size: 14px; margin: 0;">
                祝您学习愉快！<br>
                {{app_name}} 团队
            </p>
        </div>
    </div>
    
    <div style="text-align: center; color: #95a5a6; font-size: 12px;">
        <p>此邮件由系统自动发送，请勿回复。</p>
    </div>
</body>
</html>
```

### 4. 更新配置
在 `src/services/emailService.js` 中更新以下配置：

```javascript
const EMAILJS_SERVICE_ID = 'your_service_id'      // 您的服务ID
const EMAILJS_TEMPLATE_ID = 'your_template_id'    // 您的模板ID  
const EMAILJS_PUBLIC_KEY = 'your_public_key'      // 您的公钥
```

### 5. 启用真实发送
取消注释 `sendVerificationEmail` 函数中的 EmailJS 发送代码。

## 其他邮件服务选项

### 1. SendGrid
- 免费额度：每月100封邮件
- 企业级可靠性
- 需要后端API

### 2. Mailgun
- 免费额度：每月5000封邮件
- 强大的API功能
- 需要后端API

### 3. AWS SES
- 按使用量付费
- 高可靠性
- 需要AWS账户和后端

## 安全建议

1. **不要在前端暴露敏感密钥**
2. **使用环境变量存储配置**
3. **限制发送频率防止滥用**
4. **验证邮箱地址格式**
5. **设置验证码过期时间**

## 当前演示模式的优势

- ✅ 无需额外配置即可使用
- ✅ 适合开发和测试
- ✅ 用户可以立即体验功能
- ✅ 避免邮件服务的复杂性

对于大多数用户来说，当前的演示模式已经足够使用。只有在生产环境或需要真实邮件发送时，才需要配置上述邮件服务。
