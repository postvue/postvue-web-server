import React from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import styled from 'styled-components';
import 'swiper/css';
import FollowButton from '../../common/buttton/FollowButton';

import { PROFILE_ACCOUNT_ROUTE_PATH } from '../../../const/PathConst';
import { postExternelEventInfoAtom } from '../../../states/PostAtom';
import { profileDetailInfoPopupAtom } from '../../../states/ProfileAtom';
import theme from '../../../styles/theme';

import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import 'swiper/css/pagination';

import {
  PROFILE_POPUP_PARAM,
  PROFILE_POPUP_USERNAME_PARAM,
  TRUE_PARAM,
} from 'const/QueryParamConst';
import { RoutePushEventDateInterface } from 'const/ReactNativeConst';
import { PostRsp } from 'global/interface/post';
import { isApp, stackRouterPush } from 'global/util/reactnative/nativeRouter';

interface ProfilePostDetailBodyProps {
  postId: string;
  snsPost: PostRsp;
  windowWidthSize: number;
}

const ProfilePostDetailBodyProfileInfo: React.FC<
  ProfilePostDetailBodyProps
> = ({ postId, snsPost, windowWidthSize }) => {
  const profileDetailInfo = useRecoilValue(profileDetailInfoPopupAtom);

  const navigate = useNavigate();

  const setPostExternelEventInfo = useSetRecoilState(postExternelEventInfoAtom);

  return (
    <ProfileWrap>
      <ProfileLinkDiv
        onClick={() => {
          setPostExternelEventInfo((prev) => ({
            ...prev,
            isClosePost: true,
          }));

          const searchParams = new URLSearchParams();
          searchParams.set('postId', postId);
          if (isApp() || windowWidthSize > MEDIA_MOBILE_MAX_WIDTH_NUM) {
            const path = generatePath(PROFILE_ACCOUNT_ROUTE_PATH, {
              username: snsPost.username,
            });

            // const queryParams = new URLSearchParams({
            //   postId: postId,
            // }).toString();
            const newSearch = searchParams.toString();

            const fullPath = `${path}?${newSearch}`;

            const data: RoutePushEventDateInterface = {
              isShowInitBottomNavBar: true,
            };
            stackRouterPush(navigate, fullPath, data);
          } else {
            // 새로운 쿼리 파라미터 추가 또는 기존 파라미터 값 수정
            searchParams.set(PROFILE_POPUP_PARAM, TRUE_PARAM);
            searchParams.set(PROFILE_POPUP_USERNAME_PARAM, snsPost.username);
            // 새로운 쿼리 파라미터가 포함된 URL 생성
            const newSearch = searchParams.toString();
            const newPath = `${location.pathname}?${newSearch}`;

            if (profileDetailInfo.username === snsPost.username) {
              navigate(-1);
            } else {
              navigate(newPath);
            }
          }
        }}
      >
        <ProfileImg src={snsPost?.profilePath} />
        <ProfileUserNameFollowWrap>
          <ProfileFollowButtonWrap>
            <ProfileUserName>{snsPost?.username}</ProfileUserName>
            {snsPost?.followable ? (
              <FollowButton
                userId={snsPost.userId}
                username={snsPost.username}
                postId={snsPost.postId}
                fontSize={theme.fontSizes.Subhead2}
                style={FollowStyle}
                isFollow={snsPost.isFollowed}
              />
            ) : (
              <></>
            )}
          </ProfileFollowButtonWrap>
          <ProfilePositionWrap>
            <ProfilePosition>
              {snsPost.location.address
                ? snsPost.location.address
                : snsPost.location.buildName}
            </ProfilePosition>
          </ProfilePositionWrap>
        </ProfileUserNameFollowWrap>
      </ProfileLinkDiv>
    </ProfileWrap>
  );
};

const PostContentRadis = '30px';

const ProfileWrap = styled.div`
  display: flex;
`;

const ProfileLinkDiv = styled.div`
  display: flex;
  cursor: pointer;
`;

const ProfileFollowButtonWrap = styled.div`
  display: flex;
  gap: 6px;
`;

const ProfileImg = styled.img`
  width: 44px;
  height: 44px;
  border-radius: ${PostContentRadis};
  object-fit: cover;
`;

const ProfileUserNameFollowWrap = styled.div`
  padding: 0 6px 0 8px;
`;

const ProfileUserName = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
`;

const FollowStyle: React.CSSProperties = {
  margin: '0',
};

const ProfilePositionWrap = styled.div`
  width: 100%;
`;

const ProfilePosition = styled.div`
  font: ${({ theme }) => theme.fontSizes.Location2};
  color: ${({ theme }) => theme.grey.Grey6};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
  width: 280px;
`;

export default ProfilePostDetailBodyProfileInfo;
