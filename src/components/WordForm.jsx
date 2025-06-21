import { useState } from 'react';
import { addWord } from '../utils/wordStorage';
import { useLanguage } from '../utils/i18n';
import './WordForm.css';

const WordForm = ({ onWordAdded }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    originalText: '',
    pronunciation: '',
    translation: '',
    example: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 驗證必填字段
    if (!formData.originalText.trim() || !formData.translation.trim()) {
      alert(t('fillRequired'));
      return;
    }

    setIsSubmitting(true);

    try {
      const newWord = await addWord(
        formData.originalText,
        formData.pronunciation,
        formData.translation,
        formData.example
      );

      // 清空表單
      setFormData({
        originalText: '',
        pronunciation: '',
        translation: '',
        example: ''
      });

      // 通知父組件有新詞添加
      if (onWordAdded) {
        onWordAdded(newWord);
      }

      alert(t('wordAddSuccess'));
    } catch (error) {
      console.error('Error adding word:', error);
      alert(t('wordAddError') + '：' + (error.message || '未知錯誤'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      originalText: '',
      pronunciation: '',
      translation: '',
      example: ''
    });
  };

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
            rows="3"
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
  );
};

export default WordForm;
