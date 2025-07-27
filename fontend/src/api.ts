import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const AUTH_URL = import.meta.env.VITE_AUTH_URL || '/auth';

export const api = axios.create({
  baseURL: API_URL,
});

export const authApi = axios.create({
  baseURL: AUTH_URL,
});
