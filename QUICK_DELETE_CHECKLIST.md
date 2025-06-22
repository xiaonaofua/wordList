# 🚀 快速删除操作清单

## 📋 删除前准备

- [ ] **确认用户身份**：验证删除请求来自账户所有者
- [ ] **记录用户信息**：邮箱 `co2sou@gmail.com`，用户名 `maxsou`
- [ ] **检查数据量**：确认要删除的词汇数量

## 🛠️ Supabase 操作步骤

### 1️⃣ 登录管理后台
- [ ] 访问 [Supabase Dashboard](https://app.supabase.com)
- [ ] 选择词汇学习应用项目
- [ ] 确认管理员权限

### 2️⃣ 删除词汇数据
- [ ] 进入 **SQL Editor**
- [ ] 执行查询确认数据：
```sql
SELECT COUNT(*) FROM words 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com');
```
- [ ] 执行删除词汇：
```sql
DELETE FROM words 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com');
```
- [ ] 验证删除结果（应返回 0）

### 3️⃣ 删除用户账户
- [ ] 进入 **Authentication** → **Users**
- [ ] 搜索用户邮箱：`co2sou@gmail.com`
- [ ] 点击用户行的 **"..."** 菜单
- [ ] 选择 **"Delete user"**
- [ ] 确认删除操作

### 4️⃣ 验证删除完成
- [ ] 确认用户无法在用户列表中找到
- [ ] 确认词汇数据已清空
- [ ] 测试用户无法登录应用

## 📧 后续处理

### 5️⃣ 发送确认邮件
- [ ] 向用户发送删除确认邮件
- [ ] 说明删除完成时间和范围
- [ ] 提醒数据无法恢复

### 6️⃣ 记录操作日志
- [ ] 记录删除操作时间
- [ ] 记录操作管理员
- [ ] 记录删除的数据量

## ⚡ 一键删除脚本

如果需要快速执行，可以使用以下 SQL 脚本：

```sql
-- 替换邮箱地址后执行
DO $$
DECLARE
    target_email TEXT := 'co2sou@gmail.com';
    user_uuid UUID;
    word_count INTEGER;
BEGIN
    -- 获取用户ID
    SELECT id INTO user_uuid FROM auth.users WHERE email = target_email;
    
    IF user_uuid IS NULL THEN
        RAISE NOTICE '用户不存在: %', target_email;
        RETURN;
    END IF;
    
    -- 统计词汇数量
    SELECT COUNT(*) INTO word_count FROM words WHERE user_id = user_uuid;
    RAISE NOTICE '准备删除 % 条词汇记录', word_count;
    
    -- 删除词汇数据
    DELETE FROM words WHERE user_id = user_uuid;
    RAISE NOTICE '词汇数据删除完成';
    
    -- 注意：用户账户需要在 Dashboard 中手动删除
    RAISE NOTICE '请在 Authentication > Users 中手动删除用户账户';
    
END $$;
```

## 🚨 紧急情况

### 如果删除失败：
1. **停止操作**，检查错误信息
2. **联系技术团队**获取支持
3. **记录问题**和已执行的步骤

### 如果误删除：
1. **立即停止**进一步操作
2. **检查是否有备份**可以恢复
3. **通知用户**当前情况

## 📞 联系信息

- **技术支持**：[技术团队联系方式]
- **紧急联系**：[紧急联系方式]

---

**⚠️ 重要提醒**：删除操作不可逆，请务必确认后再执行！
