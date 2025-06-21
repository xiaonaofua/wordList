import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import './Auth.css'

const Auth = () => {
  const { signUp, signIn, sendVerificationCode, verifyCode } = useAuth()
  const { t } = useLanguage()
  const [mode, setMode] = useState('login') // 'login', 'register', 'verify'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    verificationCode: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
    setSuccess('')
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    return password.length >= 6
  }

  const handleSendCode = async () => {
    if (!validateEmail(formData.email)) {
      setError(t('invalidEmail') || '请输入有效的邮箱地址')
      return
    }

    if (!formData.username.trim()) {
      setError(t('enterUsername') || '请输入用户名')
      return
    }

    setLoading(true)
    setError('')

    const { success, error, message } = await sendVerificationCode(formData.email, formData.username)

    if (success) {
      setSuccess(message || t('verificationCodeSent') || '验证码已发送到您的邮箱')
      setMode('verify')
    } else {
      setError(error || t('sendCodeError') || '发送验证码失败')
    }

    setLoading(false)
  }

  const handleVerifyAndRegister = async () => {
    if (!formData.verificationCode) {
      setError(t('enterVerificationCode') || '请输入验证码')
      return
    }

    // 验证验证码
    const { valid, error: verifyError } = verifyCode(formData.email, formData.verificationCode)
    
    if (!valid) {
      setError(verifyError || t('invalidVerificationCode') || '验证码错误')
      return
    }

    // 验证码正确，进行注册
    if (!formData.username.trim()) {
      setError(t('enterUsername') || '请输入用户名')
      return
    }

    if (!validatePassword(formData.password)) {
      setError(t('passwordTooShort') || '密码至少需要6位字符')
      return
    }

    setLoading(true)
    setError('')

    const { data, error } = await signUp(formData.email, formData.password, formData.username)
    
    if (error) {
      setError(error.message || t('registerError') || '注册失败')
    } else {
      setSuccess(t('registerSuccess') || '注册成功！请检查邮箱确认账户')
      // 注册成功后切换到登录模式
      setTimeout(() => {
        setMode('login')
        setSuccess('')
      }, 2000)
    }
    
    setLoading(false)
  }

  const handleLogin = async () => {
    if (!validateEmail(formData.email)) {
      setError(t('invalidEmail') || '请输入有效的邮箱地址')
      return
    }

    if (!formData.password) {
      setError(t('enterPassword') || '请输入密码')
      return
    }

    setLoading(true)
    setError('')

    const { data, error } = await signIn(formData.email, formData.password)
    
    if (error) {
      setError(error.message || t('loginError') || '登录失败')
    }
    
    setLoading(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (mode === 'login') {
      handleLogin()
    } else if (mode === 'register') {
      handleSendCode()
    } else if (mode === 'verify') {
      handleVerifyAndRegister()
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>
            {mode === 'login' && (t('login') || '登录')}
            {mode === 'register' && (t('register') || '注册')}
            {mode === 'verify' && (t('verifyEmail') || '验证邮箱')}
          </h2>
          <p>
            {mode === 'login' && (t('loginSubtitle') || '登录您的账户以同步词汇')}
            {mode === 'register' && (t('registerSubtitle') || '创建账户以开始学习')}
            {mode === 'verify' && (t('verifySubtitle') || '请输入发送到邮箱的验证码')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode !== 'verify' && (
            <div className="form-group">
              <label htmlFor="email">{t('email') || '邮箱'}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t('emailPlaceholder') || '请输入邮箱地址'}
                required
                disabled={loading}
              />
            </div>
          )}

          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="username">{t('username') || '用户名'}</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder={t('usernamePlaceholder') || '请输入用户名'}
                required
                disabled={loading}
              />
            </div>
          )}

          {(mode === 'login' || mode === 'verify') && (
            <div className="form-group">
              <label htmlFor="password">{t('password') || '密码'}</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={t('passwordPlaceholder') || '请输入密码'}
                required
                disabled={loading}
              />
            </div>
          )}

          {mode === 'verify' && (
            <div className="form-group">
              <label htmlFor="verificationCode">{t('verificationCode') || '验证码'}</label>
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleInputChange}
                placeholder={t('verificationCodePlaceholder') || '请输入6位验证码'}
                maxLength="6"
                required
                disabled={loading}
              />
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (t('loading') || '处理中...') : (
              <>
                {mode === 'login' && (t('loginButton') || '登录')}
                {mode === 'register' && (t('sendCode') || '发送验证码')}
                {mode === 'verify' && (t('completeRegister') || '完成注册')}
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          {mode === 'login' ? (
            <p>
              {t('noAccount') || '还没有账户？'}{' '}
              <button 
                type="button" 
                className="link-btn"
                onClick={() => setMode('register')}
                disabled={loading}
              >
                {t('registerNow') || '立即注册'}
              </button>
            </p>
          ) : mode === 'register' ? (
            <p>
              {t('hasAccount') || '已有账户？'}{' '}
              <button 
                type="button" 
                className="link-btn"
                onClick={() => setMode('login')}
                disabled={loading}
              >
                {t('loginNow') || '立即登录'}
              </button>
            </p>
          ) : (
            <p>
              <button 
                type="button" 
                className="link-btn"
                onClick={() => setMode('register')}
                disabled={loading}
              >
                {t('resendCode') || '重新发送验证码'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Auth
