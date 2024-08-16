import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const ProfileAccountInfo: React.FC = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [offset, setOffset] = useState(0);

  const ProfileAccountInfoRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;

    if (currentScrollPos > prevScrollPos) {
      setOffset(ProfileAccountInfoRef.current?.offsetHeight || 128);
    } else {
      setOffset(0);
    }

    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos]);

  return (
    <ProfileAccountInfoContainer offset={offset} ref={ProfileAccountInfoRef}>
      <ProfileLayout1Wrap>
        <ProfileImg
          src={
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSko16djmgfoxewAPK37fGRlx6QgQEl_18sFg&s'
          }
        />
        <ProfileLayout1SubWrap>
          <ProfileUserIdWrap>Juhueon33</ProfileUserIdWrap>
          <ProfileFollowWrap>
            <ProfileFollowingWrap>
              <ProfileFollowingTitle>팔로우</ProfileFollowingTitle>
              <ProfileFollowingNum>000</ProfileFollowingNum>
            </ProfileFollowingWrap>
            <ProfileFollowerWrap>
              <ProfileFollowerTitle>팔로워</ProfileFollowerTitle>
              <ProfileFollowerNum>000</ProfileFollowerNum>
            </ProfileFollowerWrap>
          </ProfileFollowWrap>
        </ProfileLayout1SubWrap>
      </ProfileLayout1Wrap>
      <ProfileLayout2Wrap>
        <ProfileEditButton>프로필 편집</ProfileEditButton>
        <ProfileShareButton>프로필 공유</ProfileShareButton>
      </ProfileLayout2Wrap>
    </ProfileAccountInfoContainer>
  );
};

const ProfileAccountInfoContainer = styled.div<{ offset: number }>`
  top: calc(44px - var(--offset, 0px));
  z-index: 98;
  background-color: RGB(var(--navy));
  max-width: 100vw;
  transition: top 0.5s;
  position: -webkit-sticky;
  position: sticky;
  --offset: ${(props) => props.offset}px;
  background-color: ${({ theme }) => theme.mainColor.White};
  padding: 0 20px 10px 20px;
`;

const ProfileLayout1Wrap = styled.div`
  display: flex;
  padding: 14px 0 10px 0;
`;

const ProfileImg = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 64px;
`;

const ProfileLayout1SubWrap = styled.div`
  margin: auto 12px auto 12px;
`;

const ProfileUserIdWrap = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body5};
`;

const ProfileFollowWrap = styled.div`
  display: flex;
  gap: 7px;
`;

const ProfileFollowerWrap = styled.div`
  display: flex;
  gap: 2px;
`;

const ProfileFollowerTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  color: ${({ theme }) => theme.grey.Grey7};
`;

const ProfileFollowerNum = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead2};
`;

const ProfileFollowingWrap = styled(ProfileFollowerWrap)``;

const ProfileFollowingTitle = styled(ProfileFollowerTitle)``;

const ProfileFollowingNum = styled(ProfileFollowerNum)``;

const ProfileLayout2Wrap = styled.div`
  display: flex;
  gap: 7px;
`;

const ProfileEditButton = styled.div`
  background-color: ${({ theme }) => theme.mainColor.White};
  width: 100%;
  text-align: center;
  border-radius: 9px;
  border: 1px solid ${({ theme }) => theme.grey.Grey2};
  padding: 7px 0;
  font: ${({ theme }) => theme.fontSizes.Subhead2};
  color: ${({ theme }) => theme.grey.Grey8};
  cursor: pointer;
`;

const ProfileShareButton = styled(ProfileEditButton)``;

export default ProfileAccountInfo;
