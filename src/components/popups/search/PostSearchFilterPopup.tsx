import React from 'react';
import { useSetRecoilState } from 'recoil';
import { isActiveSearchPostFilterPopupAtom } from 'states/SearchPostAtom';
import PopupLayout from '../../layouts/PopupLayout';
import PostSearchFilterPopupBody from './PostSearchFilterPopupBody';

interface PostSearchFilterPopupProps {
  searchWord: string;
}

const popupWrapStyle: React.CSSProperties = {
  height: 'auto',
};

const PostSearchFilterPopup: React.FC<PostSearchFilterPopupProps> = ({
  searchWord,
}) => {
  const setIsActiveSearchPostFilterPopup = useSetRecoilState(
    isActiveSearchPostFilterPopupAtom,
  );

  return (
    <PopupLayout
      setIsPopup={setIsActiveSearchPostFilterPopup}
      isTouchScrollBar={true}
      popupWrapStyle={popupWrapStyle}
    >
      <PostSearchFilterPopupBody searchWord={searchWord} />
    </PopupLayout>
  );
};

export default PostSearchFilterPopup;
