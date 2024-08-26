import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import {
  PROFILE_MY_SCRAP_LIST_PATH,
  PROFILE_NEW_SCRAP_PATH,
} from '../../const/PathConst';
import { myProfileScrapListAtom } from '../../states/ProfileAtom';
import theme from '../../styles/theme';
import ProfileScrapViewBody from '../common/body/ProfileScrapViewBody';

const ProfileScrapListBody: React.FC = () => {
  const myProfileScrapList = useRecoilValue(myProfileScrapListAtom);
  const navigate = useNavigate();

  const MakeScrapScrollRef = useRef<HTMLDivElement>(null);
  const prevScrollTopRef = useRef(0);
  const [scrollOpacity, setScrollOpacity] = useState(1);

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        if (MakeScrapScrollRef.current) {
          const scrollTop = MakeScrapScrollRef.current.scrollTop;
          const scrollDifference = scrollTop - prevScrollTopRef.current;

          if (scrollDifference > 50) {
            setScrollOpacity(0);
            prevScrollTopRef.current = scrollTop;
          } else if (scrollDifference < -50) {
            setScrollOpacity(1);
            prevScrollTopRef.current = scrollTop;
          }
        }
      });
    };

    const element = MakeScrapScrollRef.current;
    element?.addEventListener('scroll', handleScroll);

    return () => {
      element?.removeEventListener('scroll', handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <>
      <ProfileScrapViewBody
        profileScrapViewRef={MakeScrapScrollRef}
        profileScrapList={myProfileScrapList}
        onButtonEvent={(scrapId: string) => {
          navigate(`${PROFILE_MY_SCRAP_LIST_PATH}/${scrapId}`);
        }}
      />
      <MakeScrapButtonWrap opacity={scrollOpacity}>
        <Link to={PROFILE_NEW_SCRAP_PATH}>
          <MakeScrapButton>
            <MakeScrapButtonIconWrap>
              <MakeScrapButtonIcon
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
              >
                <path
                  d="M6.49992 0.958252V12.0416M0.958252 6.49992H12.0416"
                  stroke="#3D4248"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </MakeScrapButtonIcon>
            </MakeScrapButtonIconWrap>
            <MakeScrapButtonTitle>스크랩 추가하기</MakeScrapButtonTitle>
          </MakeScrapButton>
        </Link>
      </MakeScrapButtonWrap>
    </>
  );
};

const MakeScrapButtonWrap = styled.div<{ opacity: number }>`
  z-index: 1000;
  position: fixed;
  transform: translate(-50%, 50%);
  left: 50%;

  border-radius: 22px;
  padding: 8px 13px;
  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.15);

  bottom: calc(${theme.systemSize.bottomNavBar.height} + 56px);

  cursor: pointer;

  background-color: rgba(255, 255, 255, ${(props) => props.opacity});
  transition: background-color 0.3s ease; /* Smooth transition for background-color change */
`;

const MakeScrapButton = styled.div`
  display: flex;
  gap: 6px;
`;

const MakeScrapButtonIconWrap = styled.div`
  display: flex;
`;

const MakeScrapButtonIcon = styled.svg`
  margin: auto 0;
`;

const MakeScrapButtonTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead1};
`;

export default ProfileScrapListBody;
