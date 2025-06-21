import { createContext, useContext, useState, useEffect } from 'react'

// 語言配置
export const LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸'
  },
  zh: {
    code: 'zh',
    name: '中文',
    flag: '🇨🇳'
  }
}

// 翻譯文本
export const translations = {
  en: {
    // 應用標題
    appTitle: 'Multilingual Vocabulary',
    appSubtitle: 'Record and manage your language learning vocabulary',

    // 表單
    addNewWord: 'Add New Word',
    originalText: 'Original Text',
    pronunciation: 'Pronunciation',
    translation: 'Translation',
    example: 'Example',
    originalPlaceholder: 'Enter the word to learn',
    pronunciationPlaceholder: 'Enter pronunciation or phonetics (optional)',
    translationPlaceholder: 'Enter translation or explanation',
    examplePlaceholder: 'Enter example sentence (optional)',
    addWord: 'Add Word',
    adding: 'Adding...',
    clear: 'Clear',
    required: '*',

    // 詞彙列表
    latestWords: 'Latest Words',
    wordsCount: 'words',
    noWords: 'No words added yet',
    noWordsSubtext: 'Please use the form above to add your first word',
    created: 'Created',
    updated: 'Updated',
    deleteWord: 'Delete this word',

    // 統計
    learningStats: 'Learning Statistics',
    totalWords: 'Total Vocabulary',
    todayAdded: 'Today Added',
    weekAdded: 'Week Added',
    monthAdded: 'Month Added',
    monthlyProgress: 'Monthly Learning Progress',

    // 設置
    setupCloudSync: 'Setup Cloud Sync',
    cloudConnected: 'Cloud Connected',
    fixSync: 'Fix Sync',
    debug: 'Debug',

    // 雲端同步
    supabaseSetup: 'Setup Cloud Sync',
    supabaseSetupDesc: 'Configure Supabase for multi-device sync',
    supabaseConfigured: 'Supabase Configured',
    supabaseConfiguredDesc: 'Your vocabulary can now sync across devices!',
    reconfigure: 'Reconfigure',

    // 消息
    fillRequired: 'Please fill in original text and translation',
    wordAddSuccess: 'Word added successfully!',
    wordAddError: 'Error adding word',
    loadWordsError: 'Error loading word list',
    deleteWordConfirm: 'Are you sure you want to delete the word',
    deleteWordError: 'Error deleting word',

    // 頁腳
    footerText: 'Multilingual Vocabulary - Making language learning easier',
    cloudStorage: 'Using cloud storage',
    localStorage: 'Using local storage',

    // 調試
    diagnostics: 'Diagnostics',
    testConnection: 'Test Connection',
    clearLocalData: 'Clear Local Data',

    // 數據遷移
    migrationTitle: 'Database Migration Wizard',
    migrationDesc: 'Fix multi-device sync issues',

    // 月份
    january: 'Jan', february: 'Feb', march: 'Mar', april: 'Apr',
    may: 'May', june: 'Jun', july: 'Jul', august: 'Aug',
    september: 'Sep', october: 'Oct', november: 'Nov', december: 'Dec',

    // 认证
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    username: 'Username',
    verificationCode: 'Verification Code',
    loginSubtitle: 'Login to your account to sync vocabulary',
    registerSubtitle: 'Create an account to start learning',
    verifySubtitle: 'Please enter the verification code sent to your email',
    verifyEmail: 'Verify Email',
    emailPlaceholder: 'Enter your email address',
    passwordPlaceholder: 'Enter your password',
    usernamePlaceholder: 'Enter your username',
    verificationCodePlaceholder: 'Enter 6-digit code',
    loginButton: 'Login',
    sendCode: 'Send Code',
    completeRegister: 'Complete Registration',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    registerNow: 'Register Now',
    loginNow: 'Login Now',
    resendCode: 'Resend Code',
    loading: 'Loading...',
    invalidEmail: 'Please enter a valid email address',
    enterPassword: 'Please enter password',
    enterUsername: 'Please enter username',
    enterVerificationCode: 'Please enter verification code',
    passwordTooShort: 'Password must be at least 6 characters',
    verificationCodeSent: 'Verification code sent to your email',
    sendCodeError: 'Failed to send verification code',
    invalidVerificationCode: 'Invalid verification code',
    registerError: 'Registration failed',
    loginError: 'Login failed',
    registerSuccess: 'Registration successful! Please check your email to confirm your account',
    welcome: 'Welcome',
    confirmLogout: 'Are you sure you want to logout?'
  },

  zh: {
    // 應用標題
    appTitle: '多語言生詞本',
    appSubtitle: '記錄和管理您的語言學習詞彙',

    // 表單
    addNewWord: '添加新詞彙',
    originalText: '原文',
    pronunciation: '發音',
    translation: '翻譯',
    example: '例句',
    originalPlaceholder: '請輸入要學習的詞彙',
    pronunciationPlaceholder: '請輸入發音或音標（可選）',
    translationPlaceholder: '請輸入翻譯或解釋',
    examplePlaceholder: '請輸入例句（可選）',
    addWord: '添加詞彙',
    adding: '添加中...',
    clear: '清空',
    required: '*',

    // 詞彙列表
    latestWords: '最新詞彙',
    wordsCount: '個',
    noWords: '還沒有添加任何詞彙',
    noWordsSubtext: '請使用上方的表單添加您的第一個詞彙',
    created: '創建',
    updated: '更新',
    deleteWord: '刪除此詞彙',

    // 統計
    learningStats: '學習統計',
    totalWords: '總掌握詞彙',
    todayAdded: '今日新增',
    weekAdded: '本週新增',
    monthAdded: '本月新增',
    monthlyProgress: '每月學習記錄',

    // 設置
    setupCloudSync: '設置雲端同步',
    cloudConnected: '雲端已連接',
    fixSync: '修復同步',
    debug: '調試',

    // 雲端同步
    supabaseSetup: '設置雲端同步',
    supabaseSetupDesc: '配置 Supabase 以實現多設備同步',
    supabaseConfigured: 'Supabase 已配置',
    supabaseConfiguredDesc: '您的生詞本現在可以在多設備間同步了！',
    reconfigure: '重新配置',

    // 消息
    fillRequired: '請填寫原文和翻譯',
    wordAddSuccess: '詞彙添加成功！',
    wordAddError: '添加詞彙時發生錯誤',
    loadWordsError: '加載詞彙列表時發生錯誤',
    deleteWordConfirm: '確定要刪除詞彙',
    deleteWordError: '刪除詞彙時發生錯誤',

    // 頁腳
    footerText: '多語言生詞本 - 讓語言學習更簡單',
    cloudStorage: '使用雲端存儲',
    localStorage: '使用本地存儲',

    // 調試
    diagnostics: '運行診斷',
    testConnection: '測試連接',
    clearLocalData: '清除本地數據',

    // 數據遷移
    migrationTitle: '數據庫遷移向導',
    migrationDesc: '修復多設備同步問題',

    // 月份
    january: '1月', february: '2月', march: '3月', april: '4月',
    may: '5月', june: '6月', july: '7月', august: '8月',
    september: '9月', october: '10月', november: '11月', december: '12月',

    // 认证
    login: '登录',
    register: '注册',
    logout: '退出登录',
    email: '邮箱',
    password: '密码',
    username: '用户名',
    verificationCode: '验证码',
    loginSubtitle: '登录您的账户以同步词汇',
    registerSubtitle: '创建账户以开始学习',
    verifySubtitle: '请输入发送到邮箱的验证码',
    verifyEmail: '验证邮箱',
    emailPlaceholder: '请输入邮箱地址',
    passwordPlaceholder: '请输入密码',
    usernamePlaceholder: '请输入用户名',
    verificationCodePlaceholder: '请输入6位验证码',
    loginButton: '登录',
    sendCode: '发送验证码',
    completeRegister: '完成注册',
    noAccount: '还没有账户？',
    hasAccount: '已有账户？',
    registerNow: '立即注册',
    loginNow: '立即登录',
    resendCode: '重新发送验证码',
    loading: '处理中...',
    invalidEmail: '请输入有效的邮箱地址',
    enterPassword: '请输入密码',
    enterUsername: '请输入用户名',
    enterVerificationCode: '请输入验证码',
    passwordTooShort: '密码至少需要6位字符',
    verificationCodeSent: '验证码已发送到您的邮箱',
    sendCodeError: '发送验证码失败',
    invalidVerificationCode: '验证码错误',
    registerError: '注册失败',
    loginError: '登录失败',
    registerSuccess: '注册成功！请检查邮箱确认账户',
    welcome: '欢迎',
    confirmLogout: '确定要退出登录吗？'
  }
}

// 創建語言上下文
const LanguageContext = createContext()

// 語言存儲鍵
const LANGUAGE_STORAGE_KEY = 'app_language'

// 獲取默認語言
const getDefaultLanguage = () => {
  // 先檢查本地存儲
  const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (saved && LANGUAGES[saved]) {
    return saved
  }
  
  // 默認英文
  return 'en'
}

// 語言提供者組件
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(getDefaultLanguage())

  const changeLanguage = (langCode) => {
    if (LANGUAGES[langCode]) {
      setCurrentLanguage(langCode)
      localStorage.setItem(LANGUAGE_STORAGE_KEY, langCode)
    }
  }

  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key
  }

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    languages: LANGUAGES
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

// 使用語言的 Hook
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
