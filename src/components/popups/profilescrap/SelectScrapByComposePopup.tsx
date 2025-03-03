import { ScrapThumnailInfo } from 'components/common/body/ProfileScrapThumbnailListView';
import BottomSnapSheetLayout from 'components/layouts/BottomSnapSheetLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { selectScrapByComposePopupInfoAtom } from 'states/ProfileAtom';
import ScrapViewPopupBody from './ScrapViewPopupBody';
import SelectScrapByComposeButton from './SelectScrapByComposeButton';
import SelectScrapByComposeHeader from './SelectScrapByComposeHeader';

const SelectScrapByComposePopup: React.FC = () => {
  // 클립 관련 상태 관리
  const [selectScrapByComposePopupInfo, setSelectScrapByComposePopupInfo] =
    useRecoilState(selectScrapByComposePopupInfoAtom);

  const [isExternalCloseFunc, setIsExternalCloseFunc] =
    useState<boolean>(false);

  const [selectedScrapList, setSelectedScrapList] = useState<
    ScrapThumnailInfo[]
  >([]);

  const { windowWidth } = useWindowSize();

  const actionFunc = () => {
    setSelectScrapByComposePopupInfo((prev) => ({
      ...prev,
      scrapInfoList: selectedScrapList,
    }));
    setIsExternalCloseFunc(true);
  };

  const actionFuncByPc = () => {
    setSelectScrapByComposePopupInfo((prev) => ({
      ...prev,
      scrapInfoList: selectedScrapList,
    }));
    onClose();
  };

  const onClose = () => {
    setSelectScrapByComposePopupInfo((prev) => ({
      ...prev,
      isActive: false,
    }));
  };

  useEffect(() => {
    setSelectedScrapList(selectScrapByComposePopupInfo.scrapInfoList);
    return () => {
      onClose();
    };
  }, []);

  return (
    <>
      {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <BottomSnapSheetLayout
          isOpen={selectScrapByComposePopupInfo.isActive}
          onClose={onClose}
          bottomSheetHeader={<SelectScrapByComposeHeader />}
          heightNum={600}
          isExternalCloseFunc={isExternalCloseFunc}
          BottomSheetBottom={
            <SelectScrapByComposeButton
              onClose={onClose}
              selectedScrapList={selectedScrapList}
              actionFunc={actionFunc}
            />
          }
        >
          <ScrapViewPopupBody
            selectedScrapList={selectedScrapList}
            setSelectedScrapList={setSelectedScrapList}
            ScrapViewPopupBodyStyle={{
              position: 'relative',
              height: '100%',
              minHeight: 'auto',
            }}
          />
        </BottomSnapSheetLayout>
      ) : (
        <>
          <RoundSquareCenterPopupLayout
            onClose={onClose}
            popupWrapStyle={{ height: '90%', width: '500px' }}
          >
            <SelectScrapByComposeHeader
              SelectScrapByComposeHeaderContainerStyle={{ flexShrink: '0' }}
            />
            <ScrapViewPopupBody
              selectedScrapList={selectedScrapList}
              setSelectedScrapList={setSelectedScrapList}
              ScrapViewPopupBodyStyle={{
                flexGrow: '1',
                overflow: 'auto',
                minHeight: 'auto',
              }}
            />
            <SelectScrapByComposeButton
              onClose={onClose}
              selectedScrapList={selectedScrapList}
              actionFunc={actionFuncByPc}
            />
          </RoundSquareCenterPopupLayout>
        </>
      )}
    </>
  );
};

export default SelectScrapByComposePopup;
