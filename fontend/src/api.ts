import axios from 'axios';

// for dev
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
// const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:8001';

const API_URL = '/api';
const AUTH_URL = '/auth';

export const api = axios.create({
  baseURL: API_URL,
});

export const authApi = axios.create({
  baseURL: AUTH_URL,
});
