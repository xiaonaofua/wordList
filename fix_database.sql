-- 修復多設備同步問題 - 數據庫遷移腳本
-- 這個腳本將修復多設備同步問題，讓所有設備共享同一份數據

-- 方案1：如果您想保留現有數據並合併所有設備的數據
-- 首先備份現有數據
CREATE TABLE words_backup AS SELECT * FROM words;

-- 移除 device_id 字段（如果存在）
ALTER TABLE words DROP COLUMN IF EXISTS device_id;

-- 方案2：如果您想重新開始（推薦用於測試）
-- 刪除舊表並重新創建
-- DROP TABLE IF EXISTS words;

-- 創建新的生詞表（多設備共享版本）
CREATE TABLE IF NOT EXISTS words (
  id BIGSERIAL PRIMARY KEY,
  japanese TEXT NOT NULL,
  reading TEXT,
  chinese TEXT NOT NULL,
  example TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 創建索引
CREATE INDEX IF NOT EXISTS idx_words_updated_at ON words(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_words_reading ON words(reading);
CREATE INDEX IF NOT EXISTS idx_words_chinese ON words(chinese);
CREATE INDEX IF NOT EXISTS idx_words_japanese ON words(japanese);

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

-- 插入測試數據
INSERT INTO words (japanese, reading, chinese, example, device_id) VALUES
('勉強', 'べんきょう', '學習', '毎日日本語を勉強しています。', 'test'),
('友達', 'ともだち', '朋友', '友達と一緒に映画を見ました。', 'test');

-- 檢查表是否創建成功
SELECT COUNT(*) as total_words FROM words;
