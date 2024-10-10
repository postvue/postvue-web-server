import { PostComposeUploadByResourceLinkReq } from 'global/interface/post';
import { POST_LIST_PATH, POST_UPLOAD_RESOURCE_LINK } from 'services/appApiPath';
import { privateApi } from '..';

//@REFER: 해당 게시글 링크로만 저장 할 지 아니면 url로 저장 할 지 고민 필요
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
