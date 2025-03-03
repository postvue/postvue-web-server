import { PROFILE_SCRAP_TAB_ID } from 'const/TabConfigConst';
import { atom } from 'recoil';
import { INIT_CURSOR_ID } from '../const/PageConfigConst';
import { TargetAudienceCategory } from '../const/ScrapConst';
import { PostProfileInfoRsp, PostRsp } from '../global/interface/post';
import { TargetAudienceInterface } from '../global/interface/profile';

export const cursorIdByScrapListAtom = atom<string>({
  key: 'cursorIdByScrapList',
  default: INIT_CURSOR_ID,
});

// export const myProfileClipHashMapAtom = atom<Map<string, MyProfileClip>>({
//   key: 'myProfileClipHashMap',
//   default: new Map(),
// });

export const cursorIdByClipListAtom = atom<string>({
  key: 'cursorIdByClipList',
  default: INIT_CURSOR_ID,
});

export const myProfileScrapAtom = atom<PostRsp[]>({
  key: 'myProfileScrap',
  default: [],
});

export const cursorIdByScrapAtom = atom<string>({
  key: 'cursorIdByScrap',
  default: INIT_CURSOR_ID,
});

export const scrapTargetAudienceAtom = atom<TargetAudienceInterface>({
  key: 'scrapTargetAudience',
  default: TargetAudienceCategory.PUBLIC_TARGET_AUDIENCE,
});

// export const profilePostHashMapAtom = atom<Map<string, PostRsp>>({
//   key: 'profilePostHashMap',
//   default: new Map(),
// });

export const cursorIdByProfilePostListAtom = atom<string>({
  key: 'cursorIdByProfilePostList',
  default: INIT_CURSOR_ID,
});

export const isActiveProfileBlockPopupAtom = atom<boolean>({
  key: 'isActiveProfileBlockPopup',
  default: false,
});

export const myProfileFollowingHashMapAtom = atom<
  Map<string, PostProfileInfoRsp>
>({
  key: 'myProfileFollowingHashMap',
  default: new Map(),
});

export const cursorIdByMyProfileFollowingAtom = atom<string>({
  key: 'cursorIdByMyProfileFollowingAtom',
  default: INIT_CURSOR_ID,
});

export const isActiveProfileScarpTargetAudPopupAtom = atom<boolean>({
  key: 'isActiveProfileScarpTargetAudPopup',
  default: false,
});

export const activeProfileAccountPopupInfoAtom = atom<{
  isActive: boolean;
  userId: string;
  username: string;
}>({
  key: 'activeProfileAccountPopupInfo',
  default: {
    isActive: false,
    userId: '',
    username: '',
  },
});

export const isActivePrivateProfileConfirmPopupAtom = atom<boolean>({
  key: 'isActivePrivateProfileConfirmPopup',
  default: false,
});

export const activeScrapViewPopupInfoAtom = atom<{
  isActive: boolean;
  snsPost: PostRsp | null;
}>({
  key: 'activeScrapViewPopupInfo',
  default: {
    isActive: false,
    snsPost: null,
  },
});

export const activeMapScrapPopupAtom = atom<{
  isActive: boolean;
  scrapId: string;
}>({
  key: 'activeMapScrapPopup',
  default: {
    isActive: false,
    scrapId: '',
  },
});

export const selectScrapByComposePopupInfoAtom = atom<{
  isActive: boolean;
  scrapInfoList: { scrapId: string; scrapName: string }[];
}>({
  key: 'selectScrapByComposePopupInfo',
  default: {
    isActive: false,
    scrapInfoList: [],
  },
});

export const scrapTabInfoAtom = atom<{
  activeTabId: number;
  scrollInfo: { isActive: boolean; scroll: number };
}>({
  key: 'profileScrapTabId',
  default: {
    activeTabId: PROFILE_SCRAP_TAB_ID,
    scrollInfo: {
      isActive: false,
      scroll: 0,
    },
  },
});

export const activeProfileAccountComplaintPopupAtom = atom<{
  isActive: boolean;
  userId: string;
  username: string;
}>({
  key: 'activeProfileAccountComplaintPopup',
  default: {
    isActive: false,
    userId: '',
    username: '',
  },
});
