import axios from 'axios';

// Instance for your backend API (with credentials)
export const backendAPI = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true
});

// Instance for external APIs (without credentials)
export const externalAPI = axios.create({
  withCredentials: false
});