import { SignupInfo, termOfServiceInterface } from 'global/interface/signup';
import { atom } from 'recoil';

export const signupStepNumAtom = atom<number>({
  key: 'signupStepNum',
  default: 1,
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
      agreeToPrivacyPolicyToThirdPaties: false,
      agreeToMarketingCommunications: false,
    } as termOfServiceInterface,
  },
});

export const signupUsernameExistenceHashMapAtom = atom<Map<string, boolean>>({
  key: 'signupUsernameExistenceHashMap',
  default: new Map(),
});
