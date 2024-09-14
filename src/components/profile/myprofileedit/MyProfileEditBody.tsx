import React from 'react';
import { useRecoilState } from 'recoil';
import { myProfileSettingInfoAtom } from 'states/ProfileAtom';
import styled from 'styled-components';

const MyProfileEditBody: React.FC = () => {
  const [myAccountSettingInfo, setMyAccountSettingInfo] = useRecoilState(
    myProfileSettingInfoAtom,
  );
  return (
    <MyProfileEditBodyContainer>
      <MyProfileImgEditWrap>
        <MyProfileImgEditImgSubWrap>
          <MyProfileImgEditImg $src={myAccountSettingInfo.profilePath}>
            <MyProfileImgEdit>수정</MyProfileImgEdit>
          </MyProfileImgEditImg>
        </MyProfileImgEditImgSubWrap>
      </MyProfileImgEditWrap>
    </MyProfileEditBodyContainer>
  );
};

const MyProfileEditBodyContainer = styled.div`
  padding-top: ${({ theme }) => theme.systemSize.header.height};
`;

const MyProfileImgEditWrap = styled.div`
  display: flex;
  margin: 20px 0 0 0;
`;

const MyProfileImgEditImgSubWrap = styled.div`
  margin: 0 auto;
`;

const MyProfileImgEditImg = styled.div<{ $src: string }>`
  background: url(${(props) => props.$src}) center center / cover;
  width: 104px;
  height: 104px;
  border-radius: 55px;

  display: flex;
  cursor: pointer;
`;

const MyProfileImgEdit = styled.div`
  margin: auto auto;
  text-shadow: 0px 3px 7px ${({ theme }) => theme.mainColor.Black};
  color: ${({ theme }) => theme.mainColor.White};
  font: ${({ theme }) => theme.fontSizes.Body4};
`;

export default MyProfileEditBody;
