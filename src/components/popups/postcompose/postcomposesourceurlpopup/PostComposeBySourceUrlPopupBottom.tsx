import BottomNextButton from 'components/common/buttton/BottomNextButton';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { uploadResourceListAtom } from 'states/PostComposeAtom';

interface PostComposeBySourceUrlPopupBottomProps {
  bottomNextButtonActionFunc: () => void;
  PostComposeBySourceUrlPopupBottomStyle?: React.CSSProperties;
}

const PostComposeBySourceUrlPopupBottom: React.FC<
  PostComposeBySourceUrlPopupBottomProps
> = ({
  bottomNextButtonActionFunc,
  PostComposeBySourceUrlPopupBottomStyle,
}) => {
  const uploadResourceList = useRecoilValue(uploadResourceListAtom);
  return (
    <>
      <BottomNextButton
        title={'다음으로'}
        notActiveTitle={'다음으로'}
        isTransparent={true}
        actionFunc={bottomNextButtonActionFunc}
        isActive={uploadResourceList.length >= 1}
        BottomNextButtonWrapContainerStyle={
          PostComposeBySourceUrlPopupBottomStyle
        }
      />
    </>
  );
};

export default PostComposeBySourceUrlPopupBottom;
