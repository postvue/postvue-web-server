import axios from 'axios';
import QueryString from 'qs';

export const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: 'application/json',
  },
  withCredentials: true,
  paramsSerializer: (params) => {
    return QueryString.stringify(params, { encode: true });
  },
});
