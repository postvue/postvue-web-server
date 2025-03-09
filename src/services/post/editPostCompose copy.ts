import {
  EDIT_API_PATH,
  POST_COMPOSE,
  POST_LIST_PATH,
} from 'services/appApiPath';
import { formApi } from '..';

export const editPostCompose = (
  postId: string,
  formData: FormData,
): Promise<boolean> => {
  return formApi
    .put(`${POST_LIST_PATH}${POST_COMPOSE}${EDIT_API_PATH}/${postId}`, formData)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
