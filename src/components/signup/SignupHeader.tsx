import { ReactComponent as PrevButtonIcon } from 'assets/images/icon/svg/PrevButtonIcon.svg';
import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import { SIGNUP_STEP_QUERY_PARAM } from 'const/QueryParamConst';
import {
  SIGNUP_BIRTHDATE_GENDER_INPUT_STEP_QUERY_PARAM_VALUE,
  SIGNUP_BIRTHDATE_GENDER_INPUT_STEP_VALUE,
  SIGNUP_FAVORITE_TAG_INPUT_STEP_QUERY_PARAM_VALUE,
  SIGNUP_FAVORITE_TAG_INPUT_STEP_VALUE,
  SIGNUP_NICKNAME_INPUT_STEP_QUERY_PARAM_VALUE,
  SIGNUP_NICKNAME_INPUT_STEP_VALUE,
  SIGNUP_TERM_OF_SERVICE_QUERY_PARAM_VALUE,
  SIGNUP_TERM_OF_SERVICE_STEP_VALUE,
  SIGNUP_USERNAME_INPUT_STEP_QUERY_PARAM_VALUE,
  SIGNUP_USERNAME_INPUT_STEP_VALUE,
} from 'const/SignupConst';
import { stackRouterLogin } from 'global/util/reactnative/nativeRouter';
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  signStepTransitionInfoAtom,
  signupStepNumAtom,
} from 'states/SignupAtom';
import styled from 'styled-components';
import theme from 'styles/theme';

const SignupHeader: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [signupStepNum, setSignupStepNum] = useRecoilState(signupStepNumAtom);

  const signupStepList = [
    {
      stepNum: SIGNUP_NICKNAME_INPUT_STEP_VALUE,
      queryParam: SIGNUP_NICKNAME_INPUT_STEP_QUERY_PARAM_VALUE,
    },
    {
      stepNum: SIGNUP_BIRTHDATE_GENDER_INPUT_STEP_VALUE,
      queryParam: SIGNUP_BIRTHDATE_GENDER_INPUT_STEP_QUERY_PARAM_VALUE,
    },
    {
      stepNum: SIGNUP_USERNAME_INPUT_STEP_VALUE,
      queryParam: SIGNUP_USERNAME_INPUT_STEP_QUERY_PARAM_VALUE,
    },
    {
      stepNum: SIGNUP_FAVORITE_TAG_INPUT_STEP_VALUE,
      queryParam: SIGNUP_FAVORITE_TAG_INPUT_STEP_QUERY_PARAM_VALUE,
    },
    {
      stepNum: SIGNUP_TERM_OF_SERVICE_STEP_VALUE,
      queryParam: SIGNUP_TERM_OF_SERVICE_QUERY_PARAM_VALUE,
    },
  ];

  const naviage = useNavigate();

  const setSignStepTransitionInfo = useSetRecoilState(
    signStepTransitionInfoAtom,
  );

  const handleBackButton = () => {
    setSignStepTransitionInfo({
      inTransition: true,
      direction: 'right',
    });
  };

  const onClose = () => {
    stackRouterLogin({ isNavigate: true, navigate: naviage });
  };

  useEffect(() => {
    searchParams.set(
      SIGNUP_STEP_QUERY_PARAM,
      signupStepList[signupStepNum - 1].queryParam,
    );
    setSearchParams(searchParams);
  }, [signupStepNum]);

  return (
    <PrevButtonHeaderHeader
      HeaderLayoutStyle={{ position: 'static' }}
      hasTitleReactNode={true}
      isActionFunc={true}
      actionFunc={() => {
        if (signupStepNum > 1) {
          handleBackButton();
          setSignupStepNum(signupStepNum - 1);
        } else {
          onClose();
        }
      }}
      preNodeByState={
        <div>
          <PrevButtonIcon />
        </div>
      }
      titleReactNode={
        <SignupStepContainer>
          {signupStepNum !== SIGNUP_TERM_OF_SERVICE_STEP_VALUE && (
            <>
              {signupStepList
                .filter(
                  (value) =>
                    value.stepNum !== SIGNUP_TERM_OF_SERVICE_STEP_VALUE,
                )
                .map((value, key) => (
                  <SignupStepBoll
                    $isFinished={signupStepNum >= value.stepNum}
                    key={key}
                  />
                ))}
            </>
          )}
        </SignupStepContainer>
      }
    />
  );
};

const SignupStepContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const SignupStepBoll = styled.div<{ $isFinished: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 5px;
  background-color: ${(props) =>
    props.$isFinished ? theme.grey.Grey7 : theme.grey.Grey2};
`;

export default SignupHeader;
