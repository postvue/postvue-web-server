import { PostDocResourceImageRsp } from 'global/interface/post';
import { DOC_RESOURCE_URL } from 'services/appApiQueryParam';
import { api } from '..';
import { DOC_IMAGE_RESOURCE_LIST, POST_LIST_PATH } from '../appApiPath';

export const getPostResourceDocImageList = (
  sourceUrl: string,
): Promise<PostDocResourceImageRsp[]> => {
  return api
    .get(
      `${POST_LIST_PATH}${DOC_IMAGE_RESOURCE_LIST}?${DOC_RESOURCE_URL}=${sourceUrl}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
