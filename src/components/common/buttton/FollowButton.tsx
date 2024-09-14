import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { deleteProfilFollow } from '../../../services/profile/deleteProfileFollow';
import { postProfilFollow } from '../../../services/profile/postProfileFollow';
import { systemPostRspHashMapAtom } from '../../../states/SystemConfigAtom';

interface FollowButtonProps {
  fontSize: string;
  userId: string;
  style?: React.CSSProperties;
  isFollow: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  fontSize,
  userId,
  style,
  isFollow,
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
    <ProfileFollowButtonWrap
      $fontSize={fontSize}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {isFollowed ? (
        <ProfileFollowed onClick={onDeleteFollow}>팔로잉</ProfileFollowed>
      ) : (
        <ProfileFollowButton onClick={onCreateFollow}>
          팔로우
        </ProfileFollowButton>
      )}
    </ProfileFollowButtonWrap>
  );
};

const ProfileFollowButtonWrap = styled.div<{ $fontSize: string }>`
  font: ${(props) => props.$fontSize};
  margin: auto 0;
`;

const ProfileFollowButton = styled.div`
  color: ${({ theme }) => theme.mainColor.Blue};
  line-height: 190%;
  cursor: pointer;
`;

const ProfileFollowed = styled(ProfileFollowButton)`
  color: ${({ theme }) => theme.grey.Grey3};
`;

export default FollowButton;
