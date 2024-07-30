import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: 'application/json',
  },
  withCredentials: true,
});
