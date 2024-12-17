import { privateApi } from '..';
import { PROFILE_LIST_PATH, SCRAP_LIST_PATH } from '../appApiPath';

export const deleteProfileScrap = (scrapId: string): Promise<boolean> => {
  return privateApi
    .delete(`${PROFILE_LIST_PATH}${SCRAP_LIST_PATH}/${scrapId}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
