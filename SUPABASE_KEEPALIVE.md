# Supabase Keep-Alive 自动唤醒方案

## 📋 问题背景

Supabase 免费版有以下限制：
- **7 天无活动自动暂停** - 项目会在闲置 7 天后进入暂停状态
- **64 天恢复期限** - 暂停后有 64 天时间可以手动恢复
- **超期无法恢复** - 超过 64 天后项目无法恢复（数据可下载）

## ✅ 解决方案

本项目实现了 **GitHub Actions 自动定时唤醒机制**，完全免费且无需额外配置。

---

## 🤖 自动化方案详情

### 工作原理

通过 GitHub Actions 定时任务，每 5 天自动执行以下操作：
1. 连接到 Supabase 数据库
2. 查询 `words` 表记录数（模拟活动）
3. 检查认证服务状态
4. 刷新项目活跃时间

### 配置文件位置

```
.github/workflows/keep-supabase-alive.yml
```

### 运行频率

- **自动运行**: 每 5 天的 UTC 02:00 (北京时间 10:00)
- **手动触发**: 随时可在 GitHub Actions 页面手动运行

---

## 🚀 使用方法

### 方法 1: 自动运行（推荐）

✅ **已自动启用**，无需任何操作！

GitHub Actions 会自动执行，你可以在以下位置查看运行历史：
```
GitHub 仓库 → Actions → "Keep Supabase Alive"
```

### 方法 2: 手动本地测试

在项目根目录运行：

```bash
npm run ping-supabase
```

**预期输出示例**:
```
🔄 正在连接 Supabase...
📍 URL: https://dcqhsrwojhpoynahkewp.supabase.co
✅ 数据库连接正常
📊 词汇表记录数: 0
✅ 认证服务正常

✨ Supabase 项目活跃状态已刷新
⏰ 时间: 2026-01-20T02:33:00.896Z
📅 下次建议 ping: 2026-01-25T02:33:00.897Z

✅ 任务完成
```

### 方法 3: GitHub Actions 手动触发

1. 进入 GitHub 仓库页面
2. 点击顶部的 **Actions** 标签
3. 在左侧选择 **"Keep Supabase Alive"** 工作流
4. 点击右上角 **"Run workflow"** 按钮
5. 选择分支后点击 **"Run workflow"** 确认

---

## 📊 监控与维护

### 查看执行历史

1. 进入 GitHub Actions 页面
2. 查看 "Keep Supabase Alive" 工作流的运行记录
3. 绿色 ✅ 表示成功，红色 ❌ 表示失败

### 常见问题排查

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 任务失败（红色 ❌） | Supabase 已暂停或网络问题 | 手动恢复 Supabase 项目，然后重新运行任务 |
| 任务未执行 | GitHub Actions 未启用 | 进入仓库设置 → Actions → 确保启用 |
| 连接超时 | Supabase 服务异常 | 访问 Supabase Dashboard 检查项目状态 |

### 维护建议

- ✅ 每月检查一次 GitHub Actions 运行记录
- ✅ 如果连续失败 2 次以上，手动检查 Supabase 状态
- ✅ 公开仓库默认启用 Actions（私有仓库免费用户有 2000 分钟/月限制）

---

## 🔧 技术实现细节

### 文件结构

```
wordList/
├── .github/workflows/
│   └── keep-supabase-alive.yml    # GitHub Actions 工作流配置
├── scripts/
│   └── ping-supabase.js           # 心跳检测脚本
└── package.json                   # 添加了 ping-supabase 命令
```

### 核心代码逻辑

```javascript
// 查询数据库以保持活跃
const { data, error, count } = await supabase
  .from('words')
  .select('id', { count: 'exact', head: true })

// 检查认证服务
const { data: { session } } = await supabase.auth.getSession()
```

### Cron 表达式说明

```yaml
cron: '0 2 */5 * *'
```

- `0` - 第 0 分钟
- `2` - 第 2 小时（UTC）
- `*/5` - 每 5 天
- `*` - 每月
- `*` - 每周

---

## 💰 成本分析

### GitHub Actions 使用量

- **单次运行时间**: 约 30 秒
- **月运行次数**: 6 次（每 5 天一次）
- **月总消耗**: 3 分钟
- **费用**: **完全免费**（公开仓库无限制）

### 对比其他方案

| 方案 | 月成本 | 可靠性 | 配置难度 |
|------|--------|--------|---------|
| GitHub Actions ✅ | $0 | ⭐⭐⭐⭐⭐ | 极低 |
| UptimeRobot | $0 - $7 | ⭐⭐⭐⭐ | 低 |
| Supabase Pro | $25 | ⭐⭐⭐⭐⭐ | 无 |
| 手动操作 | $0 | ⭐⭐ | 中等 |

---

## 🎯 验证方案有效性

### 预期效果

- Supabase 项目永不暂停
- 无需人工干预
- 完全自动化运行

### 验证步骤

1. **初始验证**: 运行 `npm run ping-supabase` 确保脚本正常
2. **首次自动运行**: 等待 5 天后检查 GitHub Actions 执行记录
3. **长期监控**: 在 Supabase Dashboard 查看项目状态（应保持 Active）

### 成功标志

- ✅ GitHub Actions 每 5 天自动运行成功
- ✅ Supabase Dashboard 显示项目状态为 "Active"
- ✅ 无暂停通知邮件

---

## 📚 相关资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Supabase 计费说明](https://supabase.com/pricing)
- [Cron 表达式生成器](https://crontab.guru/)

---

## 🆘 需要帮助？

如果遇到问题：

1. 检查 GitHub Actions 运行日志
2. 运行 `npm run ping-supabase` 本地测试
3. 查看 Supabase Dashboard 项目状态
4. 确认 GitHub Actions 已启用

---

**最后更新**: 2026-01-20  
**维护状态**: ✅ 活跃维护中
