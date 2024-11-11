import { EDIT_PATH } from 'const/PathConst';
import { ProfileMyInfo } from 'global/interface/profile';
import { addPostToHiddenPostIdList } from 'global/util/HiddenPostIdListUtil';
import { onClickClipBoardCopyButton } from 'global/util/ToastUtil';
import { isValidString } from 'global/util/ValidUtil';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { postPostNotInterested } from 'services/post/postPostNotInterested';
import {
  isActivePostComplaintPopupAtom,
  postBlockedUserInfoAtom,
} from 'states/PostAtom';
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
}) => {
  const navigate = useNavigate();
  const setIsActiveProfileBlock = useSetRecoilState(
    isActiveProfileBlockPopupAtom,
  );
  const setIsActivePostComplaintPopup = useSetRecoilState(
    isActivePostComplaintPopupAtom,
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
            onClickClipBoardCopyButton(window.location.href);
          }}
        >
          게시물 링크 복사
        </SettingPopupContent>
        {myAccountSettingInfo?.userId !== userId ? (
          <>
            <SettingPopupContent onClick={onClickPostNotInterest}>
              관심 없음
            </SettingPopupContent>
            <SettingPopupContent
              onClick={() => {
                setIsSettingActive(false);
                setIsActivePostComplaintPopup(true);
              }}
            >
              게시물 신고
            </SettingPopupContent>
            <SettingPopupContent
              onClick={() => {
                setIsSettingActive(false);
                setPostBlockedUserInfo({ userId: userId, username: username });
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
                navigate(`${EDIT_PATH}/${postId}`);
              }}
            >
              수정 하기
            </SettingPopupContent>
          </>
        )}
      </SettingPopupContentWrap>
    </SettingPopupWrap>
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
