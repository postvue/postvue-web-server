import PopupLayout from 'components/layouts/PopupLayout';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { isTagSearchPopupAtom } from 'states/TagAtom';

import WindowResizeSenceComponent from 'components/common/container/WindowResizeSenseComponent';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import TagSearchPopupBody from './TagSearchPopupBody';

interface TagSearchPopupProps {
  tagList: string[];
  setTagList: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagSearchPopup: React.FC<TagSearchPopupProps> = ({
  tagList,
  setTagList,
}) => {
  const setIsTagSearchPopupAtom = useSetRecoilState(isTagSearchPopupAtom);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  return (
    <>
      {windowSize.width <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <PopupLayout
          setIsPopup={setIsTagSearchPopupAtom}
          isTouchScrollBar={true}
          popupWrapStyle={PopupWrapStyle}
          hasFixedActive={false}
        >
          <TagSearchPopupBody tagList={tagList} setTagList={setTagList} />
        </PopupLayout>
      ) : (
        <RoundSquareCenterPopupLayout
          setIsPopup={setIsTagSearchPopupAtom}
          popupWrapStyle={{ height: '700px', width: '500px' }}
        >
          <TagSearchPopupBody tagList={tagList} setTagList={setTagList} />
        </RoundSquareCenterPopupLayout>
      )}

      <WindowResizeSenceComponent setWindowSize={setWindowSize} />
    </>
  );
};

const PopupWrapStyle: React.CSSProperties = {
  height: '85%',
};

export default TagSearchPopup;
