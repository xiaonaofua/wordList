import { Word, SortOption } from '../types'

// 排序选项常量
export const SORT_OPTIONS: Record<string, SortOption> = {
  UPDATED_DESC: SortOption.UPDATED_DESC,
  UPDATED_ASC: SortOption.UPDATED_ASC,
  READING_ASC: SortOption.READING_ASC,
  READING_DESC: SortOption.READING_DESC,
  CHINESE_ASC: SortOption.CHINESE_ASC,
  CHINESE_DESC: SortOption.CHINESE_DESC
}

// 获取词汇的收藏状态
const getFavoriteStatus = (word: Word): boolean => {
  return word.is_favorite || false
}

// 获取词汇的更新时间
const getUpdatedTime = (word: Word): Date => {
  return new Date(word.updated_at || word.updatedAt || word.created_at || word.createdAt || 0)
}

// 获取词汇的创建时间（保留以备将来使用）
// const getCreatedTime = (word: Word): Date => {
//   return new Date(word.created_at || word.createdAt || 0)
// }

// 获取词汇的原文（用于字母排序）
const getOriginalText = (word: Word): string => {
  return (word.original_text || '').toLowerCase()
}

// 主排序函数 - 收藏词汇始终优先显示
export const sortWords = (words: Word[], sortOption: SortOption = SortOption.UPDATED_DESC): Word[] => {
  if (!words || !Array.isArray(words)) {
    return []
  }

  const sortedWords = [...words]

  return sortedWords.sort((a, b) => {
    // 第一优先级：收藏状态（收藏的词汇优先显示）
    const aFavorite = getFavoriteStatus(a)
    const bFavorite = getFavoriteStatus(b)

    if (aFavorite !== bFavorite) {
      return bFavorite ? 1 : -1 // 收藏的排在前面
    }

    // 第二优先级：按指定的排序条件
    switch (sortOption) {
      case SortOption.UPDATED_DESC:
        return getUpdatedTime(b).getTime() - getUpdatedTime(a).getTime()

      case SortOption.UPDATED_ASC:
        return getUpdatedTime(a).getTime() - getUpdatedTime(b).getTime()

      case SortOption.READING_ASC:
        return getOriginalText(a).localeCompare(getOriginalText(b))

      case SortOption.READING_DESC:
        return getOriginalText(b).localeCompare(getOriginalText(a))

      case SortOption.CHINESE_ASC:
        return (a.translation || '').localeCompare(b.translation || '')

      case SortOption.CHINESE_DESC:
        return (b.translation || '').localeCompare(a.translation || '')

      default:
        return getUpdatedTime(b).getTime() - getUpdatedTime(a).getTime()
    }
  })
}

// 按收藏状态分组
export const groupWordsByFavorite = (words: Word[]): {
  favoriteWords: Word[]
  normalWords: Word[]
  totalWords: number
  favoriteCount: number
} => {
  const favoriteWords: Word[] = []
  const normalWords: Word[] = []

  words.forEach(word => {
    if (getFavoriteStatus(word)) {
      favoriteWords.push(word)
    } else {
      normalWords.push(word)
    }
  })

  return {
    favoriteWords,
    normalWords,
    totalWords: words.length,
    favoriteCount: favoriteWords.length
  }
}

// 搜索时也保持收藏优先
export const sortSearchResults = (
  words: Word[],
  searchTerm: string,
  sortOption: SortOption = SortOption.UPDATED_DESC
): Word[] => {
  // 先进行搜索过滤
  const filteredWords = words.filter(word => {
    const originalText = getOriginalText(word)
    const pronunciation = (word.pronunciation || '').toLowerCase()
    const translation = (word.translation || '').toLowerCase()
    const example = (word.example || '').toLowerCase()
    const searchLower = searchTerm.toLowerCase()

    return originalText.includes(searchLower) ||
           pronunciation.includes(searchLower) ||
           translation.includes(searchLower) ||
           example.includes(searchLower)
  })

  // 然后按收藏优先排序
  return sortWords(filteredWords, sortOption)
}
