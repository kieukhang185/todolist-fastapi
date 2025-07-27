import axios from 'axios';

const API_URL = '/api';
const AUTH_URL = '/auth';

export const api = axios.create({
  baseURL: API_URL,
});

export const authApi = axios.create({
  baseURL: AUTH_URL,
});
