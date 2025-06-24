import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import './WordSearch.css'

const WordSearch = ({ onSearch, onClear }) => {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = () => {
    onSearch(searchTerm.trim())
  }

  const handleClear = () => {
    setSearchTerm('')
    onClear()
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="word-search">
      <h3 className="search-title">🔍 {t('searchWords')}</h3>
      <div className="search-container">
        <div className="search-input-group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('searchPlaceholder')}
            className="search-input"
          />
          <div className="search-buttons">
            <button 
              onClick={handleSearch}
              className="search-btn"
              disabled={!searchTerm.trim()}
            >
              {t('searchButton')}
            </button>
            <button 
              onClick={handleClear}
              className="clear-search-btn"
              disabled={!searchTerm}
            >
              {t('clearSearch')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WordSearch
