import { useState, useEffect } from 'react'
import WordForm from './components/WordForm'
import WordList from './components/WordList'
import WordStats from './components/WordStats'
import SupabaseSetup from './components/SupabaseSetup'
import DebugPanel from './components/DebugPanel'
import { initializeSupabase, isSupabaseConfigured, getCreateTableSQL } from './utils/wordStorage'
import './App.css'

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [showSetup, setShowSetup] = useState(false)
  const [showDebug, setShowDebug] = useState(false)
  const [isCloudConfigured, setIsCloudConfigured] = useState(false)

  useEffect(() => {
    // 檢查是否已配置 Supabase
    const savedConfig = localStorage.getItem('supabase_config')
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig)
        const success = initializeSupabase(config)
        setIsCloudConfigured(success)
      } catch (error) {
        console.error('Failed to load Supabase config:', error)
      }
    }
  }, [])

  // 當添加新生詞時觸發列表刷新
  const handleWordAdded = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  // 處理 Supabase 配置完成
  const handleSupabaseConfigured = (config) => {
    const success = initializeSupabase(config)
    setIsCloudConfigured(success)
    setShowSetup(false)
    setRefreshTrigger(prev => prev + 1) // 刷新列表以加載雲端數據
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-text">
            <h1>📚 日文生詞本</h1>
            <p>記錄和管理您的日文學習詞彙</p>
          </div>
          <div className="header-actions">
            <button
              onClick={() => setShowSetup(!showSetup)}
              className={`setup-btn ${isCloudConfigured ? 'configured' : ''}`}
            >
              {isCloudConfigured ? '🌐 雲端已連接' : '⚙️ 設置雲端同步'}
            </button>
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="debug-btn"
            >
              🛠️ 調試
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {showDebug && <DebugPanel />}

        {showSetup && (
          <SupabaseSetup onConfigured={handleSupabaseConfigured} />
        )}

        {isCloudConfigured && (
          <div className="setup-instructions">
            <h3>📋 數據庫設置說明</h3>
            <p>請在您的 Supabase 項目中執行以下 SQL 來創建必要的表結構：</p>
            <details>
              <summary>點擊查看 SQL 代碼</summary>
              <pre className="sql-code">{getCreateTableSQL()}</pre>
            </details>
          </div>
        )}

        {/* 統計信息 */}
        <WordStats refreshTrigger={refreshTrigger} />

        {/* 最新生詞列表 - 最醒目位置 */}
        <WordList refreshTrigger={refreshTrigger} />

        {/* 添加新生詞表單 */}
        <WordForm onWordAdded={handleWordAdded} />
      </main>

      <footer className="app-footer">
        <p>© 2024 日文生詞本 - 讓日文學習更簡單</p>
        <p className="storage-info">
          {isCloudConfigured ? '🌐 使用雲端存儲' : '💾 使用本地存儲'}
        </p>
      </footer>
    </div>
  )
}

export default App
