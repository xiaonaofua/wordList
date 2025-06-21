import { createContext, useContext, useState, useEffect } from 'react'

// 主题配置
export const THEMES = {
  retro: {
    id: 'retro',
    name: 'Windows 98',
    nameCN: '复古风格',
    icon: '🖥️',
    description: 'Classic Windows 98 / Early IE style'
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    nameCN: '现代风格',
    icon: '✨',
    description: 'Clean and contemporary design'
  }
}

// 创建主题上下文
const ThemeContext = createContext()

// 主题存储键
const THEME_STORAGE_KEY = 'app_theme'

// 获取默认主题
const getDefaultTheme = () => {
  const saved = localStorage.getItem(THEME_STORAGE_KEY)
  if (saved && THEMES[saved]) {
    return saved
  }
  return 'modern' // 默认现代风格
}

// 主题提供者组件
export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(getDefaultTheme())

  // 应用主题到 body
  useEffect(() => {
    document.body.className = `theme-${currentTheme}`
    document.body.setAttribute('data-theme', currentTheme)
  }, [currentTheme])

  const changeTheme = (themeId) => {
    if (THEMES[themeId]) {
      setCurrentTheme(themeId)
      localStorage.setItem(THEME_STORAGE_KEY, themeId)
    }
  }

  const value = {
    currentTheme,
    changeTheme,
    themes: THEMES,
    isRetro: currentTheme === 'retro',
    isModern: currentTheme === 'modern'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// 使用主题的 Hook
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
