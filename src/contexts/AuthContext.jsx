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

      // 检查用户是否已被标记为删除
      const user = data.user
      if (user?.user_metadata?.deleted || user?.user_metadata?.status === 'deleted') {
        // 如果用户已被标记删除，立即登出并拒绝登录
        await supabase.auth.signOut()
        throw new Error('此账户已被删除，无法登录。如有疑问请联系管理员。')
      }

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
        throw new Error('删除词汇数据失败：' + deleteWordsError.message)
      }

      // 尝试使用数据库函数删除账户
      try {
        // 方法1：尝试完全删除账户
        const { data: deleteResult, error: rpcError } = await supabase.rpc('delete_user_account', {
          user_id: user.id
        })

        if (!rpcError && deleteResult?.success) {
          // 删除成功，立即登出
          await signOut()
          return {
            success: true,
            message: deleteResult.message || '账户删除成功',
            deletedWords: deleteResult.deleted_words
          }
        }
      } catch (rpcError) {
        console.log('完全删除方法失败，尝试标记删除:', rpcError)
      }

      // 方法2：使用备用函数标记删除
      try {
        const { data: markResult, error: markError } = await supabase.rpc('mark_user_deleted')

        if (!markError && markResult?.success) {
          // 标记删除成功，立即登出
          await signOut()
          return {
            success: true,
            message: markResult.message || '账户已标记为删除，请联系管理员完成最终删除',
            requiresAdminAction: markResult.requires_admin,
            deletedWords: markResult.deleted_words
          }
        }
      } catch (markError) {
        console.log('标记删除方法失败，使用客户端方法:', markError)
      }

      // 方法3：客户端标记删除（最后备用方案）
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          deleted: true,
          deleted_at: new Date().toISOString(),
          status: 'deleted'
        }
      })

      if (updateError) {
        throw new Error('无法标记账户删除状态：' + updateError.message)
      }

      // 立即登出用户
      await signOut()

      // 返回需要管理员完成删除的消息
      return {
        success: true,
        message: '账户数据已清理并标记为删除。您已被登出，请联系管理员完成最终删除。',
        requiresAdminAction: true
      }

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
