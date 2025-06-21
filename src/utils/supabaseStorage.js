import { createClient } from '@supabase/supabase-js'

// 動態創建 Supabase 客戶端
let supabase = null
let isConfigured = false

// 初始化 Supabase 客戶端
export const initializeSupabase = (config) => {
  try {
    supabase = createClient(config.url, config.anonKey)
    isConfigured = true
    return true
  } catch (error) {
    console.error('Failed to initialize Supabase:', error)
    isConfigured = false
    return false
  }
}

// 檢查是否已配置
export const isSupabaseConfigured = () => {
  return isConfigured && supabase !== null
}

// 數據庫表名
const WORDS_TABLE = 'words'

// 創建數據庫表的 SQL（用戶需要在 Supabase 控制台執行）
export const getCreateTableSQL = () => {
  return `
-- 創建詞彙表（多設備共享版本）
CREATE TABLE IF NOT EXISTS words (
  id BIGSERIAL PRIMARY KEY,
  original_text TEXT NOT NULL,
  pronunciation TEXT,
  translation TEXT NOT NULL,
  example TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 創建索引
CREATE INDEX IF NOT EXISTS idx_words_updated_at ON words(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_words_pronunciation ON words(pronunciation);
CREATE INDEX IF NOT EXISTS idx_words_translation ON words(translation);
CREATE INDEX IF NOT EXISTS idx_words_original_text ON words(original_text);

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

-- 注意：這個版本實現真正的多設備同步
-- 所有使用相同 Supabase 配置的設備將共享同一份詞彙數據
  `
}

// 檢查表是否存在
export const checkTableExists = async () => {
  if (!isSupabaseConfigured()) return false
  
  try {
    const { data, error } = await supabase
      .from(WORDS_TABLE)
      .select('count', { count: 'exact', head: true })
    
    return !error
  } catch (error) {
    console.error('Table check error:', error)
    return false
  }
}

// 獲取所有詞彙
export const getAllWords = async () => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  try {
    const { data, error } = await supabase
      .from(WORDS_TABLE)
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching words:', error)
    throw error
  }
}

// 添加新詞彙
export const addWord = async (originalText, pronunciation, translation, example) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  try {
    const { data, error } = await supabase
      .from(WORDS_TABLE)
      .insert([
        {
          original_text: originalText.trim(),
          pronunciation: pronunciation ? pronunciation.trim() : null,
          translation: translation.trim(),
          example: example ? example.trim() : null
        }
      ])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error adding word:', error)
    throw error
  }
}

// 更新詞彙
export const updateWord = async (id, updates) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  try {
    const { data, error } = await supabase
      .from(WORDS_TABLE)
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating word:', error)
    throw error
  }
}

// 刪除詞彙
export const deleteWord = async (id) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  try {
    const { error } = await supabase
      .from(WORDS_TABLE)
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting word:', error)
    throw error
  }
}

// 排序選項
export const SORT_OPTIONS = {
  UPDATED_DESC: 'updated_desc',
  UPDATED_ASC: 'updated_asc',
  READING_ASC: 'reading_asc',
  READING_DESC: 'reading_desc',
  CHINESE_ASC: 'chinese_asc',
  CHINESE_DESC: 'chinese_desc'
}

// 獲取排序後的詞彙列表
export const getSortedWords = async (sortOption = SORT_OPTIONS.UPDATED_DESC) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  try {
    let query = supabase.from(WORDS_TABLE).select('*')

    switch (sortOption) {
      case SORT_OPTIONS.UPDATED_ASC:
        query = query.order('updated_at', { ascending: true })
        break
      case SORT_OPTIONS.READING_ASC:
        query = query.order('pronunciation', { ascending: true })
        break
      case SORT_OPTIONS.READING_DESC:
        query = query.order('pronunciation', { ascending: false })
        break
      case SORT_OPTIONS.CHINESE_ASC:
        query = query.order('translation', { ascending: true })
        break
      case SORT_OPTIONS.CHINESE_DESC:
        query = query.order('translation', { ascending: false })
        break
      case SORT_OPTIONS.UPDATED_DESC:
      default:
        query = query.order('updated_at', { ascending: false })
        break
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching sorted words:', error)
    throw error
  }
}

// 實時訂閱變更
export const subscribeToWords = (callback) => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured for real-time updates')
    return null
  }

  try {
    const subscription = supabase
      .channel('words_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: WORDS_TABLE 
        }, 
        callback
      )
      .subscribe()

    return subscription
  } catch (error) {
    console.error('Error setting up real-time subscription:', error)
    return null
  }
}
