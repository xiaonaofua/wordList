import { useState, useEffect } from 'react';
import { getAllWords, deleteWord } from '../utils/wordStorage';
import { useLanguage } from '../contexts/LanguageContext';
import './WordList.css';

const WordList = ({ refreshTrigger }) => {
  const { t, currentLanguage } = useLanguage();
  const [words, setWords] = useState([]);

  // 加載生詞列表（按最新時間排序）
  const loadWords = async () => {
    try {
      const allWords = await getAllWords();
      setWords(allWords);
    } catch (error) {
      console.error('Error loading words:', error);
      alert(t('loadWordsError') + '：' + (error.message || '未知錯誤'));
    }
  };

  // 初始加載、刷新和語言變化時重新加載
  useEffect(() => {
    loadWords();
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

  return (
    <div className="word-list-container">
      <div className="word-list-header">
        <h2>📚 {t('latestWords')} ({words.length} {t('wordsCount')})</h2>
      </div>

      {words.length === 0 ? (
        <div className="empty-state">
          <p>{t('noWords')}</p>
          <p>{t('noWordsSubtext')}</p>
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
                <th className="col-created">{t('created')}</th>
                <th className="col-actions">{t('actions') || '操作'}</th>
              </tr>
            </thead>
            <tbody>
              {words.map((word) => (
                <tr key={word.id} className="word-row">
                  <td className="col-original">
                    <span className="original-text">{word.original_text || word.japanese}</span>
                  </td>
                  <td className="col-pronunciation">
                    <span className="pronunciation">
                      {word.pronunciation || word.reading || '-'}
                    </span>
                  </td>
                  <td className="col-translation">
                    <span className="translation">{word.translation || word.chinese}</span>
                  </td>
                  <td className="col-example">
                    <span className="example" title={word.example}>
                      {word.example ? (
                        word.example.length > 30
                          ? word.example.substring(0, 30) + '...'
                          : word.example
                      ) : '-'}
                    </span>
                  </td>
                  <td className="col-created">
                    <span className="created-date">
                      {formatDate(getCreatedAt(word))}
                    </span>
                  </td>
                  <td className="col-actions">
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(word.id, word.original_text || word.japanese)}
                      title={t('deleteWord')}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WordList;
