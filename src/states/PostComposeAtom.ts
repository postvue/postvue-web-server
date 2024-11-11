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

export const isActivPostComposeTargetAudiencePopupAtom = atom<boolean>({
  key: 'isActivPostComposeTargetAudiencePopup',
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
  },
});
