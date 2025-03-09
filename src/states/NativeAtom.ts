import { BridgeEventImageNativeUploadInfoInterface } from 'const/ReactNativeConst';
import { atom } from 'recoil';

export const nativeUploadImgFileAtom = atom<{
  imgFile: File | null;
  imgBlob: Blob | null;
  uploadInfo: BridgeEventImageNativeUploadInfoInterface | null;
}>({
  key: 'nativeUploadImgFile',
  default: {
    imgFile: null,
    imgBlob: null,
    uploadInfo: null,
  },
});
