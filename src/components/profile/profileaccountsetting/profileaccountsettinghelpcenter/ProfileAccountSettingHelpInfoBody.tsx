import React from 'react';
import styled from 'styled-components';

const ProfileAccountSettingHelpInfoBody: React.FC = () => {
  return (
    <>
      <ProfileAccountSettingHelpCenterInfoContainer>
        <ProfileEmailDetailInfo>대표: 김창민</ProfileEmailDetailInfo>
        <ProfileEmailDetailInfo>
          주소 : 경기도 성남시 수정구 성남대로 1342
        </ProfileEmailDetailInfo>
        <ProfileEmailDetailInfo>
          이메일 : feelog.business@gmail.com
        </ProfileEmailDetailInfo>
      </ProfileAccountSettingHelpCenterInfoContainer>
    </>
  );
};

const ProfileAccountSettingHelpCenterInfoContainer = styled.div`
  padding-top: calc(30px + env(safe-area-inset-top));
`;

const ProfileEmailDetailInfo = styled.div`
  margin: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  font: ${({ theme }) => theme.fontSizes.Body3};
  font-size: 15px;
  color: ${({ theme }) => theme.grey.Grey8};
  margin-top: 10px;
`;

export default ProfileAccountSettingHelpInfoBody;
