import { useState, useEffect } from 'react';
import { getAllWords } from '../utils/wordStorage';
import { useLanguage } from '../contexts/LanguageContext';
import './WordStats.css';

const WordStats = ({ refreshTrigger }) => {
  const { t, currentLanguage } = useLanguage();
  const [stats, setStats] = useState({
    totalWords: 0,
    monthlyStats: [],
    todayWords: 0,
    thisWeekWords: 0,
    thisMonthWords: 0
  });

  // 計算統計數據
  const calculateStats = async () => {
    try {
      const words = await getAllWords();
      
      // 總詞彙數
      const totalWords = words.length;
      
      // 按月份統計
      const monthlyMap = new Map();
      let todayWords = 0;
      let thisWeekWords = 0;
      let thisMonthWords = 0;
      
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      words.forEach(word => {
        const createdDate = new Date(word.created_at || word.createdAt);
        const monthKey = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`;
        
        // 月份統計
        if (!monthlyMap.has(monthKey)) {
          monthlyMap.set(monthKey, 0);
        }
        monthlyMap.set(monthKey, monthlyMap.get(monthKey) + 1);
        
        // 今日統計
        if (createdDate >= today) {
          todayWords++;
        }
        
        // 本週統計
        if (createdDate >= weekAgo) {
          thisWeekWords++;
        }
        
        // 本月統計
        if (createdDate >= monthStart) {
          thisMonthWords++;
        }
      });
      
      // 轉換為數組並排序
      const monthlyStats = Array.from(monthlyMap.entries())
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => b.month.localeCompare(a.month))
        .slice(0, 12); // 只顯示最近12個月
      
      setStats({
        totalWords,
        monthlyStats,
        todayWords,
        thisWeekWords,
        thisMonthWords
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  useEffect(() => {
    calculateStats();
  }, [refreshTrigger, currentLanguage]); // 添加語言變化監聽

  // 格式化月份顯示
  const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split('-');
    return `${year}年${month}月`;
  };

  return (
    <div className="word-stats">
      <h2>📊 {t('learningStats')}</h2>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-number">{stats.totalWords}</div>
          <div className="stat-label">{t('totalWords')}</div>
        </div>

        <div className="stat-card today">
          <div className="stat-number">{stats.todayWords}</div>
          <div className="stat-label">{t('todayAdded')}</div>
        </div>

        <div className="stat-card week">
          <div className="stat-number">{stats.thisWeekWords}</div>
          <div className="stat-label">{t('weekAdded')}</div>
        </div>

        <div className="stat-card month">
          <div className="stat-number">{stats.thisMonthWords}</div>
          <div className="stat-label">{t('monthAdded')}</div>
        </div>
      </div>

      {stats.monthlyStats.length > 0 && (
        <div className="monthly-stats">
          <h3>📈 {t('monthlyProgress')}</h3>
          <div className="monthly-chart">
            {stats.monthlyStats.map(({ month, count }) => (
              <div key={month} className="month-bar">
                <div className="bar-container">
                  <div 
                    className="bar" 
                    style={{ 
                      height: `${Math.max(20, (count / Math.max(...stats.monthlyStats.map(s => s.count))) * 100)}px` 
                    }}
                  ></div>
                </div>
                <div className="month-label">{formatMonth(month)}</div>
                <div className="month-count">{count}個</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WordStats;
