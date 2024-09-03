import { atom } from 'recoil';
import { INIT_CURSOR_ID } from '../const/PageConfigConst';
import { TargetAudienceCategory } from '../const/ScrapConst';
import { MyAccountSettingInterface } from '../global/interface/localstorage/MyAccountSettingInterface';
import { PostRsp } from '../global/interface/post';
import {
  MyProfileClip,
  MyProfileScrap,
  MyProfileScrapList,
  TargetAudienceInterface,
} from '../global/interface/profile';

export const myProfileSettingInfoAtom = atom<MyAccountSettingInterface>({
  key: 'myProfileSEttingInfo',
  default: {
    myUserId: '',
    username: '',
    profilePath: '',
  },
});

export const myProfileScrapListAtom = atom<MyProfileScrapList[]>({
  key: 'myProfileScrapList',
  default: [],
});

export const cursorIdByScrapListAtom = atom<string>({
  key: 'cursorIdByScrapList',
  default: INIT_CURSOR_ID,
});

export const myProfileClipListAtom = atom<MyProfileClip[]>({
  key: 'myProfileClipList',
  default: [],
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
