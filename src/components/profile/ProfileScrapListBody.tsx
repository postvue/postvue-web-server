import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  PROFILE_NEW_SCRAP_PATH,
  PROFILE_SCRAP_LIST_PATH,
} from '../../const/PathConst';
import ProfileScrapViewBody from '../common/body/ProfileScrapViewBody';
import FloatingActionButtonLayout from '../layouts/FloatingActionButtonLayout';

const ProfileScrapListBody: React.FC = () => {
  const navigate = useNavigate();

  const MakeScrapScrollRef = useRef<HTMLDivElement>(null);

  return (
    <ProfileScrapListBodyContainer>
      <ProfileScrapViewBody
        profileScrapViewRef={MakeScrapScrollRef}
        onButtonEvent={(scrapId: string) => {
          navigate(`${PROFILE_SCRAP_LIST_PATH}/${scrapId}`);
        }}
      />
      <FloatingActionButtonLayout>
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
      </FloatingActionButtonLayout>
    </ProfileScrapListBodyContainer>
  );
};

const ProfileScrapListBodyContainer = styled.div`
  margin-top: ${({ theme }) => theme.systemSize.header.height};
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
