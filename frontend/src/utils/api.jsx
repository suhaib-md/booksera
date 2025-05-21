// api.jsx
import axios from 'axios';

// Get the backend API URL from environment variables
const BACKEND_API_URL = process.env.REACT_APP_API_URL;

// Instance for your backend API (with credentials)
export const backendAPI = axios.create({
  // Use the environment variable for the backend API URL
  baseURL: BACKEND_API_URL,
  withCredentials: true
});

// Instance for external APIs (without credentials)
export const externalAPI = axios.create({
  withCredentials: false
});
