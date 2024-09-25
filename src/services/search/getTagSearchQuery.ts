import { api } from '..';
import { SEARCH_PATH, TAG_LIST_PATH } from '../appApiPath';

export const getTagSearchQuery = (searchQuery: string): Promise<string[]> => {
  return api
    .get(`${SEARCH_PATH}${TAG_LIST_PATH}/${searchQuery}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
