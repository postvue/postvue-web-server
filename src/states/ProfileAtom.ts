import { atom } from 'recoil';
import { GetProfileScrapInfoRsp } from 'services/profile/getProfileScrapInfo';
import { INIT_CURSOR_ID } from '../const/PageConfigConst';
import { TargetAudienceCategory } from '../const/ScrapConst';
import { PostProfileInfoRsp, PostRsp } from '../global/interface/post';
import {
  MyProfileClip,
  MyProfileScrap,
  ProfileScrapList,
  TargetAudienceInterface,
} from '../global/interface/profile';

export const myProfileScrapListAtom = atom<ProfileScrapList[]>({
  key: 'myProfileScrapList',
  default: [],
});

export const cursorIdByScrapListAtom = atom<string>({
  key: 'cursorIdByScrapList',
  default: INIT_CURSOR_ID,
});

export const myProfileClipHashMapAtom = atom<Map<string, MyProfileClip>>({
  key: 'myProfileClipHashMap',
  default: new Map(),
});

export const cursorIdByClipListAtom = atom<string>({
  key: 'cursorIdByClipList',
  default: INIT_CURSOR_ID,
});

export const myProfileScrapAtom = atom<MyProfileScrap[]>({
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

export const profilePostHashMapAtom = atom<Map<string, PostRsp>>({
  key: 'profilePostHashMap',
  default: new Map(),
});

export const cursorIdByProfilePostListAtom = atom<string>({
  key: 'cursorIdByProfilePostList',
  default: INIT_CURSOR_ID,
});

export const isActiveScrapViewPopupAtom = atom<boolean>({
  key: 'isActiveScrapViewPopup',
  default: false,
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

export const profileScrapInfoAtom = atom<GetProfileScrapInfoRsp>({
  key: 'myProfileScrapInfo',
  default: { scrapId: '', scrapName: '', scrapNum: 0, lastPostedAt: '' },
});

export const isActiveProfileScarpTargetAudPopupAtom = atom<boolean>({
  key: 'isActiveProfileScarpTargetAudPopup',
  default: false,
});

export const isActiveProfileAccountPopupAtom = atom<boolean>({
  key: 'isActiveProfileAccountPopup',
  default: false,
});

export const isActivePrivateProfileConfirmPopupAtom = atom<boolean>({
  key: 'isActivePrivateProfileConfirmPopup',
  default: false,
});

export const isActiveScrapViewPopupByMasonryAtom = atom<boolean>({
  key: 'isActiveScrapViewPopupByMasonry',
  default: false,
});
