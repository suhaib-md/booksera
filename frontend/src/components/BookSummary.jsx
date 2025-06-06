import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookSummaryStyles.css';
import { backendAPI } from '../utils/api';

const BookSummary = ({ bookId }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [model, setModel] = useState('bart');
  const [source, setSource] = useState('');

  const fetchSummary = async () => {
    if (!bookId) return;
    
    setLoading(true);
    setError(null);
    
    try {
        const response = await backendAPI.get(
            `/books/${bookId}/summary/?model=${model}`,
            { withCredentials: true }
          );
      setSummary(response.data.summary);
      setSource(response.data.source);
      setLoading(false);
    } catch (err) {
      setError('Failed to load summary. ' + (err.response?.data?.error || err.message));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [bookId, model]);

  const handleModelChange = (e) => {
    setModel(e.target.value);
  };

  if (loading) {
    return (
      <div className="book-summary-loading">
        <p>Generating AI summary...</p>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="book-summary-error">
        <p>{error}</p>
        <button onClick={fetchSummary} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="book-summary">
      <div className="summary-header">
        <h3>AI-Generated Summary</h3>
        <div className="model-selector">
          <label>
            Model:
            <select value={model} onChange={handleModelChange}>
              <option value="bart">BART (News Style)</option>
              <option value="t5">T5 (Concise)</option>
            </select>
          </label>
          {source && <span className="summary-source">Source: {source}</span>}
        </div>
      </div>
      
      <div className="summary-content">
        {summary ? (
          <>
            <p>{summary}</p>
            <p className="summary-disclaimer">
              Note: This summary was automatically generated by AI and may not be perfectly accurate.
            </p>
          </>
        ) : (
          <p>No summary available for this book.</p>
        )}
      </div>
    </div>
  );
};

export default BookSummary;