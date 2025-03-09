import { PostComposeUploadByResourceLinkReq } from 'global/interface/post';
import { POST_LIST_PATH, POST_UPLOAD_RESOURCE_LINK } from 'services/appApiPath';
import { privateApi } from '..';

export const createPostByResourceLink = (
  postComposeUploadByResourceLinkReq: PostComposeUploadByResourceLinkReq,
): Promise<boolean> => {
  return privateApi
    .post(
      `${POST_LIST_PATH}${POST_UPLOAD_RESOURCE_LINK}`,
      postComposeUploadByResourceLinkReq,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
