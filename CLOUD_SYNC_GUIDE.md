# 🌐 日文生詞本雲端同步設置指南

## 概述

您的日文生詞本現在支持雲端同步功能！通過配置 Supabase，您可以在手機、電腦等多個設備間同步您的生詞數據。

## 🚀 快速開始

### 1. 創建 Supabase 帳戶

1. 訪問 [supabase.com](https://supabase.com)
2. 點擊 "Start your project" 註冊免費帳戶
3. 使用 GitHub、Google 或郵箱註冊

### 2. 創建新項目

1. 登錄後點擊 "New Project"
2. 選擇組織（或創建新組織）
3. 填寫項目信息：
   - **Name**: `japanese-wordbook`（或您喜歡的名稱）
   - **Database Password**: 設置一個強密碼
   - **Region**: 選擇離您最近的區域
4. 點擊 "Create new project"
5. 等待項目創建完成（約2分鐘）

### 3. 獲取 API 配置

1. 在項目儀表板中，點擊左側的 "Settings"
2. 選擇 "API"
3. 複製以下信息：
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 4. 在應用中配置

1. 在生詞本應用中點擊 "⚙️ 設置雲端同步"
2. 粘貼您的 Project URL 和 anon key
3. 點擊 "保存配置"

### 5. 創建數據庫表

1. 在 Supabase 項目中，點擊左側的 "SQL Editor"
2. 點擊 "New query"
3. 複製應用中顯示的 SQL 代碼並粘貼到編輯器中
4. 點擊 "Run" 執行 SQL

## 📱 多設備同步

### 在其他設備上設置

1. 在新設備上打開生詞本應用
2. 使用相同的 Supabase 配置（URL 和 anon key）
3. 您的生詞將自動同步

### 注意事項

- **數據隔離**: 每個用戶只能看到自己的生詞
- **實時同步**: 在一個設備上的更改會立即同步到其他設備
- **離線支持**: 網絡不可用時會自動使用本地存儲

## 🔒 安全性

- 使用 Supabase 的行級安全性（RLS）
- 每個用戶只能訪問自己的數據
- API 密鑰是公開的，但受到 RLS 保護

## 💾 數據遷移

### 從本地存儲遷移到雲端

1. 配置 Supabase 後，您的本地數據不會丟失
2. 您可以手動將重要的生詞重新添加到雲端
3. 或者聯繫開發者獲取數據遷移工具

### 備份數據

建議定期備份您的生詞數據：
1. 在瀏覽器開發者工具中執行：
   ```javascript
   console.log(JSON.stringify(localStorage.getItem('japanese_word_list')))
   ```
2. 複製輸出的 JSON 數據保存到文件

## 🆓 免費額度

Supabase 免費計劃包括：
- 500MB 數據庫存儲
- 每月 2GB 數據傳輸
- 50,000 次 API 請求/月

對於個人使用的生詞本，這些額度完全足夠。

## ❓ 常見問題

### Q: 配置後看不到數據？
A: 確保已執行 SQL 創建表結構，並檢查瀏覽器控制台是否有錯誤信息。

### Q: 多設備數據不同步？
A: 檢查所有設備使用相同的 Supabase 配置，並確保網絡連接正常。

### Q: 可以更改 Supabase 項目嗎？
A: 可以，點擊 "重新配置" 按鈕輸入新的配置信息。

### Q: 數據會丟失嗎？
A: Supabase 提供企業級的數據可靠性，但建議定期備份重要數據。

## 🛠️ 技術支持

如果遇到問題，請：
1. 檢查瀏覽器控制台的錯誤信息
2. 確認 Supabase 項目狀態正常
3. 聯繫開發者獲取幫助

---

享受您的多設備同步日文學習體驗！ 📚✨
