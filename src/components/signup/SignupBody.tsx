import {
  SIGNUP_BIRTHDATE_INPUT_STEP_VALUE,
  SIGNUP_FAVORITE_TAG_INPUT_STEP_VALUE,
  SIGNUP_GENDER_INPUT_STEP_VALUE,
  SIGNUP_NICKNAME_INPUT_STEP_VALUE,
  SIGNUP_TERM_OF_SERVICE_STEP_VALUE,
  SIGNUP_USERNAME_INPUT_STEP_VALUE,
} from 'const/SignupConst';
import { MEDIA_MIDDLE_WIDTH_NUM } from 'const/SystemAttrConst';
import { AnimatePresence, motion } from 'framer-motion';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { signupStepNumAtom } from 'states/SignupAtom';
import styled from 'styled-components';
import SignupBirthdateStep from './signstep/SignupBirthdateStep';
import SignupFavoriteTagStep from './signstep/SignupFavoriteTagStep';
import SignupGenderStep from './signstep/SignupGenderStep';
import SignupNicknameStep from './signstep/SignupNicknameStep';
import SignupTermOfServiceStep from './signstep/SignupTermOfServiceStep';
import SignupUsernameStep from './signstep/SignupUsernameStep';

const SignupBody: React.FC = () => {
  // const goBackOrNavigate = useGoBackOrNavigate(HOME_PATH);
  const signupStepNum = useRecoilValue(signupStepNumAtom);

  // const signupType = Cookies.get(SIGNUP_TYPE_COOKIE_NAME);

  // const signupTypeList = [
  //   SINGUP_KAKAO_LOGIN_JOIN_TYPE,
  //   SINGUP_NAVER_LOGIN_JOIN_TYPE,
  //   SINGUP_GOOGLE_LOGIN_JOIN_TYPE,
  //   SINGUP_APPLE_LOGIN_JOIN_TYPE,
  // ];

  // useEffect(() => {
  //   if (!signupType || !signupTypeList.includes(signupType)) {
  //     // 해당 가입이 유효하지 않음, 다시 로그인 필요
  //     goBackOrNavigate();
  //   }
  // }, []);

  // 애니메이션 설정
  const stepVariants = {
    initial: { opacity: 0, x: 50 }, // 새로운 스텝이 오른쪽에서 들어옴
    animate: { opacity: 1, x: 0, transition: { duration: 0.3 } }, // 자연스럽게 나타남
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } }, // 기존 스텝이 왼쪽으로 사라짐
  };

  const { windowWidth } = useWindowSize();
  // 현재 스텝 반환 함수
  const getCurrentStepComponent = () => {
    switch (signupStepNum) {
      case SIGNUP_NICKNAME_INPUT_STEP_VALUE:
        return <SignupNicknameStep />;
      case SIGNUP_BIRTHDATE_INPUT_STEP_VALUE:
        return <SignupBirthdateStep />;
      case SIGNUP_GENDER_INPUT_STEP_VALUE:
        return <SignupGenderStep />;
      case SIGNUP_USERNAME_INPUT_STEP_VALUE:
        return <SignupUsernameStep />;
      case SIGNUP_FAVORITE_TAG_INPUT_STEP_VALUE:
        return <SignupFavoriteTagStep />;
      case SIGNUP_TERM_OF_SERVICE_STEP_VALUE:
        return <SignupTermOfServiceStep />;
      default:
        return null;
    }
  };

  return (
    <SignupBodyWrapper>
      {windowWidth <= MEDIA_MIDDLE_WIDTH_NUM ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={signupStepNum} // 스텝 변경 시 새로운 요소로 인식
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100dvh',
            }}
          >
            {getCurrentStepComponent()}
          </motion.div>
        </AnimatePresence>
      ) : (
        <>{getCurrentStepComponent()}</>
      )}
    </SignupBodyWrapper>
  );
};

// 스타일 설정
const SignupBodyWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  display: flex;
  flex-direction: column;
`;

export default SignupBody;
