import React from 'react';

const MediaRecommendationCard = ({ media }) => {
  const { title, type, poster_path, overview } = media;
  const imageUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w200${poster_path}` 
    : 'https://placehold.co/200x300?text=No+Image';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="flex">
        <div className="w-32 h-48 flex-shrink-0">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="p-4 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
              {type === 'movie' ? 'Movie' : 'TV Show'}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600 line-clamp-3">{overview || 'No description available.'}</p>
          <div className="mt-4">
            <a 
              href={`https://www.themoviedb.org/${type}/${media.id}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View on TMDb →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaRecommendationCard;