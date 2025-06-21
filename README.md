# 📚 日文生詞本 (Japanese Vocabulary App)

> 一個現代化的日文學習詞彙管理應用，支持雲端同步和學習統計分析

## 🌐 在線體驗

**立即使用：** [https://co2sou.github.io/wordList/](https://co2sou.github.io/wordList/)

## 🌟 功能特點

### 📝 詞彙管理
- **日文單詞錄入**：支持漢字、假名等日文字符
- **讀音記錄**：可選的假名讀音輸入
- **中文翻譯**：準確的中文對照翻譯
- **例句支持**：豐富的使用場景示例
- **智能驗證**：自動檢查必填字段

### 📊 學習統計
- **總詞彙統計**：實時顯示已掌握的詞彙總數
- **學習進度**：今日、本週、本月新增詞彙統計
- **歷史記錄**：每月學習進度的可視化圖表
- **進度追蹤**：直觀的學習成果展示

### 🌐 雲端同步
- **多設備同步**：手機、電腦、平板無縫數據同步
- **實時更新**：任何設備上的更改立即同步到其他設備
- **離線支持**：網絡不可用時自動使用本地存儲
- **數據安全**：基於 Supabase 的企業級數據保護

### 📱 用戶體驗
- **響應式設計**：完美適配各種屏幕尺寸
- **直觀界面**：生詞列表置於最醒目位置
- **快速操作**：一鍵添加、刪除、查看
- **智能布局**：統計信息、詞彙列表、添加表單的合理排列

## 🛠️ 技術棧

### 前端框架
- **React 19**：最新的 React 版本，提供現代化的組件開發體驗
- **Vite**：極速的構建工具，支持熱重載和快速開發
- **JavaScript ES6+**：現代 JavaScript 語法和特性

### 樣式設計
- **CSS3**：原生 CSS 實現，無第三方 UI 框架依賴
- **Flexbox & Grid**：現代布局技術
- **CSS Variables**：動態主題和樣式管理
- **響應式設計**：Mobile-first 設計理念

### 數據管理
- **Supabase**：開源的 Firebase 替代方案
  - PostgreSQL 數據庫
  - 實時數據同步
  - RESTful API
  - 行級安全性 (RLS)
- **localStorage**：本地數據緩存和離線支持

### 部署和 CI/CD
- **GitHub Pages**：靜態網站託管
- **GitHub Actions**：自動化構建和部署
- **gh-pages**：自動化部署工具

### 開發工具
- **ESLint**：代碼質量檢查
- **Git**：版本控制
- **npm**：包管理器

## 🔧 解決的關鍵問題

### 1. 多設備同步問題 ✅
**問題描述**：初始版本使用 `device_id` 隔離不同設備的數據，導致每個設備只能看到自己添加的生詞，無法實現真正的多設備同步。

**解決方案**：
- 移除 `device_id` 字段限制
- 重構數據庫查詢邏輯，讓所有設備共享同一份數據
- 實現真正的跨設備實時同步
- 提供數據遷移向導幫助用戶升級

### 2. 用戶體驗優化 ✅
**問題描述**：原始界面布局不夠直觀，用戶需要滾動才能看到最新的生詞。

**解決方案**：
- 重新設計界面布局，將生詞列表置於最醒目位置
- 移除複雜的排序功能，默認按最新時間顯示
- 添加學習統計面板，一眼看到學習進度
- 優化響應式設計，提升移動端體驗

### 3. 數據靈活性改進 ✅
**問題描述**：讀音字段為必填項，但很多情況下用戶可能不需要或不知道讀音。

**解決方案**：
- 將讀音字段改為可選輸入
- 動態顯示邏輯，有讀音時才顯示括號
- 更新數據庫表結構支持可選讀音
- 保持向後兼容性

### 4. 學習動機增強 ✅
**問題描述**：缺乏學習進度的可視化展示，用戶難以感受到學習成果。

**解決方案**：
- 添加詳細的學習統計功能
- 實現每月學習記錄的柱狀圖展示
- 提供今日、本週、本月的學習數據
- 激勵用戶持續學習

### 5. 開發和部署自動化 ✅
**問題描述**：手動部署流程複雜，容易出錯。

**解決方案**：
- 配置 GitHub Actions 自動化 CI/CD
- 實現代碼推送後自動構建和部署
- 優化 Vite 配置支持 GitHub Pages
- 建立標準的 Git 工作流

## 🚀 快速開始

### 在線使用（推薦）
直接訪問：[https://co2sou.github.io/wordList/](https://co2sou.github.io/wordList/)

### 本地開發

#### 環境要求
- Node.js 18+
- npm 或 yarn

#### 安裝步驟
```bash
# 克隆倉庫
git clone https://github.com/co2sou/wordList.git
cd wordList

# 安裝依賴
npm install

# 啟動開發服務器
npm run dev

# 構建生產版本
npm run build

# 部署到 GitHub Pages
npm run deploy
```

## ⚙️ 雲端同步設置

### 1. 創建 Supabase 項目
1. 訪問 [supabase.com](https://supabase.com) 註冊免費帳戶
2. 創建新項目，選擇合適的區域
3. 等待項目初始化完成（約 2 分鐘）

### 2. 獲取 API 配置
1. 進入項目儀表板
2. 點擊 Settings → API
3. 複製以下信息：
   - **Project URL**：`https://your-project-id.supabase.co`
   - **anon public key**：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. 配置應用
1. 在應用中點擊 "⚙️ 設置雲端同步"
2. 粘貼您的 Project URL 和 anon key
3. 點擊 "保存配置"

### 4. 初始化數據庫
在 Supabase SQL Editor 中執行以下 SQL：

```sql
-- 創建生詞表
CREATE TABLE words (
  id BIGSERIAL PRIMARY KEY,
  japanese TEXT NOT NULL,
  reading TEXT,
  chinese TEXT NOT NULL,
  example TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 創建索引
CREATE INDEX idx_words_updated_at ON words(updated_at DESC);
CREATE INDEX idx_words_reading ON words(reading);
CREATE INDEX idx_words_chinese ON words(chinese);
CREATE INDEX idx_words_japanese ON words(japanese);

-- 創建更新時間觸發器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_words_updated_at
  BEFORE UPDATE ON words
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 📖 使用指南

### 基本操作
1. **添加生詞**：使用底部表單輸入日文和中文翻譯（讀音和例句可選）
2. **查看統計**：頂部顯示學習進度和詞彙統計
3. **瀏覽詞彙**：中間區域顯示最新添加的生詞列表
4. **刪除生詞**：點擊生詞卡片右下角的垃圾桶圖標

### 多設備同步
1. 在所有設備上使用相同的 Supabase 配置
2. 確保網絡連接正常
3. 數據會自動實時同步

### 數據遷移
如果您之前使用過舊版本，請：
1. 點擊 "🔧 修復同步" 按鈕
2. 按照遷移向導執行 SQL 腳本
3. 完成後所有設備將共享同一份數據

## 🔍 故障排除

### 常見問題

**Q: 配置 Supabase 後看不到數據？**
A: 請確保已執行數據庫初始化 SQL，並檢查瀏覽器控制台是否有錯誤信息。

**Q: 多設備數據不同步？**
A: 確認所有設備使用相同的 Supabase 配置，並檢查網絡連接。如果仍有問題，請使用 "🔧 修復同步" 功能。

**Q: 網站無法訪問？**
A: GitHub Pages 可能需要幾分鐘來更新。請清除瀏覽器緩存或稍後再試。

**Q: 本地開發時遇到問題？**
A: 確保 Node.js 版本 18+，刪除 `node_modules` 文件夾後重新 `npm install`。

### 調試工具
應用內置了調試面板，點擊 "🛠️ 調試" 按鈕可以：
- 檢查 Supabase 連接狀態
- 測試數據庫連接
- 查看配置信息
- 清除本地數據

## 🤝 貢獻指南

歡迎提交 Issue 和 Pull Request！

### 開發流程
1. Fork 本倉庫
2. 創建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

### 代碼規範
- 使用 ESLint 檢查代碼質量
- 遵循現有的代碼風格
- 添加適當的註釋
- 確保響應式設計兼容性

## 📄 許可證

MIT License - 詳見 [LICENSE](LICENSE) 文件

## 🙏 致謝

- 感謝 [Supabase](https://supabase.com) 提供優秀的後端服務
- 感謝 [Vite](https://vitejs.dev) 提供快速的構建工具
- 感謝所有為日文學習做出貢獻的開發者和用戶

## 📞 聯繫方式

- GitHub Issues: [提交問題](https://github.com/co2sou/wordList/issues)
- 項目主頁: [https://github.com/co2sou/wordList](https://github.com/co2sou/wordList)

---

**開始您的日文學習之旅：** [https://co2sou.github.io/wordList/](https://co2sou.github.io/wordList/) 📚✨
