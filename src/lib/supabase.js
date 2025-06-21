import { createClient } from '@supabase/supabase-js'

// 預配置的 Supabase 實例 - 用於用戶認證和詞彙管理
// 這是一個公共實例，所有用戶共享，但通過 RLS 確保數據隔離
const supabaseUrl = 'https://dcqhsrwojhpoynahkewp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjcWhzcndvamhwb3luYWhrZXdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTI2MjUsImV4cCI6MjA2NjA4ODYyNX0.0VEiKPawHosmoUqE3a_P0TENNmXYUBqHhDS1PA0yFL0'

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
