# TypeScript 迁移指南

项目 TypeScript 迁移已开始，部分文件已转换。由于工程量较大，建议分阶段完成。

## 已完成

1. ✅ 安装 TypeScript 依赖
2. ✅ 创建 tsconfig.json 配置
3. ✅ 创建类型定义文件 `src/types/index.ts`
4. ✅ 转换 `src/lib/supabase.ts`
5. ✅ 转换 `src/utils/sortUtils.ts`

## 待完成（按优先级排序）

### 高优先级

1. **修复 utils 文件的类型错误**
   - `localWordStorage.ts` - 添加参数类型
   - `supabaseStorage.ts` - 添加参数类型
   - `wordStorage.ts` - 修复 SortOption 类型转换

2. **转换 services 文件**
   - `emailService.js` → `emailService.ts`

3. **转换 Context 组件**
   - `AuthContext.jsx` → `AuthContext.tsx`
   - `LanguageContext.jsx` → `LanguageContext.tsx`
   - `ThemeContext.jsx` → `ThemeContext.tsx`

### 中优先级

4. **转换 UI 组件**
   - `WordForm.jsx` → `WordForm.tsx`
   - `WordList.jsx` → `WordList.tsx`
   - `WordStats.jsx` → `WordStats.tsx`
   - `Auth.jsx` → `Auth.tsx`
   - 其他组件...

5. **转换主应用文件**
   - `App.jsx` → `App.tsx`
   - `main.jsx` → `main.tsx`

### 低优先级

6. **配置更新**
   - 更新 `vite.config.js` → `vite.config.ts`
   - 更新 `eslint.config.js` 支持 TypeScript

7. **测试和验证**
   - 运行 `npm run build` 确保构建成功
   - 运行 `npx tsc --noEmit` 检查类型错误
   - 测试所有功能正常运行

## 快速修复命令

```bash
# 检查类型错误
npx tsc --noEmit

# 构建项目
npm run build

# 开发模式测试
npm run dev
```

## 类型安全改进

TypeScript 将提供：
- ✅ 编译时类型检查
- ✅ 更好的 IDE 智能提示
- ✅ 重构安全性
- ✅ 减少运行时错误
- ✅ 更清晰的 API 接口

## 注意事项

1. 所有类型定义都在 `src/types/index.ts`
2. 保持与原有 JavaScript 行为兼容
3. 优先修复编译错误，警告可以逐步处理
4. 测试每个转换后的功能

## 当前类型错误汇总

运行 `npx tsc --noEmit` 显示约 45 个类型错误，主要集中在：
- utils 文件缺少参数类型注解
- SortOption 枚举类型转换问题
- Word 接口属性名称不一致 (is_favorite vs isFavorite)

建议按照上述优先级逐步修复。
