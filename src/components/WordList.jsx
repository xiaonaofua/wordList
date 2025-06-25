import { useState, useEffect } from 'react';
import { getAllWords, deleteWord, updateWord, toggleWordFavorite } from '../utils/wordStorage';
import { useLanguage } from '../contexts/LanguageContext';
import WordSearch from './WordSearch';
import './WordList.css';

const WordList = ({ refreshTrigger }) => {
  const { t, currentLanguage } = useLanguage();
  const [words, setWords] = useState([]);
  const [allWords, setAllWords] = useState([]); // 存储所有词汇
  const [filteredWords, setFilteredWords] = useState([]); // 存储搜索结果
  const [isSearching, setIsSearching] = useState(false); // 是否在搜索状态
  const [searchTerm, setSearchTerm] = useState(''); // 当前搜索词
  const [isLoading, setIsLoading] = useState(true); // 加载状态
  const [editingWord, setEditingWord] = useState(null);
  const [editForm, setEditForm] = useState({
    original_text: '',
    pronunciation: '',
    translation: '',
    example: ''
  });

  // 加載詞彙列表（按更新時間排序）
  const loadWords = async () => {
    try {
      setIsLoading(true);
      console.log('Loading words...');
      const wordsData = await getAllWords();
      console.log('Loaded words:', wordsData);

      if (!wordsData || !Array.isArray(wordsData)) {
        console.warn('Invalid words data:', wordsData);
        setAllWords([]);
        setWords([]);
        setIsLoading(false);
        return;
      }

      // 按更新時間降序排序（最新更新的在前）
      const sortedWords = wordsData.sort((a, b) => {
        const aTime = new Date(a.updated_at || a.updatedAt || a.created_at || a.createdAt);
        const bTime = new Date(b.updated_at || b.updatedAt || b.created_at || b.createdAt);
        return bTime - aTime;
      });

      console.log('Sorted words:', sortedWords);
      setAllWords(sortedWords); // 保存所有词汇
      if (!isSearching) {
        setWords(sortedWords); // 如果不在搜索状态，显示所有词汇
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading words:', error);
      setIsLoading(false);
      // 显示更详细的错误信息
      const errorMessage = error.message || error.toString() || '未知錯誤';
      alert(t('loadWordsError') + '：' + errorMessage);
      // 设置空数组避免界面崩溃
      setAllWords([]);
      setWords([]);
    }
  };

  // 初始加載、刷新和語言變化時重新加載
  useEffect(() => {
    loadWords().catch(error => {
      console.error('Error in useEffect loadWords:', error);
    });
  }, [refreshTrigger, currentLanguage]); // 添加語言變化監聽

  // 處理刪除詞彙
  const handleDelete = async (id, originalText) => {
    if (window.confirm(`${t('deleteWordConfirm')}「${originalText}」嗎？`)) {
      try {
        await deleteWord(id);
        loadWords(); // 重新加載列表
      } catch (error) {
        console.error('Error deleting word:', error);
        alert(t('deleteWordError') + '：' + (error.message || '未知錯誤'));
      }
    }
  };

  // 開始編輯詞彙
  const handleEdit = (word) => {
    setEditingWord(word.id);
    setEditForm({
      original_text: word.original_text || word.japanese || '',
      pronunciation: word.pronunciation || word.reading || '',
      translation: word.translation || word.chinese || '',
      example: word.example || ''
    });
  };

  // 取消編輯
  const handleCancelEdit = () => {
    setEditingWord(null);
    setEditForm({
      original_text: '',
      pronunciation: '',
      translation: '',
      example: ''
    });
  };

  // 保存編輯
  const handleSaveEdit = async () => {
    if (!editForm.original_text.trim() || !editForm.translation.trim()) {
      alert(t('fillRequired'));
      return;
    }

    try {
      await updateWord(editingWord, {
        original_text: editForm.original_text.trim(),
        pronunciation: editForm.pronunciation.trim() || null,
        translation: editForm.translation.trim(),
        example: editForm.example.trim() || null
      });

      setEditingWord(null);
      setEditForm({
        original_text: '',
        pronunciation: '',
        translation: '',
        example: ''
      });
      loadWords(); // 重新加載列表
      alert(t('wordUpdateSuccess') || '詞彙更新成功！');
    } catch (error) {
      console.error('Error updating word:', error);
      alert(t('wordUpdateError') || '更新詞彙時發生錯誤：' + (error.message || '未知錯誤'));
    }
  };

  // 處理編輯表單輸入
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 搜索功能
  const handleSearch = (term) => {
    if (!term) {
      handleClearSearch();
      return;
    }

    setSearchTerm(term);
    setIsSearching(true);

    // 在原文、发音、翻译中搜索
    const filtered = allWords.filter(word => {
      const originalText = (word.original_text || word.japanese || '').toLowerCase();
      const pronunciation = (word.pronunciation || word.reading || '').toLowerCase();
      const translation = (word.translation || word.chinese || '').toLowerCase();
      const example = (word.example || '').toLowerCase();
      const searchLower = term.toLowerCase();

      return originalText.includes(searchLower) ||
             pronunciation.includes(searchLower) ||
             translation.includes(searchLower) ||
             example.includes(searchLower);
    });

    setFilteredWords(filtered);
    setWords(filtered);
  };

  // 清除搜索
  const handleClearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    setFilteredWords([]);
    setWords(allWords);
  };

  // 切换收藏状态
  const handleToggleFavorite = async (id) => {
    try {
      await toggleWordFavorite(id);
      loadWords(); // 重新加载列表
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert(t('toggleFavoriteError') || '切换收藏状态失败：' + (error.message || '未知错误'));
    }
  };

  // 格式化時間顯示
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 處理時間字段的兼容性（本地存儲使用 createdAt/updatedAt，Supabase 使用 created_at/updated_at）
  const getCreatedAt = (word) => word.createdAt || word.created_at;
  const getUpdatedAt = (word) => word.updatedAt || word.updated_at;

  if (isLoading) {
    return (
      <div className="word-list-container">
        <div className="loading-state">
          <p>正在加载词汇...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="word-list-container">
      {/* 搜索组件 */}
      <WordSearch onSearch={handleSearch} onClear={handleClearSearch} />

      <div className="word-list-header">
        <h2>📚 {isSearching ? t('searchResults') : t('latestWords')} ({words.length} {t('wordsCount')})</h2>
        {isSearching && (
          <div className="search-info">
            <span className="search-term">"{searchTerm}"</span>
            <span className="search-count">
              {words.length > 0
                ? `${words.length} ${t('searchResultsCount')}`
                : t('noSearchResults')
              }
            </span>
          </div>
        )}
      </div>

      {!words || words.length === 0 ? (
        <div className="empty-state">
          <p>{isSearching ? t('noSearchResults') : t('noWords')}</p>
          <p>{isSearching ? '' : t('noWordsSubtext')}</p>
        </div>
      ) : (
        <div className="word-table-container">
          <table className="word-table">
            <thead>
              <tr>
                <th className="col-original">{t('originalText')}</th>
                <th className="col-pronunciation">{t('pronunciation')}</th>
                <th className="col-translation">{t('translation')}</th>
                <th className="col-example">{t('example')}</th>
                <th className="col-created">{t('lastUpdated') || '最後更新'}</th>
                <th className="col-actions">{t('actions') || '操作'}</th>
              </tr>
            </thead>
            <tbody>
              {words && words.length > 0 && words.map((word) => {
                if (!word || !word.id) {
                  console.warn('Invalid word data:', word);
                  return null;
                }
                return (
                <tr key={word.id} className="word-row">
                  {editingWord === word.id ? (
                    // 編輯模式
                    <>
                      <td className="col-original">
                        <input
                          type="text"
                          name="original_text"
                          value={editForm.original_text}
                          onChange={handleEditInputChange}
                          className="edit-input"
                          placeholder={t('originalPlaceholder')}
                        />
                      </td>
                      <td className="col-pronunciation">
                        <input
                          type="text"
                          name="pronunciation"
                          value={editForm.pronunciation}
                          onChange={handleEditInputChange}
                          className="edit-input"
                          placeholder={t('pronunciationPlaceholder')}
                        />
                      </td>
                      <td className="col-translation">
                        <input
                          type="text"
                          name="translation"
                          value={editForm.translation}
                          onChange={handleEditInputChange}
                          className="edit-input"
                          placeholder={t('translationPlaceholder')}
                        />
                      </td>
                      <td className="col-example">
                        <input
                          type="text"
                          name="example"
                          value={editForm.example}
                          onChange={handleEditInputChange}
                          className="edit-input"
                          placeholder={t('examplePlaceholder')}
                        />
                      </td>
                      <td className="col-created">
                        <span className="created-date">
                          {formatDate(getUpdatedAt(word) || getCreatedAt(word))}
                        </span>
                      </td>
                      <td className="col-actions">
                        <div className="edit-actions">
                          <button
                            className="save-btn"
                            onClick={handleSaveEdit}
                            title={t('save') || '保存'}
                          >
                            ✓
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={handleCancelEdit}
                            title={t('cancel') || '取消'}
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // 顯示模式
                    <>
                      <td className="col-original">
                        <span className="original-text">{word.original_text || word.japanese || '-'}</span>
                      </td>
                      <td className="col-pronunciation">
                        <span className="pronunciation">
                          {word.pronunciation || word.reading || '-'}
                        </span>
                      </td>
                      <td className="col-translation">
                        <span className="translation">{word.translation || word.chinese || '-'}</span>
                      </td>
                      <td className="col-example">
                        <span className="example" title={word.example || ''}>
                          {word.example ? (
                            word.example.length > 30
                              ? word.example.substring(0, 30) + '...'
                              : word.example
                          ) : '-'}
                        </span>
                      </td>
                      <td className="col-created">
                        <span className="created-date">
                          {formatDate(getUpdatedAt(word) || getCreatedAt(word))}
                        </span>
                      </td>
                      <td className="col-actions">
                        <div className="action-buttons">
                          <button
                            className={`favorite-btn ${word.is_favorite || word.isFavorite ? 'favorited' : ''}`}
                            onClick={() => handleToggleFavorite(word.id)}
                            title={word.is_favorite || word.isFavorite ? t('removeFavorite') || '取消收藏' : t('addFavorite') || '添加收藏'}
                          >
                            {word.is_favorite || word.isFavorite ? '⭐' : '☆'}
                          </button>
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(word)}
                            title={t('editWord') || '編輯'}
                          >
                            ✏️
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(word.id, word.original_text || word.japanese)}
                            title={t('deleteWord')}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WordList;
