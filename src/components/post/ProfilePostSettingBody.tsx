import { ReactComponent as LinkButtonIcon } from 'assets/images/icon/svg/LinkButtonIcon.svg';
import { EDIT_PATH } from 'const/PathConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { addPostToHiddenPostIdList } from 'global/util/HiddenPostIdListUtil';
import { isApp, stackRouterPush } from 'global/util/reactnative/nativeRouter';
import { onClickClipBoardCopyButton } from 'global/util/ToastUtil';
import { isValidString } from 'global/util/ValidUtil';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';
import { QueryStateProfileInfo } from 'hook/queryhook/QueryStateProfileInfo';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { postPostNotInterested } from 'services/post/postPostNotInterested';
import {
  activePostComplaintPopupAtom,
  isActivePostDeletePopupAtom,
} from 'states/PostAtom';
import {
  postEditActiveInfoPopupAtom,
  PostEditType,
} from 'states/PostComposeAtom';
import { activeProfileBlockPopupInfoAtom } from 'states/ProfileAtom';

import styled from 'styled-components';

interface ProfilePostSettingBodyProps {
  setIsInterest: React.Dispatch<React.SetStateAction<boolean>>;
  postId: string;
  type: PostEditType;
  userId: string;
  username: string;
  ProfilePostSettingBodyStyle?: React.CSSProperties;
  onClose: () => void;
}
const ProfilePostSettingBody: React.FC<ProfilePostSettingBodyProps> = ({
  setIsInterest,
  postId,
  type,
  userId,
  username,
  ProfilePostSettingBodyStyle,
  onClose,
}) => {
  const navigate = useNavigate();

  const { windowWidth } = useWindowSize();

  const setActiveProfileBlockPopupInfo = useSetRecoilState(
    activeProfileBlockPopupInfoAtom,
  );
  const setActivePostComplaintPopup = useSetRecoilState(
    activePostComplaintPopupAtom,
  );

  const setIsActivePostDeletePopup = useSetRecoilState(
    isActivePostDeletePopupAtom,
  );

  const setPostEditActiveInfoPopup = useSetRecoilState(
    postEditActiveInfoPopupAtom,
  );

  const onClickPostNotInterest = () => {
    if (postId && isValidString(postId)) {
      postPostNotInterested(postId).then((value) => {
        setIsInterest(value.isInterested);
        addPostToHiddenPostIdList(postId);
        onClose();
      });
    }
  };

  const { data: profileInfo, isFetched: isFetchedByProfileInfo } =
    QueryStateProfileInfo(username);

  const { data: myAccountSettingInfo, isFetched: isFetchedByMyAccount } =
    QueryStateMyProfileInfo();

  return (
    <>
      {isFetchedByMyAccount && (
        <SettingPopupWrap
          style={ProfilePostSettingBodyStyle}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <SettingPopupContentWrap>
            <SettingPopupContent
              onClick={() => {
                onClose();
                onClickClipBoardCopyButton(
                  window.location.href,
                  <LinkButtonIcon />,
                );
              }}
            >
              게시물 링크 복사
            </SettingPopupContent>
            {myAccountSettingInfo?.userId !== userId ? (
              <>
                <SettingPopupContent
                  onClick={() => {
                    onClose();
                    onClickPostNotInterest();
                  }}
                >
                  관심 없음
                </SettingPopupContent>
                <SettingPopupContent
                  onClick={() => {
                    onClose();
                    setActivePostComplaintPopup({
                      isActive: true,
                      userId: userId,
                      username: username,
                    });
                  }}
                >
                  게시물 신고
                </SettingPopupContent>
                {profileInfo && (
                  <SettingPopupContent
                    onClick={() => {
                      onClose();
                      setActiveProfileBlockPopupInfo({
                        isActive: true,
                        userId: userId,
                        username: username,
                      });
                    }}
                  >
                    {profileInfo.isBlocked ? '차단 해제' : '사용자 차단'}
                  </SettingPopupContent>
                )}
              </>
            ) : (
              <>
                <SettingPopupContent
                  onClick={() => {
                    onClose();

                    windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM
                      ? setPostEditActiveInfoPopup({
                          postId: postId,
                          type: type,
                          isActive: true,
                        })
                      : isApp()
                        ? stackRouterPush(navigate, `${EDIT_PATH}/${postId}`)
                        : navigate(`${EDIT_PATH}/${postId}`);
                  }}
                >
                  수정하기
                </SettingPopupContent>
                <SettingPopupContent
                  onClick={() => {
                    onClose();
                    setIsActivePostDeletePopup(true);
                  }}
                >
                  삭제하기
                </SettingPopupContent>
              </>
            )}
          </SettingPopupContentWrap>
        </SettingPopupWrap>
      )}
    </>
  );
};

const SettingPopupWrap = styled.div``;

const SettingPopupContentWrap = styled.div`
  display: flex;
  gap: 34px;
  flex-flow: column;
  // width: 100%;
`;
const SettingPopupContent = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
  cursor: pointer;
  padding: 0 20px;
`;

export default ProfilePostSettingBody;
