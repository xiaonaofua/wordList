import { useState } from 'react';
import { addWord } from '../utils/wordStorage';
import './WordForm.css';

const WordForm = ({ onWordAdded }) => {
  const [formData, setFormData] = useState({
    japanese: '',
    reading: '',
    chinese: '',
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
    if (!formData.japanese.trim() || !formData.chinese.trim()) {
      alert('請填寫日文和中文翻譯');
      return;
    }

    setIsSubmitting(true);

    try {
      const newWord = await addWord(
        formData.japanese,
        formData.reading,
        formData.chinese,
        formData.example
      );

      // 清空表單
      setFormData({
        japanese: '',
        reading: '',
        chinese: '',
        example: ''
      });

      // 通知父組件有新詞添加
      if (onWordAdded) {
        onWordAdded(newWord);
      }

      alert('生詞添加成功！');
    } catch (error) {
      console.error('Error adding word:', error);
      alert('添加生詞時發生錯誤：' + (error.message || '未知錯誤'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      japanese: '',
      reading: '',
      chinese: '',
      example: ''
    });
  };

  return (
    <div className="word-form-container">
      <h2>添加新生詞</h2>
      <form onSubmit={handleSubmit} className="word-form">
        <div className="form-group">
          <label htmlFor="japanese">
            日文 <span className="required">*</span>
          </label>
          <input
            type="text"
            id="japanese"
            name="japanese"
            value={formData.japanese}
            onChange={handleChange}
            placeholder="請輸入日文單詞"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reading">
            讀音
          </label>
          <input
            type="text"
            id="reading"
            name="reading"
            value={formData.reading}
            onChange={handleChange}
            placeholder="請輸入假名讀音（可選）"
          />
        </div>

        <div className="form-group">
          <label htmlFor="chinese">
            中文翻譯 <span className="required">*</span>
          </label>
          <input
            type="text"
            id="chinese"
            name="chinese"
            value={formData.chinese}
            onChange={handleChange}
            placeholder="請輸入中文翻譯"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="example">例句</label>
          <textarea
            id="example"
            name="example"
            value={formData.example}
            onChange={handleChange}
            placeholder="請輸入例句（可選）"
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? '添加中...' : '添加生詞'}
          </button>
          <button 
            type="button" 
            className="reset-btn"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            清空
          </button>
        </div>
      </form>
    </div>
  );
};

export default WordForm;
