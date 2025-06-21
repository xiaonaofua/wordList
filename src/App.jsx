import { useState, useEffect } from 'react'
import WordForm from './components/WordForm'
import WordList from './components/WordList'
import WordStats from './components/WordStats'
import SupabaseSetup from './components/SupabaseSetup'
import DebugPanel from './components/DebugPanel'
import DataMigration from './components/DataMigration'
import LanguageSelector from './components/LanguageSelector'
import Auth from './components/Auth'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { initializeSupabase, isSupabaseConfigured, getCreateTableSQL } from './utils/wordStorage'
import './App.css'

// 主應用組件（內部）
const AppContent = () => {
  const { t } = useLanguage()
  const { user, loading, signOut } = useAuth()
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [showSetup, setShowSetup] = useState(false)
  const [showDebug, setShowDebug] = useState(false)
  const [showMigration, setShowMigration] = useState(false)
  const [isCloudConfigured, setIsCloudConfigured] = useState(true) // 现在默认已配置

  // 如果正在加载认证状态，显示加载界面
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t('loading') || '加载中...'}</p>
      </div>
    )
  }

  // 如果用户未登录，显示登录界面
  if (!user) {
    return <Auth />
  }

  // 當添加新詞彙時觸發列表刷新
  const handleWordAdded = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  // 處理登出
  const handleSignOut = async () => {
    if (window.confirm(t('confirmLogout') || '确定要退出登录吗？')) {
      await signOut()
    }
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
            <div className="user-info">
              <span className="welcome-text">
                {t('welcome') || '欢迎'}, {user?.user_metadata?.username || user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="logout-btn"
              >
                🚪 {t('logout')}
              </button>
            </div>
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


    </div>
  )
}

// 主應用組件（外部包裝）
function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
