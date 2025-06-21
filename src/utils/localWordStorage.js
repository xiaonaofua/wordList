// 本地存儲管理（原有的 localStorage 邏輯）

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

// 獲取所有詞彙
export const getAllWords = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
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

// 排序選項
export const SORT_OPTIONS = {
  UPDATED_DESC: 'updated_desc', // 最新更新時間（默認）
  UPDATED_ASC: 'updated_asc',   // 最舊更新時間
  READING_ASC: 'reading_asc',   // 日文讀音升序
  READING_DESC: 'reading_desc', // 日文讀音降序
  CHINESE_ASC: 'chinese_asc',   // 中文升序
  CHINESE_DESC: 'chinese_desc'  // 中文降序
};

// 排序函數
export const sortWords = (words, sortOption) => {
  const sortedWords = [...words];
  
  switch (sortOption) {
    case SORT_OPTIONS.UPDATED_ASC:
      return sortedWords.sort((a, b) => new Date(a.updatedAt || a.updated_at) - new Date(b.updatedAt || b.updated_at));
    
    case SORT_OPTIONS.READING_ASC:
      return sortedWords.sort((a, b) => (a.pronunciation || a.reading || '').localeCompare(b.pronunciation || b.reading || ''));

    case SORT_OPTIONS.READING_DESC:
      return sortedWords.sort((a, b) => (b.pronunciation || b.reading || '').localeCompare(a.pronunciation || a.reading || ''));

    case SORT_OPTIONS.CHINESE_ASC:
      return sortedWords.sort((a, b) => (a.translation || a.chinese || '').localeCompare(b.translation || b.chinese || ''));

    case SORT_OPTIONS.CHINESE_DESC:
      return sortedWords.sort((a, b) => (b.translation || b.chinese || '').localeCompare(a.translation || a.chinese || ''));
    
    case SORT_OPTIONS.UPDATED_DESC:
    default:
      return sortedWords.sort((a, b) => new Date(b.updatedAt || b.updated_at) - new Date(a.updatedAt || a.updated_at));
  }
};

// 獲取排序後的詞彙列表
export const getSortedWords = (sortOption = SORT_OPTIONS.UPDATED_DESC) => {
  const words = getAllWords();
  return sortWords(words, sortOption);
};
