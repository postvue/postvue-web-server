import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import theme from 'styles/theme';
import { deleteProfilFollow } from '../../../services/profile/deleteProfileFollow';
import { postProfilFollow } from '../../../services/profile/postProfileFollow';
import { systemPostRspHashMapAtom } from '../../../states/SystemConfigAtom';

interface FollowButtonProps {
  fontSize?: string;
  userId: string;
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
  style,
  isFollow,
  FollowButton,
  FollowCancelButton,
  FollowButtonContainerStyle,
  hasFollowCancelButton = false,
}) => {
  const [snsSystemPostHashMap, setSnsSystemPostHashMap] = useRecoilState(
    systemPostRspHashMapAtom,
  );

  const [isFollowed, setIsFollowed] = useState<boolean>(isFollow);

  const updateSystemPostByFollowed = (isFollowed: boolean) => {
    const newSnsPostHashMap = new Map(snsSystemPostHashMap);
    newSnsPostHashMap.forEach((snsPost, key) => {
      if (snsPost.userId === userId) {
        const snsPostTemp = newSnsPostHashMap.get(key);
        if (snsPostTemp !== undefined) {
          newSnsPostHashMap.set(key, {
            ...snsPostTemp,
            isFollowed: isFollowed,
          });
        }
      }
    });

    setSnsSystemPostHashMap(newSnsPostHashMap);
  };

  const onCreateFollow = () => {
    postProfilFollow(userId).then((value) => {
      setIsFollowed(value);

      updateSystemPostByFollowed(value);
    });
  };

  const onDeleteFollow = () => {
    deleteProfilFollow(userId).then((value) => {
      setIsFollowed(value);
      updateSystemPostByFollowed(value);
    });
  };
  return (
    <ProfileFollowButtonContainer
      onClick={(e) => {
        e.stopPropagation();
        isFollowed ? onDeleteFollow() : onCreateFollow();
      }}
      style={FollowButtonContainerStyle}
    >
      {isFollowed ? (
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
