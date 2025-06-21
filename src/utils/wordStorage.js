// 混合存儲管理器 - 支持本地和雲端存儲
import * as localStorage from './localWordStorage'
import * as supabaseStorage from './supabaseStorage'

// 檢查是否使用雲端存儲
const useCloudStorage = () => {
  return supabaseStorage.isSupabaseConfigured()
}

// 生詞數據結構（本地存儲用）
export const createWord = (japanese, reading, chinese, example) => {
  const now = new Date().toISOString();
  return {
    id: Date.now() + Math.random(), // 簡單的ID生成
    japanese: japanese.trim(),
    reading: reading.trim(),
    chinese: chinese.trim(),
    example: example.trim(),
    createdAt: now,
    updatedAt: now
  };
};

// 獲取所有生詞
export const getAllWords = async () => {
  try {
    if (useCloudStorage()) {
      return await supabaseStorage.getAllWords()
    } else {
      return localStorage.getAllWords()
    }
  } catch (error) {
    console.error('Error getting words:', error)
    // 如果雲端失敗，回退到本地存儲
    return localStorage.getAllWords()
  }
};

// 添加新生詞
export const addWord = async (japanese, reading, chinese, example) => {
  try {
    if (useCloudStorage()) {
      return await supabaseStorage.addWord(japanese, reading, chinese, example)
    } else {
      return localStorage.addWord(japanese, reading, chinese, example)
    }
  } catch (error) {
    console.error('Error adding word:', error)
    // 如果雲端失敗，回退到本地存儲
    return localStorage.addWord(japanese, reading, chinese, example)
  }
};

// 更新生詞
export const updateWord = async (id, updates) => {
  try {
    if (useCloudStorage()) {
      return await supabaseStorage.updateWord(id, updates)
    } else {
      return localStorage.updateWord(id, updates)
    }
  } catch (error) {
    console.error('Error updating word:', error)
    // 如果雲端失敗，回退到本地存儲
    return localStorage.updateWord(id, updates)
  }
};

// 刪除生詞
export const deleteWord = async (id) => {
  try {
    if (useCloudStorage()) {
      return await supabaseStorage.deleteWord(id)
    } else {
      return localStorage.deleteWord(id)
    }
  } catch (error) {
    console.error('Error deleting word:', error)
    // 如果雲端失敗，回退到本地存儲
    return localStorage.deleteWord(id)
  }
};

// 排序選項
export const SORT_OPTIONS = {
  UPDATED_DESC: 'updated_desc', // 最新更新時間（默認）
  UPDATED_ASC: 'updated_asc',   // 最舊更新時間
  READING_ASC: 'reading_asc',   // 日文讀音升序
  READING_DESC: 'reading_desc', // 日文讀音降序
  CHINESE_ASC: 'chinese_asc',   // 中文升序
  CHINESE_DESC: 'chinese_desc'  // 中文降序
};

// 獲取排序後的生詞列表
export const getSortedWords = async (sortOption = SORT_OPTIONS.UPDATED_DESC) => {
  try {
    if (useCloudStorage()) {
      return await supabaseStorage.getSortedWords(sortOption)
    } else {
      return localStorage.getSortedWords(sortOption)
    }
  } catch (error) {
    console.error('Error getting sorted words:', error)
    // 如果雲端失敗，回退到本地存儲
    return localStorage.getSortedWords(sortOption)
  }
};

// 初始化 Supabase 配置
export const initializeSupabase = (config) => {
  return supabaseStorage.initializeSupabase(config)
};

// 檢查是否已配置 Supabase
export const isSupabaseConfigured = () => {
  return supabaseStorage.isSupabaseConfigured()
};

// 獲取創建表的 SQL
export const getCreateTableSQL = () => {
  return supabaseStorage.getCreateTableSQL()
};

// 檢查表是否存在
export const checkTableExists = async () => {
  return await supabaseStorage.checkTableExists()
};

// 實時訂閱
export const subscribeToWords = (callback) => {
  if (useCloudStorage()) {
    return supabaseStorage.subscribeToWords(callback)
  }
  return null
};
