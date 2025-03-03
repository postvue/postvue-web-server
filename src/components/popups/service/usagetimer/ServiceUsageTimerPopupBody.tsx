import { ReactComponent as FeelogLogo } from 'assets/images/icon/svg/logo/FeelogLargeLogo.svg';
import BottomNextButton from 'components/common/buttton/BottomNextButton';
import { APP_SERVICE_NAME } from 'const/AppInfoConst';
import { LOGIN_PATH } from 'const/PathConst';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ServiceUsageTimerPopupBody: React.FC = () => {
  const navigate = useNavigate();

  return (
    <LoginContainer>
      <LoginLogoWrap>
        <LoginLogoSubWrap>
          <FeelogLogo />
        </LoginLogoSubWrap>
      </LoginLogoWrap>
      <LoginEmailSubTitle>Feelog</LoginEmailSubTitle>

      <LoginEmailInputWrap>
        <LoginEmailInputSubWrap>
          {APP_SERVICE_NAME}에 가입하여 특별한 경험을 공유하고 사람들과 팔로우해
          소통해보세요.
        </LoginEmailInputSubWrap>
      </LoginEmailInputWrap>

      <LoginWrap>
        <BottomNextButton
          title="로그인"
          notActiveTitle="로그인"
          isTransparent={true}
          isActive={true}
          actionFunc={() => navigate(LOGIN_PATH)}
          BottomNextButtonWrapContainerStyle={{
            position: 'absolute',
            bottom: '20px',
            paddingBottom: '0px',
          }}
        />
      </LoginWrap>
    </LoginContainer>
  );
};
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const LoginWrap = styled.div`
  width: 100%;
  text-align: center;
  font: ${({ theme }) => theme.fontSizes.Subhead2};
  margin-bottom: 20px;
  flex: 1;
  position: relative;
`;

const LoginLogoWrap = styled.div`
  display: flex;
  margin-bottom: 5px;
`;
const LoginEmailSubTitle = styled.div`
  text-align: center;
  font: ${({ theme }) => theme.fontSizes.Subhead2};
  margin-bottom: 20px;
`;

const LoginLogoSubWrap = styled.div`
  display: flex;
  margin: 0 auto;
`;

const LoginEmailInputWrap = styled.div`
  margin: 0 20px;
  gap: 20px;
  display: flex;
  flex-flow: column;
`;

const LoginEmailInputSubWrap = styled.div`
  display: flex;
  flex-flow: column;
  text-align: center;
  font: ${({ theme }) => theme.fontSizes.Body2};
  font-size: 16px;
  color: ${({ theme }) => theme.grey.Grey6};
  margin: 0 20px;
`;

export default ServiceUsageTimerPopupBody;
