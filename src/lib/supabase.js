import { createClient } from '@supabase/supabase-js'

// Supabase 配置
// 注意：這些是公開的配置，用於演示目的
// 在生產環境中，請使用環境變量來保護敏感信息
const supabaseUrl = 'https://your-project-url.supabase.co'
const supabaseAnonKey = 'your-anon-key'

// 創建 Supabase 客戶端
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 數據庫表名
export const WORDS_TABLE = 'words'

// 檢查連接狀態
export const checkConnection = async () => {
  try {
    const { data, error } = await supabase.from(WORDS_TABLE).select('count', { count: 'exact', head: true })
    if (error) throw error
    return true
  } catch (error) {
    console.error('Supabase connection error:', error)
    return false
  }
}
