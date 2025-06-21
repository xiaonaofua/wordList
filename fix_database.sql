-- 修復數據庫表結構
-- 如果之前的表有問題，請先刪除它

-- 刪除舊表（如果存在）
DROP TABLE IF EXISTS words;

-- 創建新的生詞表（簡化版本，不需要用戶認證）
CREATE TABLE words (
  id BIGSERIAL PRIMARY KEY,
  japanese TEXT NOT NULL,
  reading TEXT,
  chinese TEXT NOT NULL,
  example TEXT,
  device_id TEXT DEFAULT 'default',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 創建索引
CREATE INDEX idx_words_device_id ON words(device_id);
CREATE INDEX idx_words_updated_at ON words(updated_at DESC);
CREATE INDEX idx_words_reading ON words(reading);
CREATE INDEX idx_words_chinese ON words(chinese);

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
