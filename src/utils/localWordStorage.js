// 本地存儲管理（原有的 localStorage 邏輯）

// 生詞數據結構
export const createWord = (japanese, reading, chinese, example) => {
  const now = new Date().toISOString();
  return {
    id: Date.now() + Math.random(), // 簡單的ID生成
    japanese: japanese.trim(),
    reading: reading ? reading.trim() : '',
    chinese: chinese.trim(),
    example: example ? example.trim() : '',
    createdAt: now,
    updatedAt: now
  };
};

// 本地存儲鍵名
const STORAGE_KEY = 'japanese_word_list';

// 獲取所有生詞
export const getAllWords = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading words from storage:', error);
    return [];
  }
};

// 保存所有生詞
export const saveAllWords = (words) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
    return true;
  } catch (error) {
    console.error('Error saving words to storage:', error);
    return false;
  }
};

// 添加新生詞
export const addWord = (japanese, reading, chinese, example) => {
  const words = getAllWords();
  const newWord = createWord(japanese, reading, chinese, example);
  words.push(newWord);
  saveAllWords(words);
  return newWord;
};

// 更新生詞
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

// 刪除生詞
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
      return sortedWords.sort((a, b) => a.reading.localeCompare(b.reading, 'ja'));
    
    case SORT_OPTIONS.READING_DESC:
      return sortedWords.sort((a, b) => b.reading.localeCompare(a.reading, 'ja'));
    
    case SORT_OPTIONS.CHINESE_ASC:
      return sortedWords.sort((a, b) => a.chinese.localeCompare(b.chinese, 'zh'));
    
    case SORT_OPTIONS.CHINESE_DESC:
      return sortedWords.sort((a, b) => b.chinese.localeCompare(a.chinese, 'zh'));
    
    case SORT_OPTIONS.UPDATED_DESC:
    default:
      return sortedWords.sort((a, b) => new Date(b.updatedAt || b.updated_at) - new Date(a.updatedAt || a.updated_at));
  }
};

// 獲取排序後的生詞列表
export const getSortedWords = (sortOption = SORT_OPTIONS.UPDATED_DESC) => {
  const words = getAllWords();
  return sortWords(words, sortOption);
};
