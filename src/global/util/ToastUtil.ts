import { notify } from 'components/popups/ToastMsgPopup';
import { PROFILE_URL_CLIP_BOARD_TEXT } from 'const/SystemPhraseConst';
import { copyClipBoard } from './CopyUtil';

export async function onClickClipBoardCopyButton(
  copyText: string,
): Promise<void> {
  try {
    copyClipBoard(copyText);

    notify(PROFILE_URL_CLIP_BOARD_TEXT);
  } catch (e) {
    alert(e);
  }
}
