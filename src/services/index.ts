import axios from 'axios';
import QueryString from 'qs';

// @REFER: 로그인 기능 개발 시 적용
// export const api = axios.create({
//   baseURL: process.env.REACT_APP_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json; charset=UTF-8',
//     Accept: 'application/json',
//   },
//   withCredentials: true,
//   paramsSerializer: (params) => {
//     return QueryString.stringify(params, { encode: true });
//   },
// });

export const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  paramsSerializer: (params) => {
    return QueryString.stringify(params, { encode: true });
  },
});
