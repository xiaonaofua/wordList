import { useState, useEffect } from 'react';
import { getAllWords, deleteWord } from '../utils/wordStorage';
import { useLanguage } from '../utils/i18n';
import './WordList.css';

const WordList = ({ refreshTrigger }) => {
  const { t } = useLanguage();
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

  // 初始加載和刷新時重新加載
  useEffect(() => {
    loadWords();
  }, [refreshTrigger]);

  // 處理刪除詞彙
  const handleDelete = async (id, japanese) => {
    if (window.confirm(`${t('deleteWordConfirm')}「${japanese}」嗎？`)) {
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
        <div className="word-list">
          {words.map((word) => (
            <div key={word.id} className="word-item">
              <div className="word-content">
                <div className="word-main">
                  <div className="japanese-section">
                    <span className="japanese">{word.japanese}</span>
                    {word.reading && (
                      <span className="reading">({word.reading})</span>
                    )}
                  </div>
                  <div className="chinese">{word.chinese}</div>
                </div>
                
                {word.example && (
                  <div className="example">
                    <strong>例句：</strong>{word.example}
                  </div>
                )}
                
                <div className="word-meta">
                  <div className="timestamps">
                    <span className="created">
                      {t('created')}：{formatDate(getCreatedAt(word))}
                    </span>
                    {getUpdatedAt(word) !== getCreatedAt(word) && (
                      <span className="updated">
                        {t('updated')}：{formatDate(getUpdatedAt(word))}
                      </span>
                    )}
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(word.id, word.japanese)}
                    title={t('deleteWord')}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WordList;
