// 本地存儲管理（原有的 localStorage 邏輯）
import { sortWords, SORT_OPTIONS } from './sortUtils';

// 詞彙數據結構
export const createWord = (originalText, pronunciation, translation, example) => {
  const now = new Date().toISOString();
  return {
    id: Date.now() + Math.random(), // 簡單的ID生成
    original_text: originalText.trim(),
    pronunciation: pronunciation ? pronunciation.trim() : '',
    translation: translation.trim(),
    example: example ? example.trim() : '',
    createdAt: now,
    updatedAt: now
  };
};

// 本地存儲鍵名
const STORAGE_KEY = 'vocabulary_list';

// 獲取所有詞彙（收藏优先排序）
export const getAllWords = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const words = stored ? JSON.parse(stored) : [];
    // 使用排序工具函数：收藏词汇优先，然后按更新时间排序
    return sortWords(words, SORT_OPTIONS.UPDATED_DESC);
  } catch (error) {
    console.error('Error loading words from storage:', error);
    return [];
  }
};

// 保存所有詞彙
export const saveAllWords = (words) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
    return true;
  } catch (error) {
    console.error('Error saving words to storage:', error);
    return false;
  }
};

// 添加新詞彙
export const addWord = (originalText, pronunciation, translation, example) => {
  const words = getAllWords();
  const newWord = createWord(originalText, pronunciation, translation, example);
  words.push(newWord);
  saveAllWords(words);
  return newWord;
};

// 更新詞彙
export const updateWord = (id, updates) => {
  const words = getAllWords();
  const index = words.findIndex(word => word.id === id);
  if (index !== -1) {
    words[index] = {
      ...words[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveAllWords(words);
    return words[index];
  }
  return null;
};

// 刪除詞彙
export const deleteWord = (id) => {
  const words = getAllWords();
  const filteredWords = words.filter(word => word.id !== id);
  saveAllWords(filteredWords);
  return filteredWords;
};

// 切换词汇收藏状态
export const toggleWordFavorite = (id) => {
  const words = getAllWords();
  const index = words.findIndex(word => word.id === id);
  if (index !== -1) {
    words[index].isFavorite = !words[index].isFavorite;
    words[index].updatedAt = new Date().toISOString();
    saveAllWords(words);
    return words[index];
  }
  throw new Error('Word not found');
};

// 獲取排序後的詞彙列表
export const getSortedWords = (sortOption = SORT_OPTIONS.UPDATED_DESC) => {
  const words = getAllWords();
  return sortWords(words, sortOption);
};
