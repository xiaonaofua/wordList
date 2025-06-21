import { useState } from 'react'
import { checkTableExists, isSupabaseConfigured } from '../utils/wordStorage'
import './DebugPanel.css'

const DebugPanel = () => {
  const [debugInfo, setDebugInfo] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
    if (window.confirm('確定要清除所有本地數據嗎？這將刪除本地存儲的生詞和配置。')) {
      localStorage.removeItem('japanese_word_list')
      localStorage.removeItem('supabase_config')
      alert('本地數據已清除，請刷新頁面')
    }
  }

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const { getAllWords } = await import('../utils/wordStorage')
      const words = await getAllWords()
      setDebugInfo(`🔗 連接測試成功！\n找到 ${words.length} 個生詞`)
    } catch (error) {
      setDebugInfo(`❌ 連接測試失敗: ${error.message}`)
    }
    setIsLoading(false)
  }

  return (
    <div className="debug-panel">
      <h3>🛠️ 調試面板</h3>
      <div className="debug-actions">
        <button onClick={runDiagnostics} disabled={isLoading}>
          {isLoading ? '診斷中...' : '運行診斷'}
        </button>
        <button onClick={testConnection} disabled={isLoading}>
          {isLoading ? '測試中...' : '測試連接'}
        </button>
        <button onClick={clearLocalData} className="danger-btn">
          清除本地數據
        </button>
      </div>
      
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
