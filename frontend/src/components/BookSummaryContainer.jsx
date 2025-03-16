import React, { useState } from 'react';
import BookSummary from './BookSummary';
import AdvancedBookSummary from './AdvancedBookSummary';
import './BookSummaryStyles.css';

const BookSummaryContainer = ({ bookId, bookTitle }) => {
  const [mode, setMode] = useState('simple');

  return (
    <div className="book-summary-container">
      <div className="summary-mode-selector">
        <div className="mode-tabs">
          <button 
            className={`mode-tab ${mode === 'simple' ? 'active' : ''}`}
            onClick={() => setMode('simple')}
          >
            Quick Summary
          </button>
          <button 
            className={`mode-tab ${mode === 'advanced' ? 'active' : ''}`}
            onClick={() => setMode('advanced')}
          >
            Advanced Options
          </button>
        </div>
      </div>

      {mode === 'simple' ? (
        <BookSummary bookId={bookId} />
      ) : (
        <AdvancedBookSummary bookId={bookId} bookTitle={bookTitle} />
      )}
    </div>
  );
};

export default BookSummaryContainer;