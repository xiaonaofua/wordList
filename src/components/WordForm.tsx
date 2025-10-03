import { useState, FormEvent, ChangeEvent } from 'react'
import { addWord } from '../utils/wordStorage'
import { useLanguage } from '../contexts/LanguageContext'
import { WordFormProps } from '../types'
import './WordForm.css'

interface FormData {
  originalText: string
  pronunciation: string
  translation: string
  example: string
}

const WordForm: React.FC<WordFormProps> = ({ onWordAdded }) => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<FormData>({
    originalText: '',
    pronunciation: '',
    translation: '',
    example: ''
  })

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    // 驗證必填字段
    if (!formData.originalText.trim() || !formData.translation.trim()) {
      alert(t('fillRequired'))
      return
    }

    setIsSubmitting(true)

    try {
      await addWord(
        formData.originalText,
        formData.pronunciation,
        formData.translation,
        formData.example
      )

      // 清空表單
      setFormData({
        originalText: '',
        pronunciation: '',
        translation: '',
        example: ''
      })

      // 通知父組件有新詞添加
      if (onWordAdded) {
        onWordAdded()
      }

      alert(t('wordAddSuccess'))
    } catch (error) {
      console.error('Error adding word:', error)
      const errorMessage = error instanceof Error ? error.message : '未知錯誤'
      alert(t('wordAddError') + '：' + errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = (): void => {
    setFormData({
      originalText: '',
      pronunciation: '',
      translation: '',
      example: ''
    })
  }

  return (
    <div className="word-form-container">
      <h2>{t('addNewWord')}</h2>
      <form onSubmit={handleSubmit} className="word-form">
        <div className="form-group">
          <label htmlFor="originalText">
            {t('originalText')} <span className="required">{t('required')}</span>
          </label>
          <input
            type="text"
            id="originalText"
            name="originalText"
            value={formData.originalText}
            onChange={handleChange}
            placeholder={t('originalPlaceholder')}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="pronunciation">
            {t('pronunciation')}
          </label>
          <input
            type="text"
            id="pronunciation"
            name="pronunciation"
            value={formData.pronunciation}
            onChange={handleChange}
            placeholder={t('pronunciationPlaceholder')}
          />
        </div>

        <div className="form-group">
          <label htmlFor="translation">
            {t('translation')} <span className="required">{t('required')}</span>
          </label>
          <input
            type="text"
            id="translation"
            name="translation"
            value={formData.translation}
            onChange={handleChange}
            placeholder={t('translationPlaceholder')}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="example">{t('example')}</label>
          <textarea
            id="example"
            name="example"
            value={formData.example}
            onChange={handleChange}
            placeholder={t('examplePlaceholder')}
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('adding') : t('addWord')}
          </button>
          <button
            type="button"
            className="reset-btn"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            {t('clear')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default WordForm
