import React, { useState } from 'react';
import axios from 'axios';
import './BookSummaryStyles.css';

const AdvancedBookSummary = ({ bookId, bookTitle }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [model, setModel] = useState('bart');
  const [style, setStyle] = useState('standard');
  const [maxLength, setMaxLength] = useState(150);
  const [minLength, setMinLength] = useState(40);
  const [wordCount, setWordCount] = useState(0);
  const [originalLength, setOriginalLength] = useState(0);
  const [customText, setCustomText] = useState('');
  const [useCustomText, setUseCustomText] = useState(false);

  const generateSummary = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        model,
        style,
        max_length: maxLength,
        min_length: minLength
      };
      
      if (useCustomText) {
        payload.text = customText;
      } else {
        payload.book_id = bookId;
      }
      
      const response = await axios.post(
        `http://localhost:8000/api/books/advanced-summary/`, payload,
        { withCredentials: true }
      );
      setSummary(response.data.summary);
      setWordCount(response.data.word_count);
      setOriginalLength(response.data.original_length);
      setLoading(false);
    } catch (err) {
      setError('Failed to generate summary. ' + (err.response?.data?.error || err.message));
      setLoading(false);
    }
  };

  const handleModelChange = (e) => {
    setModel(e.target.value);
  };

  const handleStyleChange = (e) => {
    setStyle(e.target.value);
  };

  const handleMaxLengthChange = (e) => {
    setMaxLength(parseInt(e.target.value));
  };

  const handleMinLengthChange = (e) => {
    setMinLength(parseInt(e.target.value));
  };

  const handleCustomTextChange = (e) => {
    setCustomText(e.target.value);
  };

  const handleTextSourceChange = (e) => {
    setUseCustomText(e.target.value === 'custom');
  };

  return (
    <div className="advanced-summary-container">
      <h3>Advanced AI Summary Generator</h3>
      
      <div className="summary-options">
        <div className="option-group">
          <label>Text Source:</label>
          <div className="radio-group">
            <label>
              <input 
                type="radio" 
                name="textSource" 
                value="book" 
                checked={!useCustomText} 
                onChange={handleTextSourceChange} 
              />
              Use book description {bookTitle && `for "${bookTitle}"`}
            </label>
            <label>
              <input 
                type="radio" 
                name="textSource" 
                value="custom" 
                checked={useCustomText} 
                onChange={handleTextSourceChange} 
              />
              Use custom text
            </label>
          </div>
        </div>
        
        {useCustomText && (
          <div className="option-group">
            <label htmlFor="customText">Enter your text to summarize:</label>
            <textarea 
              id="customText"
              value={customText}
              onChange={handleCustomTextChange}
              rows={6}
              placeholder="Paste the text you want to summarize here (minimum 100 characters)..."
            />
          </div>
        )}
        
        <div className="option-row">
          <div className="option-group">
            <label htmlFor="modelSelect">Model:</label>
            <select id="modelSelect" value={model} onChange={handleModelChange}>
              <option value="bart">BART (Better for details)</option>
              <option value="t5">T5 (More concise)</option>
            </select>
          </div>
          
          <div className="option-group">
            <label htmlFor="styleSelect">Style:</label>
            <select id="styleSelect" value={style} onChange={handleStyleChange}>
              <option value="standard">Standard</option>
              <option value="concise">Concise</option>
              <option value="detailed">Detailed</option>
            </select>
          </div>
        </div>
        
        <div className="option-row">
          <div className="option-group">
            <label htmlFor="maxLength">Maximum Length:</label>
            <input 
              type="range" 
              id="maxLength" 
              min="50" 
              max="300" 
              step="10" 
              value={maxLength} 
              onChange={handleMaxLengthChange} 
            />
            <span className="slider-value">{maxLength} words</span>
          </div>
          
          <div className="option-group">
            <label htmlFor="minLength">Minimum Length:</label>
            <input 
              type="range" 
              id="minLength" 
              min="20" 
              max="100" 
              step="5" 
              value={minLength} 
              onChange={handleMinLengthChange} 
            />
            <span className="slider-value">{minLength} words</span>
          </div>
        </div>
        
        <button 
          className="generate-button" 
          onClick={generateSummary} 
          disabled={loading || (!bookId && !customText)}
        >
          {loading ? 'Generating...' : 'Generate Summary'}
        </button>
      </div>
      
      {loading && (
        <div className="summary-loading">
          <p>AI is working on your summary...</p>
          <div className="loading-spinner"></div>
        </div>
      )}
      
      {error && (
        <div className="summary-error">
          <p>{error}</p>
        </div>
      )}
      
      {summary && !loading && (
        <div className="summary-result">
          <h4>Generated Summary</h4>
          <div className="summary-stats">
            <span>Summary: {wordCount} words</span>
            <span>Original: {originalLength} words</span>
            <span>Compression: {originalLength ? Math.round((1 - wordCount / originalLength) * 100) : 0}%</span>
          </div>
          <div className="summary-content">
            <p>{summary}</p>
          </div>
          <p className="summary-disclaimer">
            Note: This summary was automatically generated by AI and may not be perfectly accurate.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdvancedBookSummary;