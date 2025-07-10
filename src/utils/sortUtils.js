// 排序选项常量
export const SORT_OPTIONS = {
  UPDATED_DESC: 'updated_desc',    // 按更新时间降序
  UPDATED_ASC: 'updated_asc',      // 按更新时间升序
  CREATED_DESC: 'created_desc',    // 按创建时间降序
  CREATED_ASC: 'created_asc',      // 按创建时间升序
  ALPHABETICAL: 'alphabetical',    // 按字母顺序
  FAVORITE_FIRST: 'favorite_first' // 收藏优先
};

// 获取词汇的收藏状态
const getFavoriteStatus = (word) => {
  return word.isFavorite || word.is_favorite || false;
};

// 获取词汇的更新时间
const getUpdatedTime = (word) => {
  return new Date(word.updated_at || word.updatedAt || word.created_at || word.createdAt || 0);
};

// 获取词汇的创建时间
const getCreatedTime = (word) => {
  return new Date(word.created_at || word.createdAt || 0);
};

// 获取词汇的原文（用于字母排序）
const getOriginalText = (word) => {
  return (word.original_text || word.japanese || '').toLowerCase();
};

// 主排序函数 - 收藏词汇始终优先显示
export const sortWords = (words, sortOption = SORT_OPTIONS.UPDATED_DESC) => {
  if (!words || !Array.isArray(words)) {
    return [];
  }

  const sortedWords = [...words];
  
  return sortedWords.sort((a, b) => {
    // 第一优先级：收藏状态（收藏的词汇优先显示）
    const aFavorite = getFavoriteStatus(a);
    const bFavorite = getFavoriteStatus(b);
    
    if (aFavorite !== bFavorite) {
      return bFavorite ? 1 : -1; // 收藏的排在前面
    }
    
    // 第二优先级：按指定的排序条件
    switch (sortOption) {
      case SORT_OPTIONS.UPDATED_DESC:
        return getUpdatedTime(b) - getUpdatedTime(a);
        
      case SORT_OPTIONS.UPDATED_ASC:
        return getUpdatedTime(a) - getUpdatedTime(b);
        
      case SORT_OPTIONS.CREATED_DESC:
        return getCreatedTime(b) - getCreatedTime(a);
        
      case SORT_OPTIONS.CREATED_ASC:
        return getCreatedTime(a) - getCreatedTime(b);
        
      case SORT_OPTIONS.ALPHABETICAL:
        return getOriginalText(a).localeCompare(getOriginalText(b));
        
      case SORT_OPTIONS.FAVORITE_FIRST:
        // 如果选择收藏优先，则在收藏状态相同的情况下按更新时间排序
        return getUpdatedTime(b) - getUpdatedTime(a);
        
      default:
        return getUpdatedTime(b) - getUpdatedTime(a);
    }
  });
};

// 按收藏状态分组
export const groupWordsByFavorite = (words) => {
  const favoriteWords = [];
  const normalWords = [];
  
  words.forEach(word => {
    if (getFavoriteStatus(word)) {
      favoriteWords.push(word);
    } else {
      normalWords.push(word);
    }
  });
  
  return {
    favoriteWords,
    normalWords,
    totalWords: words.length,
    favoriteCount: favoriteWords.length
  };
};

// 搜索时也保持收藏优先
export const sortSearchResults = (words, searchTerm, sortOption = SORT_OPTIONS.UPDATED_DESC) => {
  // 先进行搜索过滤
  const filteredWords = words.filter(word => {
    const originalText = getOriginalText(word);
    const pronunciation = (word.pronunciation || word.reading || '').toLowerCase();
    const translation = (word.translation || word.chinese || '').toLowerCase();
    const example = (word.example || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    return originalText.includes(searchLower) ||
           pronunciation.includes(searchLower) ||
           translation.includes(searchLower) ||
           example.includes(searchLower);
  });
  
  // 然后按收藏优先排序
  return sortWords(filteredWords, sortOption);
};
