import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
  sendVerificationEmail,
  generateVerificationCode,
  storeVerificationCode,
  verifyCode as verifyVerificationCode,
  initializeEmailService
} from '../services/emailService'

// 创建认证上下文
const AuthContext = createContext()

// 认证提供者组件
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // 初始化邮件服务
    initializeEmailService()

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

  // 删除账户函数
  const deleteAccount = async () => {
    try {
      // 获取当前用户
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('用户未登录')
      }

      // 删除用户的所有词汇数据
      const { error: deleteWordsError } = await supabase
        .from('words')
        .delete()
        .eq('user_id', user.id)

      if (deleteWordsError) {
        console.error('删除词汇数据失败:', deleteWordsError)
        // 继续删除用户，即使词汇删除失败
      }

      // 删除用户账户
      const { error: deleteUserError } = await supabase.auth.admin.deleteUser(user.id)

      if (deleteUserError) {
        // 如果 admin API 不可用，尝试使用客户端方法
        const { error: clientDeleteError } = await supabase.auth.updateUser({
          data: { deleted: true }
        })

        if (clientDeleteError) {
          throw new Error('删除账户失败，请联系管理员')
        }

        // 标记删除后登出
        await signOut()
        return { success: true, message: '账户已标记为删除，请联系管理员完成删除' }
      }

      return { success: true, message: '账户删除成功' }
    } catch (error) {
      console.error('Delete account error:', error)
      return { success: false, error: error.message || '删除账户失败' }
    }
  }

  // 发送验证码到邮箱
  const sendVerificationCode = async (email, username = '') => {
    try {
      // 生成6位数验证码
      const code = generateVerificationCode()

      // 存储验证码用于后续验证
      storeVerificationCode(email, code)

      // 发送邮件
      const result = await sendVerificationEmail(email, code, username)

      if (result.success) {
        return { success: true, error: null, message: result.message }
      } else {
        return { success: false, error: result.message }
      }
    } catch (error) {
      console.error('Send verification code error:', error)
      return { success: false, error: '发送验证码失败，请稍后重试' }
    }
  }

  // 验证验证码
  const verifyCode = (email, inputCode) => {
    return verifyVerificationCode(email, inputCode)
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    deleteAccount,
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
