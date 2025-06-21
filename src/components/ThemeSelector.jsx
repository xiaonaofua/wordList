import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import './ThemeSelector.css'

const ThemeSelector = () => {
  const { currentTheme, changeTheme, themes } = useTheme()
  const { t, currentLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleThemeChange = (themeId) => {
    changeTheme(themeId)
    setIsOpen(false)
  }

  const currentThemeData = themes[currentTheme]

  return (
    <div className="theme-selector" ref={dropdownRef}>
      <button
        className="theme-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('selectTheme') || '选择主题'}
      >
        <span className="theme-icon">{currentThemeData.icon}</span>
        <span className="theme-name">
          {currentLanguage === 'zh' ? currentThemeData.nameCN : currentThemeData.name}
        </span>
        <span className={`theme-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="theme-dropdown">
          {Object.values(themes).map((theme) => (
            <button
              key={theme.id}
              className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
              onClick={() => handleThemeChange(theme.id)}
            >
              <span className="theme-flag">{theme.icon}</span>
              <div className="theme-info">
                <span className="theme-name">
                  {currentLanguage === 'zh' ? theme.nameCN : theme.name}
                </span>
                <span className="theme-description">
                  {theme.description}
                </span>
              </div>
              {currentTheme === theme.id && (
                <span className="theme-check">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ThemeSelector
