import { MapAddressRelation } from 'global/interface/map';
import {
  PostDocResourceImageRsp,
  PostUploadContent,
} from 'global/interface/post';
import { atom } from 'recoil';

export const isActivPostComposePopupAtom = atom<boolean>({
  key: 'isActivPostComposePopup',
  default: false,
});

export const isActivPostVideoComposePopupAtom = atom<boolean>({
  key: 'isActivPostVideoComposePopup',
  default: false,
});

export type PostEditType = 'image' | 'video' | '';

export const postEditActiveInfoPopupAtom = atom<{
  postId: string;
  type: PostEditType;
  isActive: boolean;
}>({
  key: 'postEditActiveInfoPopup',
  default: {
    postId: '',
    type: '',
    isActive: false,
  },
});

export const isActivPostComposeSelectPopupAtom = atom<boolean>({
  key: 'isActivPostComposeSelectPopup',
  default: false,
});

export const isNotSupportVideoConfirmPopupAtom = atom<boolean>({
  key: 'isNotSupportVideoConfirmPopup',
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

export const uploadResourceListAtom = atom<PostUploadContent[]>({
  key: 'uploadResourceList',
  default: [],
});

// export const postContentSortListAtom = atom<PostUploadContentSort[]>({
//   key: 'postContentSortList',
//   default: [],
// });

export const isActivPostComposeTargetAudiencePopupAtom = atom<boolean>({
  key: 'isActivPostComposeTargetAudiencePopup',
  default: false,
});

export const isActivPostComposeVideoSelectTypePopupAtom = atom<boolean>({
  key: 'isActivPostComposeVideoSelectTypePopup',
  default: false,
});

export const isActivPostComposeLocationPopupAtom = atom<boolean>({
  key: 'isActivPostComposeLocationPopup',
  default: false,
});

export const postComposeAddressRelationAtom = atom<MapAddressRelation>({
  key: 'poseComposeAddressRelation',
  default: {
    roadAddr: '',
    buildName: '',
    latitude: 0,
    longitude: 0,
  },
});
