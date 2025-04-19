import React, { useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import {
  isTagSearchPopupAtom,
  tagSearchInputAtom,
  tagSearchQueryHashMapAtom,
} from 'states/TagAtom';

import BottomSnapSheetLayout from 'components/layouts/BottomSnapSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import theme from 'styles/theme';
import TagSearchPopupBody from './TagSearchPopupBody';
import TagSearchPopupHeader from './TagSearchPopupHeader';
import TagSelectedListElement from './TagSelectedListElement';

interface TagSearchPopupProps {
  tagList: string[];
  setTagList: React.Dispatch<React.SetStateAction<string[]>>;
  hasTransparentOverLay?: boolean;
}

const TagSearchPopup: React.FC<TagSearchPopupProps> = ({
  tagList,
  setTagList,
  hasTransparentOverLay = false,
}) => {
  const tagSearchInputRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const [isTagSearchPopup, setIsTagSearchPopup] =
    useRecoilState(isTagSearchPopupAtom);

  const [loading, setLoading] = useState(false); // Loading state

  const [tagSearchInput, setTagSearchInput] =
    useRecoilState(tagSearchInputAtom);

  const onSearchInputDelete = () => {
    setTagSearchInput('');
  };

  const saveTagToList = (searchQuery: string) => {
    if (!tagList.includes(searchQuery)) {
      setTagList((prev) => [...prev, searchQuery]);
    }
  };

  const onClickTagSearchQuery = (searchQuery: string) => {
    saveTagToList(searchQuery);
    onSearchInputDelete();
  };

  const [tagSearchQueryHashMap, setTagSearchQueryHashMap] = useRecoilState(
    tagSearchQueryHashMapAtom,
  );

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  const { windowWidth } = useWindowSize();

  return (
    <>
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        // <PopupLayout
        //   setIsPopup={setIsTagSearchPopup}
        //   isTouchScrollBar={true}
        //   popupWrapStyle={PopupWrapStyle}
        // >
        //   <TagSearchPopupBody
        //     tagList={tagList}
        //     setTagList={setTagList}
        //     tagSearchInput={tagSearchInput}
        //     setTagSearchInput={setTagSearchInput}
        //     loading={loading}
        //     onClickTagSearchQuery={onClickTagSearchQuery}
        //     tagSearchQueryHashMap={tagSearchQueryHashMap}
        //   />
        // </PopupLayout>
        <BottomSnapSheetLayout
          isOpen={isTagSearchPopup}
          onClose={() => setIsTagSearchPopup(false)}
          heightNum={
            window.innerHeight >
            theme.systemSize.appDisplaySize.minDeviceHeightNum
              ? window.innerHeight * (5 / 6)
              : window.innerHeight -
                theme.systemSize.appDisplaySize.popupMinusNumByMinDeviceNum
          }
          initDuration={0}
          bottomSheetHeader={
            <TagSearchPopupHeader
              tagSearchInputRef={tagSearchInputRef}
              onClose={() => setIsExternalCloseFunc(true)}
              tagSearchInput={tagSearchInput}
              tagSearchQueryHashMap={tagSearchQueryHashMap}
              setTagSearchQueryHashMap={setTagSearchQueryHashMap}
              onSearchInputDelete={onSearchInputDelete}
              setLoading={setLoading}
              saveTagToList={saveTagToList}
            />
          }
          BottomSheetBottom={
            <TagSelectedListElement tagList={tagList} setTagList={setTagList} />
          }
          isExternalCloseFunc={isExternalCloseFunc}
        >
          <TagSearchPopupBody
            tagSearchInput={tagSearchInput}
            setTagSearchInput={setTagSearchInput}
            loading={loading}
            onClickTagSearchQuery={onClickTagSearchQuery}
            tagSearchQueryHashMap={tagSearchQueryHashMap}
          />
        </BottomSnapSheetLayout>
      ) : (
        <>
          {isTagSearchPopup && (
            <RoundSquareCenterPopupLayout
              onClose={() => setIsTagSearchPopup(false)}
              popupWrapStyle={{ height: '90%' }}
              hasTransparentOverLay={hasTransparentOverLay}
              hasFixedActive={false}
            >
              <TagSearchPopupHeader
                tagSearchInputRef={tagSearchInputRef}
                onClose={() => setIsTagSearchPopup(false)}
                tagSearchInput={tagSearchInput}
                tagSearchQueryHashMap={tagSearchQueryHashMap}
                setTagSearchQueryHashMap={setTagSearchQueryHashMap}
                onSearchInputDelete={onSearchInputDelete}
                setLoading={setLoading}
                saveTagToList={saveTagToList}
              />
              <TagSearchPopupBody
                tagSearchInput={tagSearchInput}
                setTagSearchInput={setTagSearchInput}
                loading={loading}
                onClickTagSearchQuery={onClickTagSearchQuery}
                tagSearchQueryHashMap={tagSearchQueryHashMap}
              />
              <TagSelectedListElement
                tagList={tagList}
                setTagList={setTagList}
                TagSelectedContainerStyle={{ flexShrink: '0' }}
              />
            </RoundSquareCenterPopupLayout>
          )}
        </>
      )}
    </>
  );
};

export default TagSearchPopup;
