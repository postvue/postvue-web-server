import HeaderLayout from 'components/layouts/HeaderLayout';
import React from 'react';
import styled from 'styled-components';

import { ReactComponent as ScrapComposeTargetAudTabIcon } from 'assets/images/icon/svg/CategoryCheckIcon.svg';
import { ReactComponent as ScrapComposeTargetAudNotActiveTabIcon } from 'assets/images/icon/svg/CategoryNotCheckIcon.svg';
import { TargetAudienceCategory } from 'const/ScrapConst';
import { TargetAudienceInterface } from 'global/interface/profile';

interface ProfileScrapTargetAudiencePopupBodyProps {
  targetAudValue: TargetAudienceInterface;
  setTargetAudValue: React.Dispatch<
    React.SetStateAction<TargetAudienceInterface>
  >;
}

const ProfileScrapTargetAudiencePopupBody: React.FC<
  ProfileScrapTargetAudiencePopupBodyProps
> = ({ targetAudValue, setTargetAudValue }) => {
  return (
    <ProfileScrapTargetHeaderContainer>
      <HeaderLayout HeaderLayoutStyle={{ position: 'static' }}>
        <ProfileScrapTargetHeaderTitle>공개 대상</ProfileScrapTargetHeaderTitle>
      </HeaderLayout>
      <ProfileScrapTargetBodyContainer>
        {Object.values(TargetAudienceCategory).map((value, key) => (
          <ProfileScrapTargetWrap
            key={key}
            onClick={() => {
              setTargetAudValue(value);
            }}
          >
            <ProfileScrapTargetAudienceTab>
              {value.displayPhrase}
            </ProfileScrapTargetAudienceTab>

            <ProfileScrapTargetAudTabWrap>
              {targetAudValue.targetAudienceValue ===
              value.targetAudienceValue ? (
                <ScrapComposeTargetAudTabIcon />
              ) : (
                <ScrapComposeTargetAudNotActiveTabIcon />
              )}
            </ProfileScrapTargetAudTabWrap>
          </ProfileScrapTargetWrap>
        ))}
      </ProfileScrapTargetBodyContainer>
    </ProfileScrapTargetHeaderContainer>
  );
};

const ProfileScrapTargetHeaderContainer = styled.div`
  flex: 1;
`;

const ProfileScrapTargetHeaderTitle = styled.div`
  width: 100%;
  margin: auto;
  text-align: center;
  font: ${({ theme }) => theme.fontSizes.Subhead3};
`;

const ProfileScrapTargetBodyContainer = styled.div`
  display: flex;
  flex-flow: column;
  gap: 20px;
`;

const ProfileScrapTargetWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  cursor: pointer;
`;

const ProfileScrapTargetAudienceTab = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
  font-size: 18px;
`;

const ProfileScrapTargetAudTabWrap = styled.div`
  display: flex;
  margin: auto 0;
`;

export default ProfileScrapTargetAudiencePopupBody;
