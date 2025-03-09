import { SignupInfo, termOfServiceInterface } from 'global/interface/signup';
import { atom } from 'recoil';

export const signupStepNumAtom = atom<number>({
  key: 'signupStepNum',
  default: 1,
});

export const signStepTransitionInfoAtom = atom<{
  inTransition: boolean;
  direction: string;
}>({
  key: 'signStepTransitionInfo',
  default: {
    inTransition: false,
    direction: 'left',
  },
});

export const signupInfoAtom = atom<SignupInfo>({
  key: 'signupInfo',
  default: {
    username: '',
    nickname: '',
    birthdate: '',
    gender: '',
    favoriteTagList: [],
    termOfService: {
      agreeToAgeTerm: false,
      agreeToServieTerm: false,
      agreeToPrivacyPolicy: false,
      agreeToTermsOfUserGeoLocation: false,
      agreeToPrivacyPolicyToThirdPaties: false,
      agreeToMarketingCommunications: false,
    } as termOfServiceInterface,
  },
});

export const checkSignStepValueAtom = atom<{ isActive: boolean }>({
  key: 'checkSignStepValue',
  default: {
    isActive: false,
  },
});

export const signupUsernameExistenceHashMapAtom = atom<Map<string, boolean>>({
  key: 'signupUsernameExistenceHashMap',
  default: new Map(),
});

export const SignupEmailPopupAtom = atom<boolean>({
  key: 'signupEmailPopupInfo',
  default: false,
});
