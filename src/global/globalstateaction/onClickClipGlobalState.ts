import { SetterOrUpdater } from 'recoil';

import { queryClient } from 'App';
import {
  QUERY_STATE_POST_SCRAP_PREVIEW_LIST,
  QUERY_STATE_PROFILE_POST_LIST,
} from 'const/QueryClientConst';
import { Location, PostRsp } from 'global/interface/post';
import { MyProfileClip } from 'global/interface/profile';
import 'swiper/css';

export const onClickClipGlobalState = (
  postId: string,
  profilePostHashMap: Map<string, PostRsp>,
  setProfilePostHashMap: SetterOrUpdater<Map<string, PostRsp>>,
  myProfileClipHashMap: Map<string, MyProfileClip>,
  setMyProfileClipHashMap: SetterOrUpdater<Map<string, MyProfileClip>>,
  isClipped: boolean,
  postInfo: {
    location: Location;
    postThumbnailContent: string;
    userId: string;
    username: string;
    postedAt: string;
  },
): void => {
  const tempProfilePostHashMap = new Map(profilePostHashMap);

  const tempProfilePost = tempProfilePostHashMap.get(postId);
  if (tempProfilePost) {
    tempProfilePostHashMap.set(postId, {
      ...tempProfilePost,
      isClipped: isClipped,
    });
    setProfilePostHashMap(tempProfilePostHashMap);
  }

  if (isClipped) {
    setMyProfileClipHashMap(
      new Map([
        [
          postId,
          {
            postId: postId,
            location: postInfo.location,
            postThumbnailContent: postInfo.postThumbnailContent,
            userId: postInfo.userId,
            username: postInfo.username,
            postedAt: postInfo.postedAt,
          } as MyProfileClip,
        ],
        ...Array.from(myProfileClipHashMap),
      ]),
    );
  } else {
    const tempMyProfileClipHashMap = new Map(myProfileClipHashMap);
    tempMyProfileClipHashMap.delete(postId);

    setMyProfileClipHashMap(tempMyProfileClipHashMap);
  }
  queryClient.invalidateQueries({
    queryKey: [QUERY_STATE_PROFILE_POST_LIST],
  });
  queryClient.invalidateQueries({
    queryKey: [QUERY_STATE_POST_SCRAP_PREVIEW_LIST, postId],
  });
};
