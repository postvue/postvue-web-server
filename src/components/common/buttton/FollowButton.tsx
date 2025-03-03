import { AxiosError } from 'axios';
import { STATUS_FORBIDDEN_CODE } from 'const/HttpStatusConst';
import { fetchProfilePost } from 'global/util/channel/static/fetchProfilePost';
import { sendVibrationLightEvent } from 'global/util/reactnative/nativeRouter';
import { QueryStateProfileInfo } from 'hook/queryhook/QueryStateProfileInfo';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import theme from 'styles/theme';
import { deleteProfilFollow } from '../../../services/profile/deleteProfileFollow';
import { postProfilFollow } from '../../../services/profile/postProfileFollow';

interface FollowButtonProps {
  fontSize?: string;
  userId: string;
  username: string;
  postId?: string;
  style?: React.CSSProperties;
  isFollow: boolean;
  FollowButton?: React.ReactNode;
  FollowCancelButton?: React.ReactNode;
  FollowButtonContainerStyle?: React.CSSProperties;
  hasFollowCancelButton?: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  fontSize = theme.fontSizes.Subhead2,
  userId,
  username,
  postId,
  style,
  isFollow,
  FollowButton,
  FollowCancelButton,
  FollowButtonContainerStyle,
  hasFollowCancelButton = false,
}) => {
  const clickRef = useRef(false);
  const { refetch: refetchByProfileInfo } = QueryStateProfileInfo(
    username,
    clickRef.current,
  );

  const [followState, setFollowState] = useState<boolean | null>(null);
  const onCreateFollow = () => {
    postProfilFollow(userId)
      .then((value) => {
        if (value) {
          sendVibrationLightEvent();
        }
        setFollowState(value);
        clickRef.current = true;

        refetchByProfileInfo();
        if (!postId) return;
        fetchProfilePost(postId);
      })
      .catch((error: AxiosError) => {
        if (error.status === STATUS_FORBIDDEN_CODE) {
          if (!postId) return;
          fetchProfilePost(postId);
        }

        const data: any = error.response?.data;
        alert(data.message);
      })
      .finally(() => {
        clickRef.current = false;
      });
  };

  const onDeleteFollow = () => {
    deleteProfilFollow(userId)
      .then(() => {
        refetchByProfileInfo();
        if (!postId) return;
        fetchProfilePost(postId);
      })
      .catch((error: AxiosError) => {
        if (error.status === STATUS_FORBIDDEN_CODE) {
          if (!postId) return;
          fetchProfilePost(postId);
        }

        const data: any = error.response?.data;
        alert(data.message);
      });
  };
  return (
    <ProfileFollowButtonContainer
      onClick={(e) => {
        e.stopPropagation();
        (followState != null ? followState : isFollow)
          ? onDeleteFollow()
          : onCreateFollow();
      }}
      style={FollowButtonContainerStyle}
    >
      {(followState != null ? followState : isFollow) ? (
        <>
          {hasFollowCancelButton && (
            <>
              {FollowCancelButton ? (
                FollowCancelButton
              ) : (
                <ProfileFollowButtonWrap $fontSize={fontSize} style={style}>
                  <ProfileFollowed>팔로잉</ProfileFollowed>
                </ProfileFollowButtonWrap>
              )}
            </>
          )}
        </>
      ) : (
        <>
          {FollowButton ? (
            FollowButton
          ) : (
            <ProfileFollowButtonWrap $fontSize={fontSize} style={style}>
              <ProfileFollowButton>팔로우</ProfileFollowButton>
            </ProfileFollowButtonWrap>
          )}
        </>
      )}
    </ProfileFollowButtonContainer>
  );
};

const ProfileFollowButtonContainer = styled.div`
  display: flex;
`;

const ProfileFollowButtonWrap = styled.div<{ $fontSize: string }>`
  font: ${(props) => props.$fontSize};
  margin: auto 0;
  white-space: nowrap;
  display: flex;
`;

const ProfileFollowButton = styled.div`
  color: ${({ theme }) => theme.mainColor.Blue};
  line-height: 190%;
  cursor: pointer;
  display: flex;
`;

const ProfileFollowed = styled(ProfileFollowButton)`
  color: ${({ theme }) => theme.grey.Grey3};
`;

export default FollowButton;
