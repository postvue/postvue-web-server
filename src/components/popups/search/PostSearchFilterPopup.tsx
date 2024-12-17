import BottomSheetLayout from 'components/layouts/BottomSheetLayout';
import React from 'react';
import { useRecoilState } from 'recoil';
import { isActiveSearchPostFilterPopupAtom } from 'states/SearchPostAtom';
import PostSearchFilterPopupBody from './PostSearchFilterPopupBody';

interface PostSearchFilterPopupProps {
  searchWord: string;
}

const PostSearchFilterPopup: React.FC<PostSearchFilterPopupProps> = ({
  searchWord,
}) => {
  const [isActiveSearchPostFilterPopup, setIsActiveSearchPostFilterPopup] =
    useRecoilState(isActiveSearchPostFilterPopupAtom);

  return (
    //   <PopupLayout
    //     setIsPopup={setIsActiveSearchPostFilterPopup}
    //     isTouchScrollBar={true}
    //     popupWrapStyle={popupWrapStyle}
    //   >
    //     <PostSearchFilterPopupBody searchWord={searchWord} />
    //   </PopupLayout>
    //   <Sheet
    //   isOpen={isActiveSearchPostFilterPopup}
    //   onClose={() => setIsActiveSearchPostFilterPopup(false)}
    // >
    // <Sheet>
    //   <Sheet.Container>
    //     <Sheet.Header />
    //     <Sheet.Content>
    //       {<PostSearchFilterPopupBody searchWord={searchWord} />}
    //     </Sheet.Content>
    //   </Sheet.Container>
    //   <Sheet.Backdrop />

    // </Sheet>

    <BottomSheetLayout
      isOpen={isActiveSearchPostFilterPopup}
      onClose={() => setIsActiveSearchPostFilterPopup(false)}
      heightNum={300}
    >
      <PostSearchFilterPopupBody searchWord={searchWord} />
    </BottomSheetLayout>
  );
};

export default PostSearchFilterPopup;
