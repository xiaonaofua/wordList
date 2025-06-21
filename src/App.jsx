import { useState, useEffect } from 'react'
import WordForm from './components/WordForm'
import WordList from './components/WordList'
import WordStats from './components/WordStats'
import SupabaseSetup from './components/SupabaseSetup'
import DebugPanel from './components/DebugPanel'
import DataMigration from './components/DataMigration'
import LanguageSelector from './components/LanguageSelector'
import { useLanguage } from './utils/i18n'
import { initializeSupabase, isSupabaseConfigured, getCreateTableSQL } from './utils/wordStorage'
import './App.css'

function App() {
  const { t } = useLanguage()
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [showSetup, setShowSetup] = useState(false)
  const [showDebug, setShowDebug] = useState(false)
  const [showMigration, setShowMigration] = useState(false)
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
            <h1>📚 {t('appTitle')}</h1>
            <p>{t('appSubtitle')}</p>
          </div>
          <div className="header-actions">
            <LanguageSelector />
            <button
              onClick={() => setShowSetup(!showSetup)}
              className={`setup-btn ${isCloudConfigured ? 'configured' : ''}`}
            >
              {isCloudConfigured ? `🌐 ${t('cloudConnected')}` : `⚙️ ${t('setupCloudSync')}`}
            </button>
            {isCloudConfigured && (
              <button
                onClick={() => setShowMigration(true)}
                className="migration-btn"
              >
                🔧 {t('fixSync')}
              </button>
            )}
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="debug-btn"
            >
              🛠️ {t('debug')}
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

        {/* 添加新詞彙表單 - 最頂部位置 */}
        <WordForm onWordAdded={handleWordAdded} />

        {/* 最新詞彙列表 - 第二位置 */}
        <WordList refreshTrigger={refreshTrigger} />

        {/* 統計信息 - 底部位置 */}
        <WordStats refreshTrigger={refreshTrigger} />
      </main>

      <footer className="app-footer">
        <p>© 2024 {t('footerText')}</p>
        <p className="storage-info">
          {isCloudConfigured ? `🌐 ${t('cloudStorage')}` : `💾 ${t('localStorage')}`}
        </p>
      </footer>

      {/* 數據遷移模態框 */}
      {showMigration && (
        <DataMigration onClose={() => setShowMigration(false)} />
      )}
    </div>
  )
}

export default App
