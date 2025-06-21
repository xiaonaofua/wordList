import { useState } from 'react'
import { isSupabaseConfigured } from '../utils/wordStorage'
import './DataMigration.css'

const DataMigration = ({ onClose }) => {
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)

  const migrationSteps = [
    {
      title: '🔍 檢測到多設備同步問題',
      description: '您的數據庫使用了舊的設備隔離模式，需要升級以支持真正的多設備同步。'
    },
    {
      title: '📋 執行數據庫遷移',
      description: '請在 Supabase SQL Editor 中執行遷移腳本。'
    },
    {
      title: '✅ 完成遷移',
      description: '遷移完成後，所有設備將共享同一份生詞數據。'
    }
  ]

  const getMigrationSQL = () => {
    return `-- 多設備同步修復腳本
-- 請在 Supabase SQL Editor 中執行此腳本

-- 備份現有數據（可選）
CREATE TABLE IF NOT EXISTS words_backup AS SELECT * FROM words;

-- 移除 device_id 限制
ALTER TABLE words DROP COLUMN IF EXISTS device_id;

-- 確保表結構正確
ALTER TABLE words 
  ALTER COLUMN japanese SET NOT NULL,
  ALTER COLUMN chinese SET NOT NULL,
  ALTER COLUMN reading DROP NOT NULL;

-- 重新創建索引
DROP INDEX IF EXISTS idx_words_device_id;
CREATE INDEX IF NOT EXISTS idx_words_updated_at ON words(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_words_reading ON words(reading);
CREATE INDEX IF NOT EXISTS idx_words_chinese ON words(chinese);
CREATE INDEX IF NOT EXISTS idx_words_japanese ON words(japanese);

-- 檢查結果
SELECT COUNT(*) as total_words FROM words;`
  }

  const handleNextStep = () => {
    if (step < migrationSteps.length) {
      setStep(step + 1)
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleComplete = () => {
    setIsProcessing(true)
    // 模擬處理時間
    setTimeout(() => {
      setIsProcessing(false)
      alert('遷移完成！請刷新頁面以查看所有設備的生詞。')
      onClose()
    }, 2000)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('SQL 腳本已複製到剪貼板')
    }).catch(() => {
      alert('複製失敗，請手動複製')
    })
  }

  return (
    <div className="migration-overlay">
      <div className="migration-modal">
        <div className="migration-header">
          <h2>🔧 數據庫遷移向導</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="migration-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(step / migrationSteps.length) * 100}%` }}
            ></div>
          </div>
          <span className="progress-text">步驟 {step} / {migrationSteps.length}</span>
        </div>

        <div className="migration-content">
          <div className="step-info">
            <h3>{migrationSteps[step - 1].title}</h3>
            <p>{migrationSteps[step - 1].description}</p>
          </div>

          {step === 1 && (
            <div className="step-details">
              <div className="problem-explanation">
                <h4>問題說明：</h4>
                <ul>
                  <li>當前數據庫使用 device_id 來隔離不同設備的數據</li>
                  <li>這導致每個設備只能看到自己添加的生詞</li>
                  <li>無法實現真正的多設備同步</li>
                </ul>
                
                <h4>解決方案：</h4>
                <ul>
                  <li>移除 device_id 限制</li>
                  <li>讓所有設備共享同一份生詞數據</li>
                  <li>實現真正的多設備同步</li>
                </ul>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-details">
              <div className="sql-section">
                <h4>請執行以下 SQL 腳本：</h4>
                <div className="sql-container">
                  <pre className="sql-code">{getMigrationSQL()}</pre>
                  <button 
                    className="copy-btn"
                    onClick={() => copyToClipboard(getMigrationSQL())}
                  >
                    📋 複製 SQL
                  </button>
                </div>
                
                <div className="instructions">
                  <h4>執行步驟：</h4>
                  <ol>
                    <li>打開您的 Supabase 項目控制台</li>
                    <li>進入 "SQL Editor"</li>
                    <li>創建新查詢</li>
                    <li>粘貼上面的 SQL 腳本</li>
                    <li>點擊 "Run" 執行</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-details">
              <div className="completion-info">
                <h4>🎉 遷移即將完成！</h4>
                <p>執行 SQL 腳本後，您的數據庫將支持真正的多設備同步：</p>
                <ul>
                  <li>✅ 所有設備將看到相同的生詞列表</li>
                  <li>✅ 在任何設備上添加的生詞都會同步到其他設備</li>
                  <li>✅ 學習統計將包含所有設備的數據</li>
                </ul>
                
                <div className="warning">
                  <strong>注意：</strong>遷移後，如果您在多個設備上都有本地數據，可能會看到重複的生詞。您可以手動刪除重複項。
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="migration-actions">
          {step > 1 && (
            <button className="prev-btn" onClick={handlePrevStep}>
              ← 上一步
            </button>
          )}
          
          {step < migrationSteps.length ? (
            <button className="next-btn" onClick={handleNextStep}>
              下一步 →
            </button>
          ) : (
            <button 
              className="complete-btn" 
              onClick={handleComplete}
              disabled={isProcessing}
            >
              {isProcessing ? '處理中...' : '完成遷移'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default DataMigration
