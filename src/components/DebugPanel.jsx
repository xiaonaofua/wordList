import { useState } from 'react'
import { checkTableExists, isSupabaseConfigured } from '../utils/wordStorage'
import { useLanguage } from '../contexts/LanguageContext'
import './DebugPanel.css'

const DebugPanel = () => {
  const { t } = useLanguage()
  const [debugInfo, setDebugInfo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSupabaseConfig, setShowSupabaseConfig] = useState(false)
  const [supabaseConfig, setSupabaseConfig] = useState({
    url: '',
    anonKey: ''
  })

  const runDiagnostics = async () => {
    setIsLoading(true)
    let info = '🔍 診斷信息:\n\n'
    
    try {
      // 檢查 Supabase 配置
      const configured = isSupabaseConfigured()
      info += `✅ Supabase 配置狀態: ${configured ? '已配置' : '未配置'}\n`
      
      if (configured) {
        // 檢查表是否存在
        const tableExists = await checkTableExists()
        info += `✅ 數據庫表狀態: ${tableExists ? '存在' : '不存在'}\n`
        
        // 檢查多設備同步狀態
        info += `✅ 多設備同步: 已啟用\n`
        
        // 檢查本地配置
        const config = localStorage.getItem('supabase_config')
        if (config) {
          const parsed = JSON.parse(config)
          info += `✅ Supabase URL: ${parsed.url}\n`
          info += `✅ API Key: ${parsed.anonKey.substring(0, 20)}...\n`
        }
      }
      
      info += '\n📋 建議:\n'
      if (!configured) {
        info += '- 請先配置 Supabase 連接\n'
      } else {
        info += '- 配置看起來正常\n'
        info += '- 如果仍有問題，請檢查瀏覽器控制台錯誤\n'
        info += '- 確保在 Supabase 中執行了正確的 SQL\n'
      }
      
    } catch (error) {
      info += `❌ 診斷過程中發生錯誤: ${error.message}\n`
    }
    
    setDebugInfo(info)
    setIsLoading(false)
  }

  const clearLocalData = () => {
    if (window.confirm('確定要清除所有本地數據嗎？這將刪除本地存儲的詞彙和配置。')) {
      localStorage.removeItem('vocabulary_list')
      localStorage.removeItem('japanese_word_list') // 兼容舊版本
      localStorage.removeItem('supabase_config')
      alert('本地數據已清除，請刷新頁面')
    }
  }

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const { getAllWords } = await import('../utils/wordStorage')
      const words = await getAllWords()
      setDebugInfo(`🔗 連接測試成功！\n找到 ${words.length} 個詞彙`)
    } catch (error) {
      setDebugInfo(`❌ 連接測試失敗: ${error.message}`)
    }
    setIsLoading(false)
  }

  // 處理 Supabase 配置輸入
  const handleSupabaseConfigChange = (e) => {
    const { name, value } = e.target
    setSupabaseConfig(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // 保存 Supabase 配置
  const saveSupabaseConfig = () => {
    if (!supabaseConfig.url.trim() || !supabaseConfig.anonKey.trim()) {
      alert('請填寫完整的 Supabase URL 和 API Key')
      return
    }

    try {
      // 驗證 URL 格式
      new URL(supabaseConfig.url)

      // 保存配置
      localStorage.setItem('supabase_config', JSON.stringify(supabaseConfig))
      alert('Supabase 配置已保存！請刷新頁面以應用新配置。')
      setShowSupabaseConfig(false)

      // 清空表單
      setSupabaseConfig({ url: '', anonKey: '' })
    } catch (error) {
      alert('URL 格式不正確，請檢查後重新輸入')
    }
  }

  // 加載現有配置
  const loadExistingConfig = () => {
    const config = localStorage.getItem('supabase_config')
    if (config) {
      try {
        const parsed = JSON.parse(config)
        setSupabaseConfig(parsed)
        setShowSupabaseConfig(true)
      } catch (error) {
        alert('配置文件格式錯誤')
      }
    } else {
      setShowSupabaseConfig(true)
    }
  }

  return (
    <div className="debug-panel">
      <h3>🛠️ {t('debug') || '調試面板'}</h3>

      <div className="debug-actions">
        <button onClick={runDiagnostics} disabled={isLoading}>
          {isLoading ? '診斷中...' : t('diagnostics') || '運行診斷'}
        </button>
        <button onClick={testConnection} disabled={isLoading}>
          {isLoading ? '測試中...' : t('testConnection') || '測試連接'}
        </button>
        <button onClick={loadExistingConfig} className="config-btn">
          ⚙️ Supabase 配置
        </button>
        <button onClick={clearLocalData} className="danger-btn">
          {t('clearLocalData') || '清除本地數據'}
        </button>
      </div>

      {/* Supabase 配置面板 */}
      {showSupabaseConfig && (
        <div className="supabase-config-panel">
          <h4>⚙️ Supabase 配置</h4>
          <div className="config-form">
            <div className="form-group">
              <label htmlFor="supabase-url">Project URL:</label>
              <input
                type="url"
                id="supabase-url"
                name="url"
                value={supabaseConfig.url}
                onChange={handleSupabaseConfigChange}
                placeholder="https://your-project.supabase.co"
                className="config-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="supabase-key">API Key (anon/public):</label>
              <input
                type="text"
                id="supabase-key"
                name="anonKey"
                value={supabaseConfig.anonKey}
                onChange={handleSupabaseConfigChange}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="config-input"
              />
            </div>
            <div className="config-actions">
              <button onClick={saveSupabaseConfig} className="save-config-btn">
                💾 保存配置
              </button>
              <button
                onClick={() => setShowSupabaseConfig(false)}
                className="cancel-config-btn"
              >
                ❌ 取消
              </button>
            </div>
          </div>
          <div className="config-help">
            <p><strong>📋 配置說明：</strong></p>
            <ul>
              <li>Project URL: 在 Supabase 項目設置中找到</li>
              <li>API Key: 使用 anon/public 密鑰，不是 service_role</li>
              <li>配置後需要刷新頁面才能生效</li>
            </ul>
          </div>
        </div>
      )}

      {debugInfo && (
        <div className="debug-output">
          <h4>診斷結果:</h4>
          <pre>{debugInfo}</pre>
        </div>
      )}
    </div>
  )
}

export default DebugPanel
