import React from 'react';
import MediaRecommendationCard from './MediaRecommendationCard';

const BookRecommendations = ({ bookRecommendation }) => {
  const { book_title, media } = bookRecommendation;

  if (!media || media.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2">
        Based on <span className="italic">{book_title}</span>
      </h2>
      <div className="space-y-4">
        {media.map((item) => (
          <MediaRecommendationCard key={`${item.type}-${item.id}`} media={item} />
        ))}
      </div>
    </div>
  );
};

export default BookRecommendations;