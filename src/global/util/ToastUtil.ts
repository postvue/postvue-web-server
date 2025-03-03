import { notify } from 'components/popups/ToastMsgPopup';
import { PROFILE_URL_CLIP_BOARD_TEXT } from 'const/SystemPhraseConst';
import React from 'react';
import { copyClipBoard } from './CopyUtil';

export async function onClickClipBoardCopyButton(
  copyText: string,
  msgIcon?: React.ReactNode,
): Promise<void> {
  try {
    copyClipBoard(copyText);

    notify({ msgIcon: msgIcon, msgTitle: PROFILE_URL_CLIP_BOARD_TEXT });
  } catch (e) {
    alert(e);
  }
}
