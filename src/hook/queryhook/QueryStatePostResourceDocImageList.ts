import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { POST_COMPOSE_IMG_RATIO } from 'const/PostComposeConst';
import {
  QUERY_STATE_POST_RESOURCE_DOC_IMAGE_LIST,
  STALE_30_MINUTES_TIME,
} from 'const/QueryClientConst';
import { PostDocResourceImageRsp } from 'global/interface/post';
import { isValidString } from 'global/util/ValidUtil';
import { getPostResourceDocImageList } from 'services/post/getPostResouceDocImageList';

export const QueryStatePostResourceDocImageList = (
  sourceUrl: string,
  active: boolean,
): UseQueryResult<PostDocResourceImageRsp[], any> => {
  return useQuery<PostDocResourceImageRsp[], any>({
    queryKey: [QUERY_STATE_POST_RESOURCE_DOC_IMAGE_LIST + sourceUrl],
    queryFn: () =>
      getPostResourceDocImageList(sourceUrl).then((value) =>
        getValidImageList(value),
      ),
    staleTime: STALE_30_MINUTES_TIME,
    enabled: isValidString(sourceUrl) && active,
    retry: false,
  });
};

const getValidImageList = async (
  postDocResourceImageRspList: PostDocResourceImageRsp[],
): Promise<PostDocResourceImageRsp[]> => {
  const validImages: PostDocResourceImageRsp[] = [];

  // 이미지 로드 프로미스를 배열로 관리
  const loadPromises = postDocResourceImageRspList.map(
    (postDocResourceImageRsp) => {
      const maxRatio = POST_COMPOSE_IMG_RATIO;
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = postDocResourceImageRsp.contentUrl;

        img.onload = () => {
          // 이미지 너비와 높이가 기준을 넘으면 배열에 추가
          const width = img.width;
          const height = img.height;
          const ratio = width / height;
          if (
            ratio >= 1 / maxRatio &&
            ratio <= maxRatio &&
            width > 200 &&
            height > 200
          ) {
            validImages.push(postDocResourceImageRsp);
          }
          resolve(); // 이미지가 로드되면 프로미스 완료
        };

        img.onerror = () => {
          // 에러가 발생해도 resolve하여 계속 진행
          resolve();
        };
      });
    },
  );

  // 모든 이미지 로드 프로미스가 완료될 때까지 기다림
  await Promise.all(loadPromises);

  return validImages;
};
