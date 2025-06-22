# Supabase 词汇数据插入指南

## 📋 概述

为用户 `co2sou@gmail.com` (maxsou) 添加 62 个日文词汇到词汇学习应用中。

## 📁 文件说明

### 1. `insert_vocabulary_data.sql` (推荐)
- **自动化脚本**：使用子查询自动查找用户ID
- **包含验证**：检查用户是否存在
- **完整功能**：包含统计和验证查询
- **适用场景**：Supabase 支持子查询的环境

### 2. `insert_vocabulary_simple.sql` (备用)
- **手动替换**：需要手动替换用户UUID
- **简化版本**：适用于子查询不工作的情况
- **分步执行**：先查询用户ID，再执行插入

## 🚀 使用步骤

### 方法一：自动化脚本 (推荐)

1. **登录 Supabase Dashboard**
   - 访问您的 Supabase 项目
   - 进入 SQL Editor

2. **确认用户存在**
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'co2sou@gmail.com';
   ```

3. **执行完整脚本**
   - 复制 `insert_vocabulary_data.sql` 的全部内容
   - 粘贴到 SQL Editor 中
   - 点击 "Run" 执行

4. **查看结果**
   - 脚本会自动显示插入统计
   - 确认插入了 62 个词汇

### 方法二：手动替换 (备用)

1. **获取用户ID**
   ```sql
   SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com';
   ```

2. **复制UUID**
   - 从查询结果中复制用户的UUID
   - 例如：`123e4567-e89b-12d3-a456-426614174000`

3. **替换占位符**
   - 打开 `insert_vocabulary_simple.sql`
   - 将所有 `YOUR_USER_UUID_HERE` 替换为实际的UUID
   - 可以使用文本编辑器的"查找替换"功能

4. **执行插入**
   - 将修改后的SQL粘贴到 Supabase SQL Editor
   - 执行插入语句

## 📊 词汇数据统计

- **总词汇数**：62 个
- **包含发音**：大部分词汇包含假名或罗马音
- **包含翻译**：所有词汇都有中文翻译
- **包含例句**：部分词汇包含使用示例

## 📝 词汇内容预览

| 日文原文 | 发音 | 中文翻译 | 备注 |
|---------|------|----------|------|
| 希死念慮 | きしねんりょ | 轻生念头 | |
| 絡れ | もつれ | 纠葛 纠缠不清 | |
| ガールズパンツァー | Girls Panzer | 少女战车 | 动漫作品 |
| 枯山水 | かれさんすい | 枯山水 | 日式庭园 |
| ... | ... | ... | 共62个词汇 |

## ✅ 验证查询

执行插入后，可以使用以下查询验证结果：

```sql
-- 查看用户的词汇总数
SELECT COUNT(*) as total_words 
FROM words 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com');

-- 查看最新插入的词汇
SELECT original_text, pronunciation, translation, created_at
FROM words 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com')
ORDER BY created_at DESC 
LIMIT 10;
```

## 🔧 故障排除

### 问题1：用户不存在
**错误信息**：`用户 co2sou@gmail.com 不存在`
**解决方案**：
1. 确认用户已在应用中注册
2. 检查邮箱地址拼写是否正确
3. 在 Supabase Auth 中确认用户存在

### 问题2：子查询不工作
**错误信息**：子查询相关错误
**解决方案**：
1. 使用 `insert_vocabulary_simple.sql`
2. 手动替换UUID的方式插入

### 问题3：权限错误
**错误信息**：权限不足
**解决方案**：
1. 确认使用的是 service_role 密钥
2. 或者临时禁用 RLS 策略

## 🗑️ 清理脚本

如果需要删除插入的数据：

```sql
-- 删除今天插入的所有词汇
DELETE FROM words 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com')
  AND created_at >= CURRENT_DATE;

-- 或者删除所有词汇（谨慎使用）
DELETE FROM words 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'co2sou@gmail.com');
```

## 📞 支持

如果遇到问题，请检查：
1. Supabase 项目配置是否正确
2. 数据库表结构是否匹配
3. 用户权限是否足够
4. RLS 策略是否正确配置

---

**注意**：执行前请确保备份重要数据，并在测试环境中先行验证。
