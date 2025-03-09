import { POST_COMPOSE, POST_LIST_PATH } from 'services/appApiPath';
import { formApi } from '..';

export const createPostCompose = (formData: FormData): Promise<boolean> => {
  return formApi
    .post(`${POST_LIST_PATH}${POST_COMPOSE}`, formData)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
