import { EDIT_PATH } from 'const/PathConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { ProfileMyInfo } from 'global/interface/profile';
import { addPostToHiddenPostIdList } from 'global/util/HiddenPostIdListUtil';
import { onClickClipBoardCopyButton } from 'global/util/ToastUtil';
import { isValidString } from 'global/util/ValidUtil';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { postPostNotInterested } from 'services/post/postPostNotInterested';
import {
  isActivePostComplaintPopupAtom,
  isActivePostDeletePopupAtom,
  postBlockedUserInfoAtom,
} from 'states/PostAtom';
import { postEditActiveInfoPopupAtom } from 'states/PostComposeAtom';
import { isActiveProfileBlockPopupAtom } from 'states/ProfileAtom';
import styled from 'styled-components';

interface ProfilePostSettingBodyProps {
  setIsSettingActive: React.Dispatch<React.SetStateAction<boolean>>;
  myAccountSettingInfo: ProfileMyInfo;
  setIsInterest: React.Dispatch<React.SetStateAction<boolean>>;
  postId: string;
  isBlocked: boolean;
  userId: string;
  username: string;
  ProfilePostSettingBodyStyle?: React.CSSProperties;
  setIsExternalCloseFunc?: React.Dispatch<React.SetStateAction<boolean>>;
}
const ProfilePostSettingBody: React.FC<ProfilePostSettingBodyProps> = ({
  setIsSettingActive,
  myAccountSettingInfo,
  setIsInterest,
  postId,
  isBlocked,
  userId,
  username,
  ProfilePostSettingBodyStyle,
  setIsExternalCloseFunc,
}) => {
  const navigate = useNavigate();

  const { windowWidth } = useWindowSize();

  const setIsActiveProfileBlock = useSetRecoilState(
    isActiveProfileBlockPopupAtom,
  );
  const setIsActivePostComplaintPopup = useSetRecoilState(
    isActivePostComplaintPopupAtom,
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
        setIsSettingActive(false);
      });
    }
  };

  const setPostBlockedUserInfo = useSetRecoilState(postBlockedUserInfoAtom);

  const onClickActiveBlockUserPopup = () => {
    setIsActiveProfileBlock(true);
  };

  return (
    <>
      <SettingPopupWrap
        style={ProfilePostSettingBodyStyle}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <SettingPopupContentWrap>
          <SettingPopupContent
            onClick={() => {
              setIsSettingActive(false);
              if (setIsExternalCloseFunc) {
                setIsExternalCloseFunc(true);
              }
              onClickClipBoardCopyButton(window.location.href);
            }}
          >
            게시물 링크 복사
          </SettingPopupContent>
          {myAccountSettingInfo?.userId !== userId ? (
            <>
              <SettingPopupContent
                onClick={() => {
                  setIsSettingActive(false);
                  if (setIsExternalCloseFunc) {
                    setIsExternalCloseFunc(true);
                  }
                  onClickPostNotInterest();
                }}
              >
                관심 없음
              </SettingPopupContent>
              <SettingPopupContent
                onClick={() => {
                  setIsSettingActive(false);
                  if (setIsExternalCloseFunc) {
                    setIsExternalCloseFunc(true);
                  }
                  setIsActivePostComplaintPopup(true);
                }}
              >
                게시물 신고
              </SettingPopupContent>
              <SettingPopupContent
                onClick={() => {
                  setIsSettingActive(false);
                  if (setIsExternalCloseFunc) {
                    setIsExternalCloseFunc(true);
                  }
                  setPostBlockedUserInfo({
                    userId: userId,
                    username: username,
                  });
                  onClickActiveBlockUserPopup();
                }}
              >
                {isBlocked ? '차단 해제' : '사용자 차단'}
              </SettingPopupContent>
            </>
          ) : (
            <>
              <SettingPopupContent
                onClick={() => {
                  setIsSettingActive(false);

                  windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM
                    ? setPostEditActiveInfoPopup({
                        postId: postId,
                        isActive: true,
                      })
                    : navigate(`${EDIT_PATH}/${postId}`);
                }}
              >
                수정하기
              </SettingPopupContent>
              <SettingPopupContent
                onClick={() => {
                  setIsSettingActive(false);
                  if (setIsExternalCloseFunc) {
                    setIsExternalCloseFunc(true);
                  }
                  setIsActivePostDeletePopup(true);
                }}
              >
                삭제하기
              </SettingPopupContent>
            </>
          )}
        </SettingPopupContentWrap>
      </SettingPopupWrap>
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
