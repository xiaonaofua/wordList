import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { LanguageCode } from '../types'
import './LanguageSelector.css'

const LanguageSelector: React.FC = () => {
  const { currentLanguage, changeLanguage, languages } = useLanguage()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 點擊外部關閉下拉菜單
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLanguageChange = (langCode: LanguageCode): void => {
    changeLanguage(langCode)
    setIsOpen(false)
  }

  const toggleDropdown = (): void => {
    setIsOpen(!isOpen)
  }

  const currentLang = languages[currentLanguage]

  return (
    <div className="language-selector" ref={dropdownRef}>
      <button
        className="language-button"
        onClick={toggleDropdown}
        aria-label="Select Language"
      >
        <span className="language-flag">{currentLang.flag}</span>
        <span className="language-name">{currentLang.name}</span>
        <span className={`language-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {Object.values(languages).map((lang) => (
            <button
              key={lang.code}
              className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code as LanguageCode)}
            >
              <span className="language-flag">{lang.flag}</span>
              <span className="language-name">{lang.name}</span>
              {currentLanguage === lang.code && (
                <span className="language-check">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSelector
