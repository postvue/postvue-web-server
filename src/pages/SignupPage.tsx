import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import SignupBody from 'components/signup/SignupBody';
import { HOME_PATH } from 'const/PathConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';

import { AnimatePresence, motion } from 'framer-motion';
import useBodyAdaptProps from 'hook/customhook/useBodyAdaptProps';
import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { getCheckVerificationCode } from 'services/auth/getCheckVerificationCode';
import {
  signStepTransitionInfoAtom,
  signupStepNumAtom,
} from 'states/SignupAtom';
import styled from 'styled-components';

const SignupPage: React.FC = () => {
  const { windowWidth } = useWindowSize();
  const resetSignupStepNum = useResetRecoilState(signupStepNumAtom);

  useEffect(() => {
    getCheckVerificationCode().catch(() => {
      window.location.href = HOME_PATH;
    });

    return () => {
      resetSignupStepNum();
    };
  }, []);

  const [signStepTransitionInfo, setSignStepTransitionInfo] = useRecoilState(
    signStepTransitionInfoAtom,
  );

  const signupStepNum = useRecoilValue(signupStepNumAtom);

  // 애니메이션 방향 설정 (자연스럽게 뒤로 가는 효과 반영)
  // const pageVariants = {
  //   initial: (direction: 'left' | 'right') => ({
  //     x: direction === 'left' ? '100%' : '-100%', // 새 화면이 들어오는 방향
  //     opacity: 0,
  //   }),
  //   animate: {
  //     x: 0,
  //     opacity: 1,
  //     transition: { duration: 0.3 },
  //   },
  //   exit: (direction: 'left' | 'right') => ({
  //     x: direction === 'left' ? '-100%' : '100%', // 현재 화면이 사라지는 방향 (반대로 설정)
  //     opacity: 0,
  //     transition: { duration: 0.3 },
  //   }),
  // };

  const pageVariants = {
    initial: (direction: 'left' | 'right') => ({
      x: direction === 'left' ? '100%' : '-100%',
      opacity: 0,
    }),
    animate: { x: 0, opacity: 1, transition: { duration: 0.4 } },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'left' ? '-100%' : '100%',
      opacity: 0,
      transition: { duration: 0.4 },
    }),
  };

  useBodyAdaptProps([
    { key: 'position', value: 'fixed' },
    { key: 'overflow', value: 'hidden' },
    { key: 'left', value: '0' },
    { key: 'right', value: '0' },
    { key: 'top', value: '0' },
    { key: 'bottom', value: '0' },
  ]);

  return (
    <>
      {windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <RoundSquareCenterPopupLayout
          onClose={() => {
            ('');
          }}
        >
          <SignupBody />
        </RoundSquareCenterPopupLayout>
      ) : (
        <>
          <AnimatePresence
            mode="wait"
            custom={signStepTransitionInfo.direction}
          >
            <MotionWrapper
              key={signupStepNum}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              custom={signStepTransitionInfo.direction}
              onAnimationComplete={() =>
                setSignStepTransitionInfo((prev) => ({
                  ...prev,
                  inTransition: false,
                }))
              }
            >
              <AppBaseTemplate isAppContainerTopMargin={false}>
                <SignupBody />
              </AppBaseTemplate>
            </MotionWrapper>
          </AnimatePresence>
        </>
      )}
    </>
  );
};

const MotionWrapper = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: absolute;
`;

export default SignupPage;
