import { AxiosError } from 'axios';
import { ProfileInfo } from 'global/interface/profile';
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';
import React from 'react';
import { createBlockUser } from 'services/profile/createBlockUser';
import { deleteBlockUser } from 'services/profile/deleteBlockUser';
import styled from 'styled-components';

interface BlockUserPopupBodyProps {
  userInfo: { username: string; userId: string };
  profileInfo: ProfileInfo;
  hasTransparentOverLay?: boolean;

  onOpenCheck: () => void;
}

const BlockUserPopupBody: React.FC<BlockUserPopupBodyProps> = ({
  userInfo,
  profileInfo,

  onOpenCheck,
}) => {
  const { data: myProfileInfo } = QueryStateMyProfileInfo();

  const onClickAddBlockUser = () => {
    if (!profileInfo) return;

    if (!profileInfo.isBlocked) {
      createBlockUser(userInfo.userId)
        .then(() => {
          onOpenCheck();
        })
        .catch((e: AxiosError) => {
          const data: any = e.response?.data;
          alert(data.message);
        });
    } else {
      deleteBlockUser(userInfo.userId)
        .then(() => {
          onOpenCheck();
        })
        .catch((e: AxiosError) => {
          const data: any = e.response?.data;
          alert(data.message);
        });
    }
  };

  return (
    <>
      {!profileInfo.isBlocked ? (
        <>
          <ProfileNameBlockWrap>
            <ProfileNameBlockTitle>
              @{userInfo.username}님을 차단할까요?
            </ProfileNameBlockTitle>
          </ProfileNameBlockWrap>
          <ProfileBlockDescWrap>
            <ProfileBlockDescContent>
              {userInfo.username}님은 회원님의 게시물을 확인할 수 없으며,
              팔로우, 메시지, 댓글 등과 같은 반응은 할 수 없습니다.
            </ProfileBlockDescContent>
            <ProfileBlockDescContent>
              또한, {userInfo.username}님의 게시물에도 어떠한 반응도 남길 수
              없습니다.
            </ProfileBlockDescContent>
            <ProfileBlockDescContent>
              상대방에게 차단 되었다는 알림이 전송되지 않습니다.
            </ProfileBlockDescContent>
          </ProfileBlockDescWrap>
        </>
      ) : (
        <>
          <ProfileNameBlockWrap>
            <ProfileNameBlockTitle>
              @{userInfo.username}님을 차단 해제할까요?
            </ProfileNameBlockTitle>
          </ProfileNameBlockWrap>
          <ProfileBlockDescWrap>
            <ProfileBlockDescContent>
              {userInfo.username}님은 나를 팔로우하여 내 게시물을 볼 수
              있습니다. 또한, {myProfileInfo?.username}님은 {userInfo.username}
              님을 팔로우하거나 그의 게시물을 확인할 수 있습니다.
            </ProfileBlockDescContent>
          </ProfileBlockDescWrap>
        </>
      )}
      <ScrapMakeButtonWrap>
        <ScrapMakeButton onClick={onClickAddBlockUser}>
          {!profileInfo.isBlocked ? '차단하기' : '차단 해제'}
        </ScrapMakeButton>
      </ScrapMakeButtonWrap>
    </>
  );
};

const ProfileNameBlockWrap = styled.div`
  padding: 0 0 28px 0;
  display: flex;
  justify-content: center;
`;

const ProfileNameBlockTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline2};
`;

const ProfileBlockDescWrap = styled.div`
  display: flex;
  flex-flow: column;
  gap: 21px;
  justify-content: center;
  padding: 0 33px;
`;

const ProfileBlockDescContent = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  text-align: center;
`;

const ScrapMakeButtonWrap = styled.div`
  padding-top: 40px;
  width: 100%;
`;

const ScrapMakeButton = styled.div`
  margin: 0 20px;
  background-color: ${({ theme }) => theme.mainColor.Black};
  padding: 14px 0;
  text-align: center;
  color: ${({ theme }) => theme.mainColor.White};
  border-radius: 8px;
  font: ${({ theme }) => theme.fontSizes.Subhead2};
  cursor: pointer;
`;

export default BlockUserPopupBody;
