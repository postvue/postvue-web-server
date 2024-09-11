import { api } from '..';
import { SEARCH_PATH } from '../appApiPath';

export const getSearchQuery = (searchQuery: string): Promise<string[]> => {
  return api
    .get(`${SEARCH_PATH}/${searchQuery}`)
    .then((res) => {
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
