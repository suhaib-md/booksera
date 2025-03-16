// googleBooksApi.js

import axios from 'axios';

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';

export const fetchBookDetails = async (bookId, apiKey) => {
  try {
    const response = await axios.get(`${GOOGLE_BOOKS_API_URL}/${bookId}`, {
      params: { key: apiKey }
    });
    
    return response.data.volumeInfo;
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw new Error('Failed to fetch book details');
  }
};

export const searchBooks = async (query, apiKey, maxResults = 10) => {
  try {
    const response = await axios.get(`${GOOGLE_BOOKS_API_URL}`, {
      params: {
        q: query,
        maxResults,
        key: apiKey
      }
    });
    
    return response.data.items || [];
  } catch (error) {
    console.error('Error searching books:', error);
    throw new Error('Failed to search books');
  }
};

export const getDescription = (volumeInfo) => {
  return volumeInfo?.description || 'No description available';
};