import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// 创建认证上下文
const AuthContext = createContext()

// 认证提供者组件
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // 获取初始会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // 注册函数
  const signUp = async (email, password, username) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            display_name: username
          }
        }
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { data: null, error }
    }
  }

  // 登录函数
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { data: null, error }
    }
  }

  // 登出函数
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error }
    }
  }

  // 发送验证码（模拟）
  const sendVerificationCode = async (email) => {
    try {
      // 这里我们模拟发送验证码
      // 在实际应用中，您需要集成真实的邮件服务
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      
      // 将验证码存储在本地存储中（仅用于演示）
      localStorage.setItem(`verification_code_${email}`, JSON.stringify({
        code,
        timestamp: Date.now(),
        expires: Date.now() + 10 * 60 * 1000 // 10分钟过期
      }))
      
      // 在控制台显示验证码（仅用于演示）
      console.log(`验证码已发送到 ${email}: ${code}`)
      alert(`验证码已发送到 ${email}: ${code}\n（这是演示模式，实际应用中验证码会发送到邮箱）`)
      
      return { success: true, error: null }
    } catch (error) {
      console.error('Send verification code error:', error)
      return { success: false, error }
    }
  }

  // 验证验证码
  const verifyCode = (email, inputCode) => {
    try {
      const stored = localStorage.getItem(`verification_code_${email}`)
      if (!stored) {
        return { valid: false, error: '验证码不存在或已过期' }
      }
      
      const { code, expires } = JSON.parse(stored)
      
      if (Date.now() > expires) {
        localStorage.removeItem(`verification_code_${email}`)
        return { valid: false, error: '验证码已过期' }
      }
      
      if (code !== inputCode) {
        return { valid: false, error: '验证码错误' }
      }
      
      // 验证成功，清除验证码
      localStorage.removeItem(`verification_code_${email}`)
      return { valid: true, error: null }
    } catch (error) {
      console.error('Verify code error:', error)
      return { valid: false, error: '验证码验证失败' }
    }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    sendVerificationCode,
    verifyCode
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// 使用认证的 Hook
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
