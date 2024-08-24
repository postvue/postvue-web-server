import { api } from '..';
import { FOLLOW_PATH, PROFILE_LIST_PATH } from '../appApiPath';

export const postProfilFollow = (followId: string): Promise<boolean> => {
  return api
    .post(`${PROFILE_LIST_PATH}${FOLLOW_PATH}/${followId}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
