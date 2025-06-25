import { useState, useEffect } from 'react'
import WordForm from './components/WordForm'
import WordList from './components/WordList'
import WordStats from './components/WordStats'

import LanguageSelector from './components/LanguageSelector'
import ThemeSelector from './components/ThemeSelector'
import AccountMenu from './components/AccountMenu'
import Auth from './components/Auth'
import ErrorBoundary from './components/ErrorBoundary'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { initializeSupabase, isSupabaseConfigured, getCreateTableSQL } from './utils/wordStorage'
import './App.css'
import './styles/retro-theme.css'

// 主應用組件（內部）
const AppContent = () => {
  const { t } = useLanguage()
  const { user, loading } = useAuth()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

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

  // 刷新词汇列表
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  // 注册 Service Worker (PWA 支持)
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/wordList/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, [])



  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-text">
            <h1>📚 {t('appTitle')}</h1>
            <p>{t('appSubtitle')}</p>
          </div>
          <div className="header-actions">
            <ThemeSelector />
            <LanguageSelector />
            <AccountMenu />

          </div>
        </div>
      </header>

      <main className="app-main">


        {/* 添加新詞彙表單 - 最頂部位置 */}
        <ErrorBoundary>
          <WordForm onWordAdded={handleWordAdded} />
        </ErrorBoundary>

        {/* 最新詞彙列表 - 第二位置 */}
        <ErrorBoundary>
          <WordList refreshTrigger={refreshTrigger} />
        </ErrorBoundary>

        {/* 統計信息 - 底部位置 */}
        <ErrorBoundary>
          <WordStats refreshTrigger={refreshTrigger} />
        </ErrorBoundary>
      </main>

      <footer className="app-footer">
        <p>© 2025 {t('footerText')}</p>
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
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
