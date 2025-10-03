import { supabase } from '../lib/supabase'
import { Word, WordUpdate, SortOption, SupabaseConfig } from '../types'
import { sortWords, SORT_OPTIONS } from './sortUtils'
import { RealtimeChannel } from '@supabase/supabase-js'

// 檢查是否已配置（现在总是返回 true，因为我们使用预配置的实例）
export const isSupabaseConfigured = (): boolean => {
  return true
}

// 初始化 Supabase 客戶端（现在不需要，但保持兼容性）
export const initializeSupabase = (_config: SupabaseConfig): boolean => {
  return true
}

// 數據庫表名
const WORDS_TABLE = 'words'

// 創建數據庫表的 SQL（用戶需要在 Supabase 控制台執行）
export const getCreateTableSQL = (): string => {
  return `
-- 創建詞彙表（用戶隔離版本）
CREATE TABLE IF NOT EXISTS words (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_text TEXT NOT NULL,
  pronunciation TEXT,
  translation TEXT NOT NULL,
  example TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 創建索引
CREATE INDEX IF NOT EXISTS idx_words_user_id ON words(user_id);
CREATE INDEX IF NOT EXISTS idx_words_updated_at ON words(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_words_pronunciation ON words(pronunciation);
CREATE INDEX IF NOT EXISTS idx_words_translation ON words(translation);
CREATE INDEX IF NOT EXISTS idx_words_original_text ON words(original_text);

-- 啟用行級安全性
ALTER TABLE words ENABLE ROW LEVEL SECURITY;

-- 創建 RLS 策略：用戶只能訪問自己的詞彙
CREATE POLICY "Users can only access their own words" ON words
  FOR ALL USING (auth.uid() = user_id);

-- 創建 RLS 策略：用戶只能插入自己的詞彙
CREATE POLICY "Users can only insert their own words" ON words
  FOR INSERT WITH CHECK (auth.uid() = user_id);

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
export const checkTableExists = async (): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false

  try {
    const { error } = await supabase
      .from(WORDS_TABLE)
      .select('count', { count: 'exact', head: true })

    return !error
  } catch (error) {
    console.error('Table check error:', error)
    return false
  }
}

// 獲取當前用戶的所有詞彙
export const getAllWords = async (): Promise<Word[]> => {
  if (!isSupabaseConfigured()) {
    console.log('Supabase not configured, returning empty array')
    return []
  }

  try {
    console.log('Fetching words from Supabase...')

    // 获取当前用户
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.log('No authenticated user found')
      return []
    }

    console.log('Current user:', user.id)

    const { data, error } = await supabase
      .from(WORDS_TABLE)
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      console.error('Supabase query error:', error)
      throw error
    }

    console.log('Fetched words from Supabase:', data)

    // 使用排序工具函数：收藏词汇优先，然后按更新时间排序
    const sortedData = sortWords(data || [], SORT_OPTIONS.UPDATED_DESC as SortOption)
    console.log('Sorted words (favorites first):', sortedData)

    return sortedData
  } catch (error) {
    console.error('Error fetching words:', error)
    throw error
  }
}

// 添加新詞彙（自動關聯到當前用戶）
export const addWord = async (
  originalText: string,
  pronunciation: string,
  translation: string,
  example: string
): Promise<Word> => {
  try {
    // 獲取當前用戶
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from(WORDS_TABLE)
      .insert([
        {
          user_id: user.id,
          original_text: originalText.trim(),
          pronunciation: pronunciation ? pronunciation.trim() : null,
          translation: translation.trim(),
          example: example ? example.trim() : null
        }
      ])
      .select()
      .single()

    if (error) throw error
    return data as Word
  } catch (error) {
    console.error('Error adding word:', error)
    throw error
  }
}

// 更新詞彙
export const updateWord = async (id: string | number, updates: WordUpdate): Promise<Word> => {
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
    return data as Word
  } catch (error) {
    console.error('Error updating word:', error)
    throw error
  }
}

// 刪除詞彙
export const deleteWord = async (id: string | number): Promise<boolean> => {
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

// 切换词汇收藏状态
export const toggleWordFavorite = async (id: string | number): Promise<Word> => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  try {
    // 先获取当前状态
    const { data: currentWord, error: fetchError } = await supabase
      .from(WORDS_TABLE)
      .select('is_favorite')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    // 切换收藏状态
    const newFavoriteStatus = !currentWord.is_favorite
    const { data, error } = await supabase
      .from(WORDS_TABLE)
      .update({
        is_favorite: newFavoriteStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0] as Word
  } catch (error) {
    console.error('Error toggling word favorite:', error)
    throw error
  }
}

// 獲取排序後的詞彙列表（使用客户端排序以支持收藏优先）
export const getSortedWords = async (sortOption: SortOption = SortOption.UPDATED_DESC): Promise<Word[]> => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  try {
    // 获取所有数据，然后在客户端排序以支持收藏优先
    const allWords = await getAllWords()
    return sortWords(allWords, sortOption)
  } catch (error) {
    console.error('Error fetching sorted words:', error)
    throw error
  }
}

// 實時訂閱變更
export const subscribeToWords = (callback: (payload: any) => void): RealtimeChannel | null => {
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
