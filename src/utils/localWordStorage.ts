import { Word, WordUpdate, SortOption } from '../types'
import { sortWords, SORT_OPTIONS } from './sortUtils'

// 詞彙數據結構
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

// 本地存儲鍵名
const STORAGE_KEY = 'vocabulary_list'

// 獲取所有詞彙（收藏优先排序）
export const getAllWords = (): Word[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const words: Word[] = stored ? JSON.parse(stored) : []
    // 使用排序工具函数：收藏词汇优先，然后按更新时间排序
    return sortWords(words, SORT_OPTIONS.UPDATED_DESC as SortOption)
  } catch (error) {
    console.error('Error loading words from storage:', error)
    return []
  }
}

// 保存所有詞彙
export const saveAllWords = (words: Word[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words))
    return true
  } catch (error) {
    console.error('Error saving words to storage:', error)
    return false
  }
}

// 添加新詞彙
export const addWord = (
  originalText: string,
  pronunciation: string,
  translation: string,
  example: string
): Word => {
  const words = getAllWords()
  const newWord = createWord(originalText, pronunciation, translation, example)
  words.push(newWord)
  saveAllWords(words)
  return newWord
}

// 更新詞彙
export const updateWord = (id: string | number, updates: WordUpdate): Word | null => {
  const words = getAllWords()
  const index = words.findIndex(word => word.id === id)
  if (index !== -1) {
    words[index] = {
      ...words[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    saveAllWords(words)
    return words[index]
  }
  return null
}

// 刪除詞彙
export const deleteWord = (id: string | number): Word[] => {
  const words = getAllWords()
  const filteredWords = words.filter(word => word.id !== id)
  saveAllWords(filteredWords)
  return filteredWords
}

// 切换词汇收藏状态
export const toggleWordFavorite = (id: string | number): Word => {
  const words = getAllWords()
  const index = words.findIndex(word => word.id === id)
  if (index !== -1) {
    words[index].is_favorite = !words[index].is_favorite
    words[index].updatedAt = new Date().toISOString()
    saveAllWords(words)
    return words[index]
  }
  throw new Error('Word not found')
}

// 獲取排序後的詞彙列表
export const getSortedWords = (sortOption: SortOption = SortOption.UPDATED_DESC): Word[] => {
  const words = getAllWords()
  return sortWords(words, sortOption)
}
