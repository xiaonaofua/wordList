-- 修復多設備同步問題並更新字段名 - 數據庫遷移腳本
-- 這個腳本將修復多設備同步問題，讓所有設備共享同一份數據
-- 同時將字段名從日文特定改為通用語言

-- 方案1：如果您想保留現有數據並合併所有設備的數據
-- 首先備份現有數據
CREATE TABLE IF NOT EXISTS words_backup AS SELECT * FROM words;

-- 移除 device_id 字段（如果存在）
ALTER TABLE words DROP COLUMN IF EXISTS device_id;

-- 重命名字段為通用名稱
ALTER TABLE words RENAME COLUMN japanese TO original_text;
ALTER TABLE words RENAME COLUMN reading TO pronunciation;
ALTER TABLE words RENAME COLUMN chinese TO translation;

-- 方案2：如果您想重新開始（推薦）
-- 刪除舊表並重新創建
DROP TABLE IF EXISTS words;

-- 創建新的詞彙表（多設備共享版本，通用字段名）
CREATE TABLE words (
  id BIGSERIAL PRIMARY KEY,
  original_text TEXT NOT NULL,
  pronunciation TEXT,
  translation TEXT NOT NULL,
  example TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 創建索引
CREATE INDEX idx_words_updated_at ON words(updated_at DESC);
CREATE INDEX idx_words_pronunciation ON words(pronunciation);
CREATE INDEX idx_words_translation ON words(translation);
CREATE INDEX idx_words_original_text ON words(original_text);

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

-- 插入測試數據（多語言示例）
INSERT INTO words (original_text, pronunciation, translation, example) VALUES
('Hello', '/həˈloʊ/', '你好', 'Hello, how are you?'),
('Bonjour', '/bon.ˈʒuʁ/', '你好', 'Bonjour, comment allez-vous?'),
('Hola', '/ˈola/', '你好', 'Hola, ¿cómo estás?'),
('こんにちは', 'konnichiwa', '你好', 'こんにちは、元気ですか？');

-- 檢查表是否創建成功
SELECT COUNT(*) as total_words FROM words;
