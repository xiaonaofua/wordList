#!/usr/bin/env node

/**
 * Supabase 心跳检测脚本
 * 用于定期 ping Supabase 以保持项目活跃
 * 
 * 使用方式:
 *   node scripts/ping-supabase.js
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://dcqhsrwojhpoynahkewp.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjcWhzcndvamhwb3luYWhrZXdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTI2MjUsImV4cCI6MjA2NjA4ODYyNX0.0VEiKPawHosmoUqE3a_P0TENNmXYUBqHhDS1PA0yFL0'

const supabase = createClient(supabaseUrl, supabaseKey)

async function pingSupabase() {
  try {
    console.log('🔄 正在连接 Supabase...')
    console.log(`📍 URL: ${supabaseUrl}`)
    
    // 1. 检查数据库连接
    const { error: dbError, count } = await supabase
      .from('words')
      .select('id', { count: 'exact', head: true })
    
    if (dbError) {
      throw new Error(`数据库查询失败: ${dbError.message}`)
    }
    
    console.log('✅ 数据库连接正常')
    console.log(`📊 词汇表记录数: ${count || 0}`)
    
    // 2. 检查认证服务
    const { error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.warn(`⚠️  认证检查警告: ${authError.message}`)
    } else {
      console.log('✅ 认证服务正常')
    }
    
    // 3. 报告成功
    const timestamp = new Date().toISOString()
    console.log(`\n✨ Supabase 项目活跃状态已刷新`)
    console.log(`⏰ 时间: ${timestamp}`)
    console.log(`📅 下次建议 ping: ${new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()}`)
    
    return {
      success: true,
      timestamp,
      recordCount: count || 0
    }
    
  } catch (error) {
    console.error('❌ Ping 失败:', error.message)
    throw error
  }
}

// 执行 ping
pingSupabase()
  .then(() => {
    console.log('\n✅ 任务完成')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ 任务失败:', error)
    process.exit(1)
  })
