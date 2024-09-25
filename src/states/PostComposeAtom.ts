import {
  PostComposeUploadResource,
  PostDocResourceImageRsp,
} from 'global/interface/post';
import { atom } from 'recoil';

export const isActivPostComposePopupAtom = atom<boolean>({
  key: 'isActivPostComposePopup',
  default: false,
});

export const isActivPostComposeBySourceUrlPopupAtom = atom<boolean>({
  key: 'isActivPostComposeBySourceUrlPopup',
  default: false,
});

export const postComposeBySourceUrlListAtom = atom<PostDocResourceImageRsp[]>({
  key: 'postComposeBySourceUrlList',
  default: [],
});

export const uploadResourceLinkListAtom = atom<PostComposeUploadResource[]>({
  key: 'uploadResourceLinkList',
  default: [],
});

export const isActivPostComposeTargetAudiencePopupAtom = atom<boolean>({
  key: 'isActivPostComposeTargetAudiencePopup',
  default: false,
});
