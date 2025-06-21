import { useState, useEffect } from 'react'
import './SupabaseSetup.css'

const SupabaseSetup = ({ onConfigured }) => {
  const [config, setConfig] = useState({
    url: '',
    anonKey: ''
  })
  const [isConfigured, setIsConfigured] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // 檢查是否已經配置過
    const savedConfig = localStorage.getItem('supabase_config')
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig)
      setConfig(parsed)
      setIsConfigured(true)
      if (onConfigured) {
        onConfigured(parsed)
      }
    }
  }, [onConfigured])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setConfig(prev => ({
      ...prev,
      [name]: value.trim()
    }))
    setError('')
  }

  const validateConfig = () => {
    if (!config.url || !config.anonKey) {
      setError('請填寫所有必填字段')
      return false
    }
    
    if (!config.url.includes('supabase.co')) {
      setError('請輸入有效的 Supabase URL')
      return false
    }
    
    return true
  }

  const handleSave = async () => {
    if (!validateConfig()) return

    setIsLoading(true)
    setError('')

    try {
      // 保存配置到本地存儲
      localStorage.setItem('supabase_config', JSON.stringify(config))
      setIsConfigured(true)
      
      if (onConfigured) {
        onConfigured(config)
      }
    } catch (err) {
      setError('保存配置時發生錯誤')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    localStorage.removeItem('supabase_config')
    setConfig({ url: '', anonKey: '' })
    setIsConfigured(false)
    setError('')
  }

  if (isConfigured) {
    return (
      <div className="supabase-setup configured">
        <div className="config-status">
          <h3>✅ Supabase 已配置</h3>
          <p>您的生詞本現在可以在多設備間同步了！</p>
          <button onClick={handleReset} className="reset-btn">
            重新配置
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="supabase-setup">
      <div className="setup-header">
        <h2>🌐 設置雲端同步</h2>
        <p>配置 Supabase 以實現多設備同步</p>
      </div>

      <div className="setup-instructions">
        <h3>如何獲取 Supabase 配置：</h3>
        <ol>
          <li>訪問 <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">supabase.com</a> 並註冊免費帳戶</li>
          <li>創建新項目</li>
          <li>在項目設置中找到 "API" 部分</li>
          <li>複製 "Project URL" 和 "anon public" 密鑰</li>
        </ol>
      </div>

      <div className="setup-form">
        <div className="form-group">
          <label htmlFor="url">
            Supabase URL <span className="required">*</span>
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={config.url}
            onChange={handleInputChange}
            placeholder="https://your-project.supabase.co"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="anonKey">
            Anon Key <span className="required">*</span>
          </label>
          <textarea
            id="anonKey"
            name="anonKey"
            value={config.anonKey}
            onChange={handleInputChange}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            rows="3"
            required
          />
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-actions">
          <button 
            onClick={handleSave}
            disabled={isLoading}
            className="save-btn"
          >
            {isLoading ? '保存中...' : '保存配置'}
          </button>
        </div>
      </div>

      <div className="setup-note">
        <p><strong>注意：</strong>配置信息將保存在瀏覽器本地，不會上傳到任何服務器。</p>
      </div>
    </div>
  )
}

export default SupabaseSetup
