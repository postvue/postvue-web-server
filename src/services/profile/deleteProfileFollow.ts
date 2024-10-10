import { privateApi } from '..';
import { FOLLOW_PATH, PROFILE_LIST_PATH } from '../appApiPath';

export const deleteProfilFollow = (followId: string): Promise<boolean> => {
  return privateApi
    .delete(`${PROFILE_LIST_PATH}${FOLLOW_PATH}/${followId}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
