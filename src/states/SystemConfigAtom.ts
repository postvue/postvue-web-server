import { atom } from 'recoil';

export const isLoadingPopupAtom = atom<boolean>({
  key: 'isLoadingPopup',
  default: false,
});

export const serviceUsageTimerStateAtom = atom<boolean>({
  key: 'serviceUsageTimerState', // 전역 상태의 고유한 key
  default: false, // 기본값은 0입니다.
});

export const windowSizeAtom = atom({
  key: 'windowSize',
  default: {
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
  },
});
