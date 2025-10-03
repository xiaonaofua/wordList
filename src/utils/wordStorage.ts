// 混合存儲管理器 - 支持本地和雲端存儲
import { Word, WordUpdate, SortOption, SupabaseConfig } from '../types'
import * as localStorage from './localWordStorage'
import * as supabaseStorage from './supabaseStorage'
import { RealtimeChannel } from '@supabase/supabase-js'

// 檢查是否使用雲端存儲
const useCloudStorage = (): boolean => {
  return supabaseStorage.isSupabaseConfigured()
}

// 詞彙數據結構（本地存儲用）
export const createWord = (
  originalText: string,
  pronunciation: string,
  translation: string,
  example: string
): Word => {
  const now = new Date().toISOString()
  return {
    id: Date.now() + Math.random(), // 簡單的ID生成
    original_text: originalText.trim(),
    pronunciation: pronunciation ? pronunciation.trim() : '',
    translation: translation.trim(),
    example: example ? example.trim() : '',
    createdAt: now,
    updatedAt: now
  }
}

// 獲取所有詞彙
export const getAllWords = async (): Promise<Word[]> => {
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
}

// 添加新詞彙
export const addWord = async (
  originalText: string,
  pronunciation: string,
  translation: string,
  example: string
): Promise<Word> => {
  try {
    if (useCloudStorage()) {
      return await supabaseStorage.addWord(originalText, pronunciation, translation, example)
    } else {
      return localStorage.addWord(originalText, pronunciation, translation, example)
    }
  } catch (error) {
    console.error('Error adding word:', error)
    // 如果雲端失敗，回退到本地存儲
    return localStorage.addWord(originalText, pronunciation, translation, example)
  }
}

// 更新詞彙
export const updateWord = async (id: string | number, updates: WordUpdate): Promise<Word | null | boolean> => {
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
}

// 刪除詞彙
export const deleteWord = async (id: string | number): Promise<Word[] | boolean> => {
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
}

// 切换词汇收藏状态
export const toggleWordFavorite = async (id: string | number): Promise<Word> => {
  try {
    if (useCloudStorage()) {
      return await supabaseStorage.toggleWordFavorite(id)
    } else {
      return localStorage.toggleWordFavorite(id)
    }
  } catch (error) {
    console.error('Error toggling word favorite:', error)
    // 如果雲端失敗，回退到本地存儲
    return localStorage.toggleWordFavorite(id)
  }
}

// 排序選項
export const SORT_OPTIONS: Record<string, SortOption> = {
  UPDATED_DESC: SortOption.UPDATED_DESC, // 最新更新時間（默認）
  UPDATED_ASC: SortOption.UPDATED_ASC,   // 最舊更新時間
  READING_ASC: SortOption.READING_ASC,   // 日文讀音升序
  READING_DESC: SortOption.READING_DESC, // 日文讀音降序
  CHINESE_ASC: SortOption.CHINESE_ASC,   // 中文升序
  CHINESE_DESC: SortOption.CHINESE_DESC  // 中文降序
}

// 獲取排序後的詞彙列表
export const getSortedWords = async (sortOption: SortOption = SortOption.UPDATED_DESC): Promise<Word[]> => {
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
}

// 初始化 Supabase 配置
export const initializeSupabase = (config: SupabaseConfig): boolean => {
  return supabaseStorage.initializeSupabase(config)
}

// 檢查是否已配置 Supabase
export const isSupabaseConfigured = (): boolean => {
  return supabaseStorage.isSupabaseConfigured()
}

// 獲取創建表的 SQL
export const getCreateTableSQL = (): string => {
  return supabaseStorage.getCreateTableSQL()
}

// 檢查表是否存在
export const checkTableExists = async (): Promise<boolean> => {
  return await supabaseStorage.checkTableExists()
}

// 實時訂閱
export const subscribeToWords = (callback: (payload: any) => void): RealtimeChannel | null => {
  if (useCloudStorage()) {
    return supabaseStorage.subscribeToWords(callback)
  }
  return null
}
