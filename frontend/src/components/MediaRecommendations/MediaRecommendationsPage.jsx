import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendAPI } from '../../utils/api';
import BookRecommendations from './BookRecommendations';

const MediaRecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await backendAPI.get('/media-recommendations/');
      setRecommendations(response.data.recommendations || []);
      setError(null);
    } catch (err) {
      setError('Failed to load recommendations. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await backendAPI.post('/media-recommendations/refresh/');
      await fetchRecommendations();
    } catch (err) {
      setError('Failed to refresh recommendations. Please try again later.');
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  if (loading && !refreshing) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Finding your perfect watch recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">From Books to Screen</h1>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`px-4 py-2 rounded ${refreshing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
        >
          {refreshing ? 'Refreshing...' : 'Refresh Recommendations'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {recommendations.length === 0 && !loading ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600 mb-4">No recommendations available yet.</p>
          <p className="text-gray-500">
            Add some books to your bookshelf to get personalized media recommendations.
          </p>
        </div>
      ) : (
        <div>
          {recommendations.map((bookRec) => (
            <BookRecommendations 
              key={bookRec.book_id} 
              bookRecommendation={bookRec} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaRecommendationsPage;